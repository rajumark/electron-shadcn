import { os } from "@orpc/server";
import { z } from "zod";
import { ADBHelper } from "@/utils/adb-helper";

// File interface matching the Aya project
export interface IFile {
  name: string;
  directory: boolean;
  mtime: Date;
  mode: string;
  size?: number;
  mime?: string;
}

// Transfer type for file operations
export enum TransferType {
  Download = "download",
  Upload = "upload",
}

// Helper function to parse ls -al output
function parseLsLine(line: string): IFile | null {
  line = line.trim();
  const match = line.match(/^([drwxs-]+)\s+(\d+)\s+(\S+)\s+(\S+)\s+(\d+)\s+(\d{4}-\d{2}-\d{2})\s+(\d{2}:\d{2})\s+(.+)$/);
  if (!match) {
    return null;
  }
  const name = match[8];
  if (name === '.' || name === '..') {
    return null;
  }
  return {
    name,
    directory: match[1][0] === 'd',
    mtime: new Date(`${match[6]} ${match[7]}`),
    mode: match[1],
    size: parseInt(match[5], 10),
  };
}

// Helper function to check if device is rooted
async function isRooted(deviceId: string): Promise<boolean> {
  try {
    const result = await ADBHelper.executeADBCommand([
      "-s", deviceId, "shell", "id"
    ]);
    return result.includes('uid=0');
  } catch {
    return false;
  }
}

// Helper function to execute shell commands with run-as fallback
async function executeShellCommand(
  deviceId: string,
  cmd: string,
  path: string,
  dest?: string
): Promise<string> {
  if (
    path.startsWith('/data/data/') ||
    (dest && dest.startsWith('/data/data/'))
  ) {
    const rooted = await isRooted(deviceId);
    if (!rooted) {
      let segments: string[] = [];
      if (dest && dest.startsWith('/data/data/')) {
        segments = dest.replace('/data/data/', '').split('/');
      } else {
        segments = path.replace('/data/data/', '').split('/');
      }
      const pkg = segments[0];
      const fullCmd = `run-as ${pkg} ${cmd} "${path}"${dest ? ` "${dest}"` : ''}`;
      console.log('=== DEBUG: Executing run-as command:', fullCmd);
      return await ADBHelper.executeADBCommand(["-s", deviceId, "shell", fullCmd]);
    }
  }

  const fullCmd = `${cmd} "${path}"${dest ? ` "${dest}"` : ''}`;
  console.log('=== DEBUG: Executing shell command:', fullCmd);
  return await ADBHelper.executeADBCommand(["-s", deviceId, "shell", fullCmd]);
}

// Read directory
export const readDir = os
  .input(
    z.object({
      deviceId: z.string(),
      path: z.string(),
    })
  )
  .handler(async ({ input }) => {
    try {
      const { deviceId, path } = input;

      // Handle protected directories
      if (path.startsWith('/data/') && !path.startsWith('/data/local/tmp/')) {
        const rooted = await isRooted(deviceId);
        if (!rooted) {
          return await readDataDir(deviceId, path);
        }
      }

      // Standard directory listing
      const result = await ADBHelper.executeADBCommand([
        "-s", deviceId, "shell", "ls", "-la", `"${path}"`
      ]);

      const files: IFile[] = [];
      const lines = result.split('\n');

      for (const line of lines) {
        const file = parseLsLine(line);
        if (file) {
          files.push(file);
        }
      }

      return {
        success: true,
        data: files,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
        data: [],
      };
    }
  });

// Helper function for /data directory reading
async function readDataDir(deviceId: string, path: string): Promise<{ success: boolean; data: IFile[]; error?: string }> {
  if (path.startsWith('/data/app/')) {
    return await readDataAppDir(deviceId, path);
  } else if (path.startsWith('/data/data/')) {
    return await readDataDataDir(deviceId, path);
  }

  // Basic /data directory structure
  const stat = await statFile(deviceId, '/data');
  if (!stat.success) {
    return { success: false, data: [], error: stat.error };
  }

  if (path === '/data/local/') {
    return {
      success: true,
      data: [
        {
          name: 'tmp',
          directory: true,
          mtime: stat.data!.mtime,
          mode: stat.data!.mode,
          size: stat.data!.size,
        },
      ],
    };
  }

  return {
    success: true,
    data: ['data', 'app', 'local'].map(name => ({
      name,
      directory: true,
      mtime: stat.data!.mtime,
      mode: stat.data!.mode,
      size: stat.data!.size,
    })),
  };
}

// Helper function for /data/app directory
async function readDataAppDir(deviceId: string, path: string): Promise<{ success: boolean; data: IFile[]; error?: string }> {
  try {
    const packages = await ADBHelper.executeADBCommand([
      "-s", deviceId, "shell", "pm", "list", "packages", "-f"
    ]);
    
    const prefix = `package:${path}`;
    const lines = packages
      .split('\n')
      .filter(line => line.trim() !== '' && line.includes(prefix));

    const files: IFile[] = [];
    const seen = new Set<string>();

    for (const line of lines) {
      const segments = line.slice(prefix.length).split('/');
      if (segments.length > 1) {
        const folderName = segments[0];
        if (!seen.has(folderName)) {
          seen.add(folderName);
          files.push({
            name: folderName,
            directory: true,
            mtime: new Date(),
            mode: 'drwxr-xr-x',
            size: 0,
          });
        }
      } else {
        const fileName = segments[0];
        if (fileName.includes('.apk')) {
          const apkName = fileName.split('.apk')[0] + '.apk';
          if (!seen.has(apkName)) {
            seen.add(apkName);
            files.push({
              name: apkName,
              directory: false,
              mtime: new Date(),
              mode: '-rw-r--r--',
              size: 0,
            });
          }
        }
      }
    }

    return { success: true, data: files };
  } catch (error) {
    return {
      success: false,
      data: [],
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

// Helper function for /data/data directory
async function readDataDataDir(deviceId: string, path: string): Promise<{ success: boolean; data: IFile[]; error?: string }> {
  if (path === '/data/data/') {
    try {
      const packages = await ADBHelper.executeADBCommand([
        "-s", deviceId, "shell", "pm", "list", "packages"
      ]);
      
      const packageNames = packages
        .split('\n')
        .filter(line => line.startsWith('package:'))
        .map(line => line.replace('package:', '').trim());

      return {
        success: true,
        data: packageNames.map(pkg => ({
          name: pkg,
          directory: true,
          mtime: new Date(),
          mode: 'drwxr-xr-x',
          size: 0,
        })),
      };
    } catch (error) {
      return {
        success: false,
        data: [],
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  }

  try {
    const ls = await executeShellCommand(deviceId, 'ls -al', path);
    
    if (ls.includes('not debuggable')) {
      return { success: true, data: [] };
    }

    const files: IFile[] = [];
    const lines = ls.split('\n');

    for (const line of lines) {
      const file = parseLsLine(line);
      if (file) {
        files.push(file);
      }
    }

    return { success: true, data: files };
  } catch (error) {
    return {
      success: false,
      data: [],
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

// Stat file
export const statFile = os
  .input(
    z.object({
      deviceId: z.string(),
      path: z.string(),
    })
  )
  .handler(async ({ input }) => {
    try {
      const { deviceId, path } = input;

      if (path.startsWith('/data/data/')) {
        const rooted = await isRooted(deviceId);
        if (!rooted) {
          const ls = await executeShellCommand(deviceId, 'ls -ld', path);
          const item = parseLsLine(ls.trim());
          if (!item) {
            throw new Error(`Failed to stat file: ${path}`);
          }
          return {
            success: true,
            data: {
              size: item.size || 0,
              mtime: item.mtime,
              directory: item.directory,
              mode: item.mode,
            },
          };
        }
      }

      const result = await ADBHelper.executeADBCommand([
        "-s", deviceId, "shell", "stat", `"${path}"`
      ]);

      // Parse stat output (simplified parsing)
      const sizeMatch = result.match(/Size:\s+(\d+)/);
      const size = sizeMatch ? parseInt(sizeMatch[1]) : 0;
      
      const modifyMatch = result.match(/Modify:\s+(\d{4}-\d{2}-\d{2})\s+(\d{2}:\d{2}:\d{2})/);
      const mtime = modifyMatch ? new Date(`${modifyMatch[1]} ${modifyMatch[2]}`) : new Date();

      const directory = result.includes('directory');

      return {
        success: true,
        data: {
          size,
          mtime,
          directory,
          mode: directory ? 'drwxr-xr-x' : '-rw-r--r--',
        },
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
        data: null,
      };
    }
  });

// Create directory
export const createDir = os
  .input(
    z.object({
      deviceId: z.string(),
      path: z.string(),
    })
  )
  .handler(async ({ input }) => {
    try {
      const { deviceId, path } = input;
      console.log('=== DEBUG: Creating folder with path:', path);
      await executeShellCommand(deviceId, 'mkdir -p', path);
      return { success: true };
    } catch (error) {
      console.error('=== DEBUG: Create folder error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  });

// Delete file
export const deleteFile = os
  .input(
    z.object({
      deviceId: z.string(),
      path: z.string(),
    })
  )
  .handler(async ({ input }) => {
    try {
      const { deviceId, path } = input;
      await executeShellCommand(deviceId, 'rm', path);
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  });

// Delete directory
export const deleteDir = os
  .input(
    z.object({
      deviceId: z.string(),
      path: z.string(),
    })
  )
  .handler(async ({ input }) => {
    try {
      const { deviceId, path } = input;
      await executeShellCommand(deviceId, 'rm -rf', path);
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  });

// Move file
export const moveFile = os
  .input(
    z.object({
      deviceId: z.string(),
      src: z.string(),
      dest: z.string(),
    })
  )
  .handler(async ({ input }) => {
    try {
      const { deviceId, src, dest } = input;
      await executeShellCommand(deviceId, 'mv', src, dest);
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  });

export const files = {
  readDir,
  statFile,
  createDir,
  deleteFile,
  deleteDir,
  moveFile,
};

import { useCallback, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { useSelectedDevice } from "@/hooks/use-selected-device";
import { ipc } from "@/ipc/manager";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { 
  RefreshCw, 
  ArrowLeft, 
  ArrowRight, 
  ArrowUp, 
  Folder, 
  File, 
  Grid3X3, 
  List, 
  Upload,
  Download,
  Trash2,
  Edit3,
  Plus,
  Search,
  Eye,
  X
} from "lucide-react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";

interface IFile {
  name: string;
  directory: boolean;
  mtime: Date;
  mode: string;
  size?: number;
  mime?: string;
}

interface Transfer {
  id: string;
  type: 'download' | 'upload';
  src: string;
  dest: string;
  size: number;
  transferred: number;
  startTime: Date;
}

function FileExplorer() {
  const { t } = useTranslation();
  const { selectedDevice } = useSelectedDevice();
  
  // File list state
  const [files, setFiles] = useState<IFile[]>([]);
  const [currentPath, setCurrentPath] = useState('/storage/emulated/0/');
  const [customPath, setCustomPath] = useState('/storage/emulated/0/');
  const [filter, setFilter] = useState('');
  const [selectedFile, setSelectedFile] = useState<IFile | null>(null);
  
  // Navigation state
  const [history, setHistory] = useState<string[]>(['/storage/emulated/0/']);
  const [historyIndex, setHistoryIndex] = useState(0);
  
  // UI state
  const [listView, setListView] = useState(false);
  const [showTransfers, setShowTransfers] = useState(false);
  const [showPreview, setShowPreview] = useState(true);
  const [transfers, setTransfers] = useState<Transfer[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [dropHighlight, setDropHighlight] = useState(false);
  
  // Dialog states
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [renameDialogOpen, setRenameDialogOpen] = useState(false);
  const [newFolderDialogOpen, setNewFolderDialogOpen] = useState(false);
  const [newName, setNewName] = useState('');
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load files for current path
  const loadFiles = useCallback(async (path: string) => {
    if (!selectedDevice) return;
    
    setIsLoading(true);
    try {
      const result = await ipc.client.adb.files.readDir({ deviceId: selectedDevice.id, path });
      if (result.success) {
        setFiles(result.data);
        setCurrentPath(path);
        setCustomPath(path);
        setFilter('');
      } else {
        toast.error(t('fileExplorer.loadError', { error: result.error }));
      }
    } catch (error) {
      toast.error(t('fileExplorer.loadError', { error: error instanceof Error ? error.message : 'Unknown error' }));
    } finally {
      setIsLoading(false);
    }
  }, [selectedDevice, t]);

  // Navigation functions
  const navigateTo = useCallback((path: string) => {
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(path);
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
    loadFiles(path);
  }, [history, historyIndex, loadFiles]);

  const goBack = useCallback(() => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      setHistoryIndex(newIndex);
      loadFiles(history[newIndex]);
    }
  }, [history, historyIndex, loadFiles]);

  const goForward = useCallback(() => {
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1;
      setHistoryIndex(newIndex);
      loadFiles(history[newIndex]);
    }
  }, [history, historyIndex, loadFiles]);

  const goUp = useCallback(() => {
    const parentPath = currentPath.split('/').slice(0, -2).join('/') + '/';
    if (parentPath === '/' || parentPath === '') {
      navigateTo('/storage/emulated/0/');
    } else {
      navigateTo(parentPath);
    }
  }, [currentPath, navigateTo]);

  const refresh = useCallback(() => {
    loadFiles(currentPath);
  }, [currentPath, loadFiles]);

  // File operations
  const openFile = useCallback(async (file: IFile) => {
    if (!selectedDevice) return;

    if (file.directory) {
      navigateTo(currentPath + file.name + '/');
      return;
    }

    // For now, just download and open with system default
    try {
      toast.info(t('fileExplorer.downloading', { name: file.name }));
      // TODO: Implement download and open functionality
      toast.success(t('fileExplorer.downloaded', { name: file.name }));
    } catch (error) {
      toast.error(t('fileExplorer.downloadError', { error: error instanceof Error ? error.message : 'Unknown error' }));
    }
  }, [selectedDevice, currentPath, navigateTo, t]);

  const deleteFile = useCallback(async (file: IFile) => {
    if (!selectedDevice) return;

    try {
      const filePath = currentPath + file.name;
      if (file.directory) {
        await ipc.client.adb.files.deleteDir({ deviceId: selectedDevice.id, path: filePath });
      } else {
        await ipc.client.adb.files.deleteFile({ deviceId: selectedDevice.id, path: filePath });
      }
      toast.success(t('fileExplorer.deleted', { name: file.name }));
      loadFiles(currentPath);
    } catch (error) {
      toast.error(t('fileExplorer.deleteError', { error: error instanceof Error ? error.message : 'Unknown error' }));
    }
  }, [selectedDevice, currentPath, loadFiles, t]);

  const renameFile = useCallback(async (file: IFile, newName: string) => {
    if (!selectedDevice || !newName || newName === file.name) return;

    // Check if file already exists
    if (files.some(f => f.name === newName)) {
      toast.error(t('fileExplorer.fileExists', { name: newName }));
      return;
    }

    try {
      const oldPath = currentPath + file.name;
      const newPath = currentPath + newName;
      await ipc.client.adb.files.moveFile({ deviceId: selectedDevice.id, src: oldPath, dest: newPath });
      toast.success(t('fileExplorer.renamed', { oldName: file.name, newName }));
      loadFiles(currentPath);
    } catch (error) {
      toast.error(t('fileExplorer.renameError', { error: error instanceof Error ? error.message : 'Unknown error' }));
    }
  }, [selectedDevice, currentPath, files, loadFiles, t]);

  const createFolder = useCallback(async (name: string) => {
    if (!selectedDevice || !name) return;

    // Check if folder already exists
    if (files.some(f => f.name === name)) {
      toast.error(t('fileExplorer.folderExists', { name }));
      return;
    }

    try {
      const folderPath = currentPath + name;
      await ipc.client.adb.files.createDir({ deviceId: selectedDevice.id, path: folderPath });
      toast.success(t('fileExplorer.folderCreated', { name }));
      loadFiles(currentPath);
    } catch (error) {
      toast.error(t('fileExplorer.createFolderError', { error: error instanceof Error ? error.message : 'Unknown error' }));
    }
  }, [selectedDevice, currentPath, files, loadFiles, t]);

  const uploadFiles = useCallback(async (fileList: FileList) => {
    if (!selectedDevice) return;

    for (let i = 0; i < fileList.length; i++) {
      const file = fileList[i];
      try {
        toast.info(t('fileExplorer.uploading', { name: file.name }));
        // TODO: Implement file upload functionality
        toast.success(t('fileExplorer.uploaded', { name: file.name }));
      } catch (error) {
        toast.error(t('fileExplorer.uploadError', { name: file.name, error: error instanceof Error ? error.message : 'Unknown error' }));
      }
    }
    
    loadFiles(currentPath);
  }, [selectedDevice, currentPath, loadFiles, t]);

  // Drag and drop handlers
  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    if (selectedDevice) {
      setDropHighlight(true);
    }
  }, [selectedDevice]);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDropHighlight(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDropHighlight(false);
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      uploadFiles(files);
    }
  }, [uploadFiles]);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      uploadFiles(files);
    }
  }, [uploadFiles]);

  // Filter files
  const filteredFiles = files.filter(file => 
    file.name.toLowerCase().includes(filter.toLowerCase())
  );

  // Format file size
  const formatSize = (bytes?: number) => {
    if (!bytes) return '—';
    const units = ['B', 'KB', 'MB', 'GB'];
    let size = bytes;
    let unitIndex = 0;
    
    while (size >= 1024 && unitIndex < units.length - 1) {
      size /= 1024;
      unitIndex++;
    }
    
    return `${size.toFixed(1)} ${units[unitIndex]}`;
  };

  // Format date
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  // Initialize
  useEffect(() => {
    if (selectedDevice) {
      loadFiles('/storage/emulated/0/');
    }
  }, [selectedDevice, loadFiles]);

  return (
    <div className="flex h-full flex-col">
      {/* Toolbar */}
      <div className="flex items-center gap-2 border-b p-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={goBack}
          disabled={historyIndex <= 0 || !selectedDevice}
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={goForward}
          disabled={historyIndex >= history.length - 1 || !selectedDevice}
        >
          <ArrowRight className="h-4 w-4" />
        </Button>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={goUp}
          disabled={currentPath === '/storage/emulated/0/' || !selectedDevice}
        >
          <ArrowUp className="h-4 w-4" />
        </Button>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={refresh}
          disabled={!selectedDevice}
        >
          <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
        </Button>

        <div className="flex-1">
          <Input
            value={customPath}
            onChange={(e) => setCustomPath(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                const path = customPath.endsWith('/') ? customPath : customPath + '/';
                navigateTo(path);
              }
            }}
            placeholder={t('fileExplorer.pathPlaceholder')}
            disabled={!selectedDevice}
          />
        </div>

        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => fileInputRef.current?.click()}
            disabled={!selectedDevice}
          >
            <Upload className="h-4 w-4" />
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setNewFolderDialogOpen(true)}
            disabled={!selectedDevice}
          >
            <Plus className="h-4 w-4" />
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setListView(!listView)}
          >
            {listView ? <Grid3X3 className="h-4 w-4" /> : <List className="h-4 w-4" />}
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowPreview(!showPreview)}
          >
            <Eye className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex items-center gap-1">
          <Search className="h-4 w-4 text-muted-foreground" />
          <Input
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            placeholder={t('fileExplorer.filterPlaceholder')}
            className="w-32"
          />
        </div>
      </div>

      {/* Main content */}
      <div className="flex flex-1 overflow-hidden">
        {/* File list */}
        <div 
          className={`flex-1 overflow-auto p-4 ${dropHighlight ? 'bg-blue-50 dark:bg-blue-950' : ''}`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          {!selectedDevice ? (
            <div className="flex h-full items-center justify-center">
              <p className="text-muted-foreground">{t('fileExplorer.selectDevice')}</p>
            </div>
          ) : filteredFiles.length === 0 ? (
            <div className="flex h-full items-center justify-center">
              <p className="text-muted-foreground">
                {filter ? t('fileExplorer.noResults') : t('fileExplorer.emptyDirectory')}
              </p>
            </div>
          ) : listView ? (
            <div className="space-y-1">
              {filteredFiles.map((file) => (
                <div
                  key={file.name}
                  className={`flex items-center gap-4 rounded p-2 hover:bg-accent cursor-pointer ${
                    selectedFile?.name === file.name ? 'bg-accent' : ''
                  }`}
                  onClick={() => setSelectedFile(file)}
                  onDoubleClick={() => openFile(file)}
                >
                  <div className="w-4">
                    {file.directory ? (
                      <Folder className="h-4 w-4 text-blue-500" />
                    ) : (
                      <File className="h-4 w-4 text-gray-500" />
                    )}
                  </div>
                  
                  <div className="flex-1 truncate">{file.name}</div>
                  <div className="text-sm text-muted-foreground w-20 text-right">
                    {formatSize(file.size)}
                  </div>
                  <div className="text-sm text-muted-foreground w-32">
                    {formatDate(file.mtime)}
                  </div>
                  <div className="text-sm text-muted-foreground w-16 text-right">
                    {file.mode}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-4">
              {filteredFiles.map((file) => (
                <div
                  key={file.name}
                  className={`flex flex-col items-center gap-2 p-3 rounded-lg hover:bg-accent cursor-pointer ${
                    selectedFile?.name === file.name ? 'bg-accent' : ''
                  }`}
                  onClick={() => setSelectedFile(file)}
                  onDoubleClick={() => openFile(file)}
                >
                  <div className="w-12 h-12 flex items-center justify-center">
                    {file.directory ? (
                      <Folder className="h-12 w-12 text-blue-500" />
                    ) : (
                      <File className="h-12 w-12 text-gray-500" />
                    )}
                  </div>
                  <div className="text-sm text-center truncate w-full">
                    {file.name}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Preview panel */}
        {showPreview && selectedFile && (
          <div className="w-80 border-l p-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  {selectedFile.directory ? (
                    <Folder className="h-5 w-5 text-blue-500" />
                  ) : (
                    <File className="h-5 w-5 text-gray-500" />
                  )}
                  {selectedFile.name}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Type:</span>
                    <span className="text-sm">
                      {selectedFile.directory ? 'Directory' : 'File'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Size:</span>
                    <span className="text-sm">{formatSize(selectedFile.size)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Modified:</span>
                    <span className="text-sm">{formatDate(selectedFile.mtime)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Permissions:</span>
                    <span className="text-sm font-mono">{selectedFile.mode}</span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={() => openFile(selectedFile)}
                  >
                    {t('fileExplorer.open')}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={() => {
                      setNewName(selectedFile.name);
                      setRenameDialogOpen(true);
                    }}
                  >
                    <Edit3 className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={() => setDeleteDialogOpen(true)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        className="hidden"
        onChange={handleFileSelect}
      />

      {/* Delete dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {t('fileExplorer.deleteTitle')}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {t('fileExplorer.deleteConfirm', { name: selectedFile?.name })}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t('common.cancel')}</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (selectedFile) {
                  deleteFile(selectedFile);
                  setDeleteDialogOpen(false);
                  setSelectedFile(null);
                }
              }}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {t('common.delete')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Rename dialog */}
      <AlertDialog open={renameDialogOpen} onOpenChange={setRenameDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {t('fileExplorer.renameTitle')}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {t('fileExplorer.renamePrompt')}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="py-4">
            <Input
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder={t('fileExplorer.newName')}
            />
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel>{t('common.cancel')}</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (selectedFile && newName) {
                  renameFile(selectedFile, newName);
                  setRenameDialogOpen(false);
                  setSelectedFile(null);
                  setNewName('');
                }
              }}
            >
              {t('common.rename')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* New folder dialog */}
      <AlertDialog open={newFolderDialogOpen} onOpenChange={setNewFolderDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {t('fileExplorer.newFolderTitle')}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {t('fileExplorer.newFolderPrompt')}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="py-4">
            <Input
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder={t('fileExplorer.folderName')}
            />
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel>{t('common.cancel')}</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (newName) {
                  createFolder(newName);
                  setNewFolderDialogOpen(false);
                  setNewName('');
                }
              }}
            >
              {t('common.create')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

export default FileExplorer;

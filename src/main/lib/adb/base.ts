import { ADBHelper } from '@/utils/adb-helper'

export async function shell(deviceId: string, command: string): Promise<string> {
  return await ADBHelper.executeADBCommand([
    '-s',
    deviceId,
    'shell',
    command
  ])
}

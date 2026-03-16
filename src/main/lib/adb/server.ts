import { Adb } from '@devicefarmer/adbkit'
import { shell } from './base'
import singleton from 'licia/singleton'
import { resolve } from 'node:path'

const logger = {
  info: (message: string, ...args: any[]) => console.log(`[AYA-SERVER] ${message}`, ...args),
  error: (message: string, ...args: any[]) => console.error(`[AYA-SERVER] ${message}`, ...args),
  warn: (message: string, ...args: any[]) => console.warn(`[AYA-SERVER] ${message}`, ...args),
  debug: (message: string, ...args: any[]) => console.log(`[AYA-SERVER-DEBUG] ${message}`, ...args),
}

export class AyaServer {
  private deviceId: string
  private client: any
  private socket: any = null

  constructor(deviceId: string, client: any) {
    this.deviceId = deviceId
    this.client = client
    logger.info(`AyaServer created for device: ${deviceId}`)
  }

  async initialize(): Promise<void> {
    logger.info(`Initializing AyaServer for device: ${this.deviceId}`)
    await this.connect(true)
  }

  private async connect(tryStart: boolean = false): Promise<void> {
    logger.info(`Connecting to AyaServer on device: ${this.deviceId}, tryStart: ${tryStart}`)
    
    try {
      const device = await this.client.getDevice(this.deviceId)
      logger.info(`Got device object for: ${this.deviceId}`)
      
      const socket = await device.openLocal('localabstract:aya')
      logger.info(`Successfully connected to localabstract:aya socket`)
      
      let buf = Buffer.alloc(0)
      socket.on('readable', () => {
        const newBuf = socket.read()
        if (!newBuf) {
          return
        }
        buf = Buffer.concat([buf, newBuf])
        logger.info(`Received ${newBuf.length} bytes from AyaServer`)
        
        // Try to parse JSON response
        try {
          const response = JSON.parse(buf.toString())
          buf = Buffer.alloc(0)
          logger.info('AyaServer response:', response)
        } catch (e) {
          // Response not complete yet, continue accumulating
          logger.debug('Incomplete response, waiting for more data')
        }
      })

      socket.on('end', () => {
        this.socket = null
        logger.info('AyaServer disconnected')
      })

      socket.on('error', (err: Error) => {
        logger.error('AyaServer socket error:', err)
        this.socket = null
      })

      this.socket = socket
      logger.info('AyaServer connection established')

    } catch (error) {
      logger.error('Failed to connect to AyaServer:', error)
      
      if (tryStart) {
        logger.info('Attempting to start AyaServer...')
        await this.push()
        await this.start()
        await this.waitUntilRunning(10000, 100)
        await this.connect(false)
      } else {
        throw error
      }
    }
  }

  private async waitUntilRunning(timeout: number, interval: number): Promise<void> {
    const startTime = Date.now()
    logger.info(`Waiting for AyaServer to be running, timeout: ${timeout}ms`)
    
    while (Date.now() - startTime < timeout) {
      if (await this.isRunning()) {
        logger.info('AyaServer is now running')
        return
      }
      logger.debug(`AyaServer not running yet, checking again in ${interval}ms`)
      await new Promise(resolve => setTimeout(resolve, interval))
    }
    
    throw new Error('AyaServer failed to start within timeout')
  }

  private async isRunning(): Promise<boolean> {
    try {
      const result = await shell(this.deviceId, 'cat /proc/net/unix | grep aya || echo "not_running"')
      const isRunning = !result.includes('not_running')
      logger.debug(`AyaServer running check: ${isRunning}`)
      return isRunning
    } catch (error) {
      logger.error('Error checking if AyaServer is running:', error)
      return false
    }
  }

  private async push(): Promise<void> {
    logger.info('Pushing AyaServer DEX to device...')
    
    try {
      const device = await this.client.getDevice(this.deviceId)
      const dexPath = resolve(__dirname, '../../../../resources/aya.dex')
      
      logger.info(`DEX file path: ${dexPath}`)
      await device.push(dexPath, '/data/local/tmp/aya/aya.dex')
      
      logger.info('AyaServer DEX pushed successfully')
    } catch (error) {
      logger.error('Failed to push AyaServer DEX:', error)
      throw error
    }
  }

  private async start(): Promise<void> {
    logger.info('Starting AyaServer on device...')
    
    try {
      const device = await this.client.getDevice(this.deviceId)
      
      const command = 'CLASSPATH=/data/local/tmp/aya/aya.dex app_process /system/bin io.liriliri.aya.Server'
      logger.info(`Executing command: ${command}`)
      
      await device.shell(command)
      
      logger.info('AyaServer start command executed')
    } catch (error) {
      logger.error('Failed to start AyaServer:', error)
      throw error
    }
  }

  async getPackageInfos(packageNames: string[]): Promise<any[]> {
    logger.info(`Getting package infos for: ${packageNames.join(', ')}`)
    
    if (!this.socket) {
      logger.info('No socket connection, attempting to connect...')
      await this.connect(true)
    }

    if (!this.socket) {
      throw new Error('Failed to establish socket connection')
    }

    return new Promise((resolve, reject) => {
      const request = {
        method: 'getPackageInfos',
        params: JSON.stringify({ packageNames })
      }

      logger.info('Sending request to AyaServer:', request)

      let response = ''
      const timeout = setTimeout(() => {
        logger.error('AyaServer request timeout')
        reject(new Error('AyaServer request timeout'))
      }, 10000)

      const onData = () => {
        try {
          if (!this.socket) {
            logger.error('Socket became null during read')
            clearTimeout(timeout)
            reject(new Error('Socket connection lost'))
            return
          }

          const newBuf = this.socket.read()
          if (!newBuf) {
            return
          }
          response += newBuf.toString()
          logger.info(`Accumulated response length: ${response.length} characters`)
          
          // Try to parse complete JSON response
          try {
            const parsed = JSON.parse(response)
            clearTimeout(timeout)
            this.socket?.removeListener('readable', onData)
            
            logger.info('Parsed AyaServer response:', parsed)
            
            if (parsed.error) {
              logger.error('AyaServer returned error:', parsed.error)
              reject(new Error(parsed.error))
            } else {
              const packageInfos = parsed.packageInfos || []
              logger.info(`Got package infos for ${packageInfos.length} packages`)
              resolve(packageInfos)
            }
          } catch (e) {
            // Response not complete yet, continue waiting
            logger.debug('Response not complete JSON yet, waiting for more data')
          }
        } catch (error) {
          logger.error('Error in onData handler:', error)
          clearTimeout(timeout)
          reject(error)
        }
      }

      this.socket.on('readable', onData)
      
      try {
        this.socket.write(JSON.stringify(request) + '\n')
        logger.info('Request sent to AyaServer')
      } catch (error) {
        logger.error('Failed to write to socket:', error)
        clearTimeout(timeout)
        reject(error)
      }
    })
  }

  async cleanup(): Promise<void> {
    logger.info('Cleaning up AyaServer...')
    
    try {
      if (this.socket) {
        this.socket.end()
        this.socket = null
        logger.info('AyaServer socket closed')
      }
      
      await shell(this.deviceId, 'rm -rf /data/local/tmp/aya')
      logger.info('AyaServer cleaned up successfully')
    } catch (error) {
      logger.error('Failed to cleanup AyaServer:', error)
    }
  }
}

export const getAyaServer = singleton(async (deviceId: string, client: any) => {
  const server = new AyaServer(deviceId, client)
  await server.initialize()
  return server
})

/**
 * Blockchain Service for Narcoguard
 * Provides secure, immutable record-keeping for critical events
 */

import { AppError, ErrorSeverity, ErrorCategory } from "./error-handling"
import { createHash } from "crypto"

// Types for blockchain records
export interface BlockchainRecord {
  id: string
  timestamp: Date
  type: "emergency" | "intervention" | "naloxone" | "medical" | "consent" | "audit"
  data: any
  hash: string
  previousHash: string
  signature?: string
  publicKey?: string
}

export interface BlockchainOptions {
  networkEndpoint?: string
  apiKey?: string
  privateKey?: string
  publicKey?: string
  useLocalChain?: boolean
}

// Blockchain service class
export class BlockchainService {
  private static instance: BlockchainService
  private networkEndpoint: string
  private apiKey: string
  private privateKey: string
  private publicKey: string
  private useLocalChain: boolean
  private localChain: BlockchainRecord[] = []
  private initialized = false

  // Singleton pattern
  private constructor(options: BlockchainOptions = {}) {
    this.networkEndpoint = options.networkEndpoint || process.env.BLOCKCHAIN_ENDPOINT || "https://api.narcoguard.chain"
    this.apiKey = options.apiKey || process.env.BLOCKCHAIN_API_KEY || ""
    this.privateKey = options.privateKey || process.env.BLOCKCHAIN_PRIVATE_KEY || ""
    this.publicKey = options.publicKey || process.env.BLOCKCHAIN_PUBLIC_KEY || ""
    this.useLocalChain = options.useLocalChain || process.env.NODE_ENV !== "production"
  }

  public static getInstance(options?: BlockchainOptions): BlockchainService {
    if (!BlockchainService.instance) {
      BlockchainService.instance = new BlockchainService(options)
    }
    return BlockchainService.instance
  }

  // Initialize the blockchain service
  public async initialize(): Promise<void> {
    if (this.initialized) return

    try {
      if (this.useLocalChain) {
        // Initialize local chain with genesis block
        this.localChain = [this.createGenesisBlock()]
      } else {
        // Connect to blockchain network
        await this.connectToNetwork()
      }

      this.initialized = true
      console.log(`Blockchain Service initialized (${this.useLocalChain ? "local" : "network"} mode)`)
    } catch (error) {
      console.error("Failed to initialize Blockchain Service:", error)
      throw new AppError({
        message: "Failed to initialize Blockchain Service",
        code: "ERR_BLOCKCHAIN_INIT",
        severity: ErrorSeverity.ERROR,
        category: ErrorCategory.INITIALIZATION,
        cause: error as Error,
      })
    }
  }

  // Connect to blockchain network
  private async connectToNetwork(): Promise<void> {
    // In a real implementation, this would connect to a blockchain network
    // For now, we'll simulate the connection process
    return new Promise((resolve) => {
      setTimeout(resolve, 1000)
    })
  }

  // Create genesis block
  private createGenesisBlock(): BlockchainRecord {
    const genesisBlock: BlockchainRecord = {
      id: "genesis",
      timestamp: new Date(),
      type: "audit",
      data: {
        message: "Narcoguard Blockchain Genesis Block",
        application: "Narcoguard",
        version: "1.0.0",
      },
      hash: "",
      previousHash: "0",
    }

    // Calculate hash for genesis block
    genesisBlock.hash = this.calculateHash(genesisBlock)

    return genesisBlock
  }

  // Calculate hash for a block
  private calculateHash(block: Omit<BlockchainRecord, "hash">): string {
    const blockString = JSON.stringify({
      id: block.id,
      timestamp: block.timestamp,
      type: block.type,
      data: block.data,
      previousHash: block.previousHash,
    })

    return createHash("sha256").update(blockString).digest("hex")
  }

  // Sign a record with private key
  private signRecord(record: BlockchainRecord): string {
    // In a real implementation, this would use asymmetric cryptography
    // For now, we'll simulate signing
    const signature = createHash("sha256")
      .update(record.hash + this.privateKey)
      .digest("hex")

    return signature
  }

  // Verify a record's signature
  private verifySignature(record: BlockchainRecord): boolean {
    if (!record.signature || !record.publicKey) return false

    // In a real implementation, this would verify using asymmetric cryptography
    // For now, we'll simulate verification
    const expectedSignature = createHash("sha256")
      .update(record.hash + this.privateKey)
      .digest("hex")

    return record.signature === expectedSignature
  }

  // Add a record to the blockchain
  public async addRecord(
    type: BlockchainRecord["type"],
    data: any,
    options: {
      id?: string
      sign?: boolean
    } = {},
  ): Promise<BlockchainRecord> {
    try {
      if (!this.initialized) {
        await this.initialize()
      }

      // Create new record
      const newRecord: Omit<BlockchainRecord, "hash"> = {
        id: options.id || `record-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
        timestamp: new Date(),
        type,
        data,
        previousHash: this.getLatestBlock().hash,
      }

      // Calculate hash
      const hash = this.calculateHash(newRecord)

      // Create complete record
      const record: BlockchainRecord = {
        ...newRecord,
        hash,
      }

      // Sign record if requested
      if (options.sign) {
        record.signature = this.signRecord(record)
        record.publicKey = this.publicKey
      }

      if (this.useLocalChain) {
        // Add to local chain
        this.localChain.push(record)
      } else {
        // Submit to blockchain network
        await this.submitToNetwork(record)
      }

      return record
    } catch (error) {
      throw new AppError({
        message: "Failed to add blockchain record",
        code: "ERR_BLOCKCHAIN_ADD",
        severity: ErrorSeverity.ERROR,
        category: ErrorCategory.BLOCKCHAIN,
        cause: error as Error,
        context: { type, dataSnapshot: JSON.stringify(data).substring(0, 100) },
      })
    }
  }

  // Submit record to blockchain network
  private async submitToNetwork(record: BlockchainRecord): Promise<void> {
    // In a real implementation, this would submit to a blockchain network
    // For now, we'll simulate the submission
    return new Promise((resolve) => {
      setTimeout(resolve, 500)
    })
  }

  // Get the latest block in the chain
  private getLatestBlock(): BlockchainRecord {
    if (this.useLocalChain) {
      return this.localChain[this.localChain.length - 1]
    } else {
      // In a real implementation, this would fetch from the network
      // For now, we'll return a placeholder
      return {
        id: "placeholder",
        timestamp: new Date(),
        type: "audit",
        data: { message: "Placeholder block" },
        hash: createHash("sha256").update("placeholder").digest("hex"),
        previousHash: "0",
      }
    }
  }

  // Verify the integrity of the blockchain
  public async verifyChainIntegrity(): Promise<{
    valid: boolean
    issues?: { blockId: string; issue: string }[]
  }> {
    try {
      if (!this.initialized) {
        await this.initialize()
      }

      if (this.useLocalChain) {
        // Verify local chain
        return this.verifyLocalChain()
      } else {
        // Verify network chain
        return await this.verifyNetworkChain()
      }
    } catch (error) {
      throw new AppError({
        message: "Failed to verify blockchain integrity",
        code: "ERR_BLOCKCHAIN_VERIFY",
        severity: ErrorSeverity.ERROR,
        category: ErrorCategory.BLOCKCHAIN,
        cause: error as Error,
      })
    }
  }

  // Verify local blockchain integrity
  private verifyLocalChain(): {
    valid: boolean
    issues?: { blockId: string; issue: string }[]
  } {
    const issues: { blockId: string; issue: string }[] = []

    // Check each block
    for (let i = 1; i < this.localChain.length; i++) {
      const currentBlock = this.localChain[i]
      const previousBlock = this.localChain[i - 1]

      // Verify hash link
      if (currentBlock.previousHash !== previousBlock.hash) {
        issues.push({
          blockId: currentBlock.id,
          issue: "Previous hash mismatch",
        })
      }

      // Verify block hash
      const calculatedHash = this.calculateHash({
        id: currentBlock.id,
        timestamp: currentBlock.timestamp,
        type: currentBlock.type,
        data: currentBlock.data,
        previousHash: currentBlock.previousHash,
      })

      if (calculatedHash !== currentBlock.hash) {
        issues.push({
          blockId: currentBlock.id,
          issue: "Hash mismatch",
        })
      }

      // Verify signature if present
      if (currentBlock.signature && !this.verifySignature(currentBlock)) {
        issues.push({
          blockId: currentBlock.id,
          issue: "Invalid signature",
        })
      }
    }

    return {
      valid: issues.length === 0,
      issues: issues.length > 0 ? issues : undefined,
    }
  }

  // Verify network blockchain integrity
  private async verifyNetworkChain(): Promise<{
    valid: boolean
    issues?: { blockId: string; issue: string }[]
  }> {
    // In a real implementation, this would verify with the network
    // For now, we'll simulate verification
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          valid: true,
        })
      }, 1000)
    })
  }

  // Get records by type
  public async getRecordsByType(
    type: BlockchainRecord["type"],
    options: {
      limit?: number
      offset?: number
      startDate?: Date
      endDate?: Date
    } = {},
  ): Promise<BlockchainRecord[]> {
    try {
      if (!this.initialized) {
        await this.initialize()
      }

      if (this.useLocalChain) {
        // Filter local chain
        let records = this.localChain.filter((record) => record.type === type)

        // Apply date filters
        if (options.startDate) {
          records = records.filter((record) => record.timestamp >= options.startDate!)
        }

        if (options.endDate) {
          records = records.filter((record) => record.timestamp <= options.endDate!)
        }

        // Apply pagination
        if (options.offset) {
          records = records.slice(options.offset)
        }

        if (options.limit) {
          records = records.slice(0, options.limit)
        }

        return records
      } else {
        // Fetch from network
        return await this.fetchRecordsFromNetwork(type, options)
      }
    } catch (error) {
      throw new AppError({
        message: "Failed to get blockchain records",
        code: "ERR_BLOCKCHAIN_GET",
        severity: ErrorSeverity.ERROR,
        category: ErrorCategory.BLOCKCHAIN,
        cause: error as Error,
        context: { type, options },
      })
    }
  }

  // Fetch records from blockchain network
  private async fetchRecordsFromNetwork(
    type: BlockchainRecord["type"],
    options: {
      limit?: number
      offset?: number
      startDate?: Date
      endDate?: Date
    } = {},
  ): Promise<BlockchainRecord[]> {
    // In a real implementation, this would fetch from the network
    // For now, we'll simulate fetching
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([
          {
            id: `network-record-1`,
            timestamp: new Date(Date.now() - 86400000), // 1 day ago
            type,
            data: { message: "Example network record 1" },
            hash: createHash("sha256").update("network-record-1").digest("hex"),
            previousHash: "0",
          },
          {
            id: `network-record-2`,
            timestamp: new Date(Date.now() - 43200000), // 12 hours ago
            type,
            data: { message: "Example network record 2" },
            hash: createHash("sha256").update("network-record-2").digest("hex"),
            previousHash: createHash("sha256").update("network-record-1").digest("hex"),
          },
        ])
      }, 500)
    })
  }

  // Get a specific record by ID
  public async getRecordById(id: string): Promise<BlockchainRecord | null> {
    try {
      if (!this.initialized) {
        await this.initialize()
      }

      if (this.useLocalChain) {
        // Find in local chain
        const record = this.localChain.find((record) => record.id === id)
        return record || null
      } else {
        // Fetch from network
        return await this.fetchRecordFromNetwork(id)
      }
    } catch (error) {
      throw new AppError({
        message: "Failed to get blockchain record",
        code: "ERR_BLOCKCHAIN_GET_ID",
        severity: ErrorSeverity.ERROR,
        category: ErrorCategory.BLOCKCHAIN,
        cause: error as Error,
        context: { id },
      })
    }
  }

  // Fetch a specific record from blockchain network
  private async fetchRecordFromNetwork(id: string): Promise<BlockchainRecord | null> {
    // In a real implementation, this would fetch from the network
    // For now, we'll simulate fetching
    return new Promise((resolve) => {
      setTimeout(() => {
        if (Math.random() > 0.2) {
          // 80% chance of finding the record
          resolve({
            id,
            timestamp: new Date(Date.now() - 86400000 * Math.random()), // Random time in the last day
            type: ["emergency", "intervention", "naloxone", "medical", "consent", "audit"][
              Math.floor(Math.random() * 6)
            ] as any,
            data: { message: `Network record ${id}` },
            hash: createHash("sha256").update(id).digest("hex"),
            previousHash: "0",
          })
        } else {
          // 20% chance of not finding the record
          resolve(null)
        }
      }, 500)
    })
  }

  // Create an audit trail for a user
  public async createAuditTrail(
    userId: string,
    action: string,
    details: any,
    options: {
      sign?: boolean
      relatedRecords?: string[]
    } = {},
  ): Promise<BlockchainRecord> {
    try {
      // Create audit data
      const auditData = {
        userId,
        action,
        details,
        timestamp: new Date(),
        relatedRecords: options.relatedRecords || [],
      }

      // Add to blockchain
      return await this.addRecord("audit", auditData, {
        id: `audit-${userId}-${Date.now()}`,
        sign: options.sign,
      })
    } catch (error) {
      throw new AppError({
        message: "Failed to create audit trail",
        code: "ERR_BLOCKCHAIN_AUDIT",
        severity: ErrorSeverity.ERROR,
        category: ErrorCategory.BLOCKCHAIN,
        cause: error as Error,
        context: { userId, action },
      })
    }
  }

  // Record an emergency event
  public async recordEmergencyEvent(
    emergencyId: string,
    userId: string,
    eventType: string,
    eventData: any,
  ): Promise<BlockchainRecord> {
    try {
      // Create emergency event data
      const emergencyEventData = {
        emergencyId,
        userId,
        eventType,
        eventData,
        timestamp: new Date(),
      }

      // Add to blockchain with signing
      return await this.addRecord("emergency", emergencyEventData, {
        id: `emergency-${emergencyId}-${eventType}-${Date.now()}`,
        sign: true,
      })
    } catch (error) {
      throw new AppError({
        message: "Failed to record emergency event",
        code: "ERR_BLOCKCHAIN_EMERGENCY",
        severity: ErrorSeverity.ERROR,
        category: ErrorCategory.BLOCKCHAIN,
        cause: error as Error,
        context: { emergencyId, userId, eventType },
      })
    }
  }

  // Record naloxone administration
  public async recordNaloxoneAdministration(
    userId: string,
    administeredBy: string,
    details: any,
  ): Promise<BlockchainRecord> {
    try {
      // Create naloxone administration data
      const naloxoneData = {
        userId,
        administeredBy,
        details,
        timestamp: new Date(),
      }

      // Add to blockchain with signing
      return await this.addRecord("naloxone", naloxoneData, {
        id: `naloxone-${userId}-${Date.now()}`,
        sign: true,
      })
    } catch (error) {
      throw new AppError({
        message: "Failed to record naloxone administration",
        code: "ERR_BLOCKCHAIN_NALOXONE",
        severity: ErrorSeverity.ERROR,
        category: ErrorCategory.BLOCKCHAIN,
        cause: error as Error,
        context: { userId, administeredBy },
      })
    }
  }

  // Record user consent
  public async recordConsent(
    userId: string,
    consentType: string,
    consentData: any,
    options: {
      expirationDate?: Date
      revocable?: boolean
    } = {},
  ): Promise<BlockchainRecord> {
    try {
      // Create consent data
      const consentRecord = {
        userId,
        consentType,
        consentData,
        timestamp: new Date(),
        expirationDate: options.expirationDate,
        revocable: options.revocable !== undefined ? options.revocable : true,
      }

      // Add to blockchain with signing
      return await this.addRecord("consent", consentRecord, {
        id: `consent-${userId}-${consentType}-${Date.now()}`,
        sign: true,
      })
    } catch (error) {
      throw new AppError({
        message: "Failed to record consent",
        code: "ERR_BLOCKCHAIN_CONSENT",
        severity: ErrorSeverity.ERROR,
        category: ErrorCategory.BLOCKCHAIN,
        cause: error as Error,
        context: { userId, consentType },
      })
    }
  }

  // Export blockchain data for a user
  public async exportUserData(userId: string): Promise<{
    userData: BlockchainRecord[]
    exportTimestamp: Date
    verificationHash: string
  }> {
    try {
      if (!this.initialized) {
        await this.initialize()
      }

      // Get all records for the user
      const userRecords: BlockchainRecord[] = []

      // Types to search
      const types: BlockchainRecord["type"][] = ["emergency", "intervention", "naloxone", "medical", "consent", "audit"]

      // Fetch records for each type
      for (const type of types) {
        const records = await this.getRecordsByType(type)
        const userRecordsOfType = records.filter((record) => {
          // Check if the record contains the userId
          const recordString = JSON.stringify(record.data)
          return recordString.includes(userId)
        })

        userRecords.push(...userRecordsOfType)
      }

      // Sort by timestamp
      userRecords.sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime())

      // Create export data
      const exportData = {
        userData: userRecords,
        exportTimestamp: new Date(),
        verificationHash: "",
      }

      // Calculate verification hash
      exportData.verificationHash = createHash("sha256")
        .update(JSON.stringify(userRecords) + exportData.exportTimestamp.toISOString())
        .digest("hex")

      return exportData
    } catch (error) {
      throw new AppError({
        message: "Failed to export user data",
        code: "ERR_BLOCKCHAIN_EXPORT",
        severity: ErrorSeverity.ERROR,
        category: ErrorCategory.BLOCKCHAIN,
        cause: error as Error,
        context: { userId },
      })
    }
  }
}

// Export singleton instance
export const blockchainService = BlockchainService.getInstance()

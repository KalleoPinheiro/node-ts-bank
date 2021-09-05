import { Operation } from '@domain/index'
import { AccountType, ExtractType, TransactionType, TransferType } from '@domain/transactions'
import { SegregateOperationType } from '@services/segregate-operation-type'
import { getFiles } from '@utils/clean-directory'
import { unlink } from 'fs/promises'
import { resolve } from 'path'

export class Handler {
  readonly #operations: Operation[]

  constructor(data: Operation[]) {
    this.#operations = data
  }

  get operations(): Operation[] {
    return this.#operations
  }

  async main(): Promise<void> {
    const accountCreationOperations = new Map<string, AccountType>()
    const depositTransactionOperations = new Map<string, TransactionType[]>()
    const withdrawalTransactionOperations = new Map<string, TransactionType[]>()
    const balanceTransactionOperations = new Map<string, TransactionType[]>()
    const transferTransactionOperations = new Map<string, TransactionType & TransferType>()
    const extractTransactionOperations = new Map<string, ExtractType>()

    const segregationOperationType = new SegregateOperationType(
      accountCreationOperations,
      depositTransactionOperations,
      withdrawalTransactionOperations,
      balanceTransactionOperations,
      transferTransactionOperations,
      extractTransactionOperations
    )

    const outputFolder = resolve('output')

    for await (const file of getFiles(outputFolder)) {
      try {
        await unlink(file)
      } catch (error) {
        console.error(`Failed to remove file: ${file}, error: ${error}`)
        continue
      }
    }

    for await (const operation of this.operations) {
      try {
        await segregationOperationType.handle(operation)
      } catch (error: unknown) {
        console.error(error)
        continue
      }
    }

    await segregationOperationType.print()
  }
}

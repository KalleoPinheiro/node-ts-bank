import {
  AccountType,
  ExtractType,
  Operation,
  OperationKind,
  TransactionType,
  TransferType,
} from '@domain/index'
import {
  CreateAccount,
  CreateBalance,
  CreateDeposit,
  CreateExtract,
  CreateTransfer,
  CreateWithdraw,
  IssueProofOfTransaction,
} from '@services/index'
import { generateFileName } from '@utils/generate-filename'
import { resolve } from 'path'

export class SegregateOperationType {
  #outputPath: string

  constructor(
    private readonly accountCreationOperations: Map<string, AccountType>,
    private readonly depositTransactionOperations: Map<string, TransactionType[]>,
    private readonly withdrawalTransactionOperations: Map<string, TransactionType[]>,
    private readonly balanceTransactionOperations: Map<string, TransactionType[]>,
    private readonly transferTransactionOperations: Map<string, TransactionType & TransferType>,
    private readonly extractTransactionOperations: Map<string, ExtractType>
  ) {
    this.#outputPath = resolve('output')
  }

  async handle(operation: Operation): Promise<void> {
    switch (operation.type) {
      case OperationKind.CREATE_ACCOUNT: {
        const createAccountUseCase = new CreateAccount(this.accountCreationOperations, operation)
        await createAccountUseCase.handle()
        break
      }

      case OperationKind.DEPOSIT: {
        const createDepositUseCase = new CreateDeposit(
          this.depositTransactionOperations,
          this.accountCreationOperations,
          operation
        )
        await createDepositUseCase.handle()
        break
      }

      case OperationKind.WITHDRAW: {
        const createWithdrawUseCase = new CreateWithdraw(
          this.withdrawalTransactionOperations,
          this.accountCreationOperations,
          operation
        )
        await createWithdrawUseCase.handle()
        break
      }

      case OperationKind.TRANSFER: {
        const createTransferUseCase = new CreateTransfer(
          this.accountCreationOperations,
          this.transferTransactionOperations,
          operation
        )
        await createTransferUseCase.handle()
        break
      }

      case OperationKind.EXTRACT: {
        const createExtractUseCase = new CreateExtract(
          this.depositTransactionOperations,
          this.withdrawalTransactionOperations,
          this.transferTransactionOperations,
          this.extractTransactionOperations,
          operation
        )
        await createExtractUseCase.handle()
        break
      }

      case OperationKind.BALANCE: {
        const createBalanceUseCase = new CreateBalance(
          this.balanceTransactionOperations,
          this.accountCreationOperations,
          operation
        )
        await createBalanceUseCase.handle()
        break
      }

      default: {
        throw new Error('Operation not recognized')
      }
    }
  }

  async print(): Promise<void> {
    const issueProofTransaction = new IssueProofOfTransaction()

    for await (const [document, account] of this.accountCreationOperations) {
      const fileName = generateFileName(this.#outputPath, OperationKind.CREATE_ACCOUNT, document)
      await issueProofTransaction.handle(fileName, {
        operation: OperationKind.CREATE_ACCOUNT,
        clientDocument: document,
        data: account,
      })
    }

    for (const [document, deposit] of this.depositTransactionOperations) {
      const fileName = generateFileName(this.#outputPath, OperationKind.DEPOSIT, document)
      await issueProofTransaction.handle(fileName, {
        operation: OperationKind.DEPOSIT,
        clientDocument: document,
        data: deposit,
      })
    }

    for (const [document, withdrawal] of this.withdrawalTransactionOperations) {
      const fileName = generateFileName(this.#outputPath, OperationKind.WITHDRAW, document)
      await issueProofTransaction.handle(fileName, {
        operation: OperationKind.WITHDRAW,
        clientDocument: document,
        data: withdrawal,
      })
    }

    for (const [document, balance] of this.balanceTransactionOperations) {
      const fileName = generateFileName(this.#outputPath, OperationKind.BALANCE, document)
      await issueProofTransaction.handle(fileName, {
        operation: OperationKind.BALANCE,
        clientDocument: document,
        data: balance,
      })
    }

    for (const [document, transfer] of this.transferTransactionOperations) {
      const fileName = generateFileName(this.#outputPath, OperationKind.TRANSFER, document)
      await issueProofTransaction.handle(fileName, {
        operation: OperationKind.TRANSFER,
        clientDocument: document,
        data: transfer,
      })
    }

    for (const [document, extract] of this.extractTransactionOperations) {
      const fileName = generateFileName(this.#outputPath, OperationKind.EXTRACT, document)
      await issueProofTransaction.handle(fileName, {
        operation: OperationKind.EXTRACT,
        clientDocument: document,
        data: extract,
      })
    }
  }
}

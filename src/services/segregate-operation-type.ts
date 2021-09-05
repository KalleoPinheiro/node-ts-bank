import { writeFile } from 'fs/promises'
import { resolve } from 'path'
import {
  Account,
  AccountType,
  Deposit,
  Operation,
  OperationKind,
  TransactionType,
  Withdrawal,
  Balance,
  Transfer,
  TransferType,
  Extract,
  ExtractType,
} from '@domain/index'
import { generateFileName } from '@utils/generate-filename'

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
        if (!operation.document) {
          throw new Error('Document was not provided!')
        }

        if (this.accountCreationOperations.has(operation.document)) {
          throw new Error(
            `Failed to create account with document ${operation.document} already exists!`
          )
        }

        const newAccount = new Account(operation?.balance)

        this.accountCreationOperations.set(operation.document, newAccount)
        break
      }

      case OperationKind.DEPOSIT: {
        if (!operation.document) {
          throw new Error('Document was not provided!')
        }

        if (!operation.amount || operation.amount <= 0) {
          throw new Error('Amount was not provided or amount value is invalid!')
        }

        const accountToDeposit = this.accountCreationOperations.get(operation.document)

        if (!accountToDeposit) {
          throw new Error('Account does not exist!')
        }

        const newDeposit = new Deposit(operation.amount)

        accountToDeposit.balance += newDeposit.amount

        const deposits = [
          this.depositTransactionOperations.get(operation.document)?.flat(),
          { ...newDeposit },
        ]
          .flat()
          .filter(item => item != null)

        this.depositTransactionOperations.set(operation.document, deposits as never)
        break
      }

      case OperationKind.WITHDRAW: {
        if (!operation.document) {
          throw new Error('Document was not provided!')
        }

        if (!operation.amount || operation.amount <= 0) {
          throw new Error('Amount was not provided or amount value is invalid!')
        }

        const accountToWithdraw = this.accountCreationOperations.get(operation.document)

        if (!accountToWithdraw) {
          throw new Error('Account does not exist!')
        }

        if (accountToWithdraw.balance < operation.amount) {
          throw new Error('Balance unavailable for this operation!')
        }

        const newWithdraw = new Withdrawal(operation.amount)

        accountToWithdraw.balance -= newWithdraw.amount

        const withdrawals = [
          this.withdrawalTransactionOperations.get(operation.document)?.flat(),
          { ...newWithdraw },
        ]
          .flat()
          .filter(item => item != null)

        this.withdrawalTransactionOperations.set(operation.document, withdrawals as never)
        break
      }

      case OperationKind.TRANSFER: {
        if (
          !operation.transaction ||
          !operation.transaction.payer ||
          !operation.transaction.receiver
        ) {
          throw new Error('Invalid transfer params was provided!')
        }

        if (operation.transaction.payer === operation.transaction.receiver) {
          throw new Error('Transfers to the same account is not allowed!')
        }

        const payerAccount = this.accountCreationOperations.get(operation.transaction.payer)

        if (!payerAccount) {
          throw new Error('Payer account not identified!')
        }

        const receiverAccount = this.accountCreationOperations.get(operation.transaction.receiver)

        if (!receiverAccount) {
          throw new Error('Receiver account not identified!')
        }

        if (payerAccount.balance < operation.transaction.amount) {
          throw new Error('Insufficient balance to transfer!')
        }

        const transfer = new Transfer(
          operation.transaction.id,
          operation.transaction.amount,
          operation.transaction.payer,
          operation.transaction.receiver
        )

        payerAccount.balance -= operation.transaction.amount
        receiverAccount.balance += operation.transaction.amount

        this.transferTransactionOperations.set(operation.transaction.id, transfer)
        break
      }

      case OperationKind.EXTRACT: {
        if (!operation.document) {
          throw new Error('Document was not provided!')
        }

        const deposits = this.depositTransactionOperations.get(operation.document)?.flat() ?? []

        const withdrawals =
          this.withdrawalTransactionOperations.get(operation.document)?.flat() ?? []

        const transfers =
          Array.from(this.transferTransactionOperations.values()).filter(
            transfer => transfer.payer === operation.document
          ) ?? []

        const extractInfo = { deposits, withdrawals, transfers }

        const extract = new Extract(operation.document, extractInfo)

        this.extractTransactionOperations.set(operation.document, extract)
        break
      }

      case OperationKind.BALANCE: {
        if (!operation.document) {
          throw new Error('Document was not provided!')
        }

        const accountToBalance = this.accountCreationOperations.get(operation.document)

        if (!accountToBalance) {
          throw new Error('Account does not exist!')
        }

        const newBalance = new Balance(accountToBalance.balance)

        const balances = [
          this.balanceTransactionOperations.get(operation.document)?.flat(),
          { ...newBalance },
        ]
          .flat()
          .filter(item => item != null)

        this.balanceTransactionOperations.set(operation.document, balances as never)
        break
      }

      default: {
        throw new Error('Operation not recognized')
      }
    }
  }

  async print(): Promise<void> {
    for (const [document, account] of this.accountCreationOperations) {
      const fileName = generateFileName(this.#outputPath, OperationKind.CREATE_ACCOUNT, document)
      try {
        await writeFile(
          fileName,
          JSON.stringify({
            operation: OperationKind.CREATE_ACCOUNT,
            description: 'Conta criada com sucesso!',
            clientDocument: document,
            account,
          }),
          'utf-8'
        )
      } catch (error) {
        throw new Error(`Failed to create file, ${fileName}`)
      }
    }

    for (const [document, deposit] of this.depositTransactionOperations) {
      const fileName = generateFileName(this.#outputPath, OperationKind.DEPOSIT, document)
      try {
        await writeFile(
          fileName,
          JSON.stringify({
            operation: OperationKind.DEPOSIT,
            description: 'Depósito realizado com sucesso!',
            clientDocument: document,
            deposits: deposit,
          }),
          'utf-8'
        )
      } catch (error) {
        throw new Error(`Failed to create file, ${fileName}`)
      }
    }

    for (const [document, withdrawal] of this.withdrawalTransactionOperations) {
      const fileName = generateFileName(this.#outputPath, OperationKind.WITHDRAW, document)
      try {
        await writeFile(
          fileName,
          JSON.stringify({
            operation: OperationKind.WITHDRAW,
            description: 'Retirada realizada com sucesso!',
            clientDocument: document,
            withdrawal,
          }),
          'utf-8'
        )
      } catch (error) {
        throw new Error(`Failed to create file, ${fileName}`)
      }
    }

    for (const [document, balance] of this.balanceTransactionOperations) {
      const fileName = generateFileName(this.#outputPath, OperationKind.BALANCE, document)
      try {
        await writeFile(
          fileName,
          JSON.stringify({
            operation: OperationKind.BALANCE,
            description: 'Saldo disponibilizado com sucesso!',
            clientDocument: document,
            balance,
          }),
          'utf-8'
        )
      } catch (error) {
        throw new Error(`Failed to create file, ${fileName}`)
      }
    }

    for (const [document, transfer] of this.transferTransactionOperations) {
      const fileName = generateFileName(this.#outputPath, OperationKind.TRANSFER, document)
      try {
        await writeFile(
          fileName,
          JSON.stringify({
            operation: OperationKind.TRANSFER,
            description: 'Transferência realizada com sucesso!',
            clientDocument: document,
            transfer,
          }),
          'utf-8'
        )
      } catch (error) {
        throw new Error(`Failed to create file, ${fileName}`)
      }
    }

    for (const [document, extract] of this.extractTransactionOperations) {
      const fileName = generateFileName(this.#outputPath, OperationKind.EXTRACT, document)
      try {
        await writeFile(
          fileName,
          JSON.stringify({
            operation: OperationKind.EXTRACT,
            description: 'Extrato disponibilizado com sucesso!',
            clientDocument: document,
            extract,
          }),
          'utf-8'
        )
      } catch (error) {
        throw new Error(`Failed to create file, ${fileName}`)
      }
    }
  }
}

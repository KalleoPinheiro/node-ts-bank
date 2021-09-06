import { Deposit } from './../domain/deposit'
import { AccountType } from './../domain/transactions'
import { CheckAmountUseCase } from './../useCases/check-amount'
import { Operation } from '@domain/index'
import { TransactionType } from '@domain/transactions'
import { CheckDocumentUseCase } from '@useCases/check-document'

export class CreateDeposit {
  private readonly checkDocumentUseCase: CheckDocumentUseCase
  private readonly checkAmountUseCase: CheckAmountUseCase

  constructor(
    private readonly depositCreationOperations: Map<string, TransactionType[]>,
    private readonly accountCreationOperations: Map<string, AccountType>,
    private readonly operation: Operation
  ) {
    this.checkDocumentUseCase = new CheckDocumentUseCase(this.operation)
    this.checkAmountUseCase = new CheckAmountUseCase(this.operation)
  }

  async handle(): Promise<void> {
    const document = await this.checkDocumentUseCase.handle()
    const amount = await this.checkAmountUseCase.handle()

    const accountToDeposit = this.accountCreationOperations.get(document)

    if (!accountToDeposit) {
      throw new Error('Account does not exist!')
    }

    const newDeposit = new Deposit(amount)

    accountToDeposit.balance += newDeposit.amount

    const deposits = [this.depositCreationOperations.get(document)?.flat(), { ...newDeposit }]
      .flat()
      .filter(item => item != null)

    this.depositCreationOperations.set(document, deposits as never)
  }
}

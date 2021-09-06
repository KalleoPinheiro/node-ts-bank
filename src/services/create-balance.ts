import { Balance, Operation, TransactionType, AccountType } from '@domain/index'
import { CheckAccountUseCase, CheckDocumentUseCase } from '@useCases/index'

export class CreateBalance {
  private readonly checkDocumentUseCase: CheckDocumentUseCase
  private readonly checkAccountUseCase: CheckAccountUseCase

  constructor(
    private readonly balanceTransactionOperations: Map<string, TransactionType[]>,
    private readonly accountCreationOperations: Map<string, AccountType>,
    private readonly operation: Operation
  ) {
    this.checkDocumentUseCase = new CheckDocumentUseCase(this.operation)
    this.checkAccountUseCase = new CheckAccountUseCase(this.accountCreationOperations)
  }

  async handle(): Promise<void> {
    const document = await this.checkDocumentUseCase.handle()

    const accountToBalance = await this.checkAccountUseCase.notExists(document)

    if (!accountToBalance) {
      throw new Error('Failed to get balance!')
    }

    const newBalance = new Balance(accountToBalance.balance)

    const balances = [this.balanceTransactionOperations.get(document)?.flat(), { ...newBalance }]
      .flat()
      .filter(item => item != null)

    this.balanceTransactionOperations.set(document, balances as never)
  }
}

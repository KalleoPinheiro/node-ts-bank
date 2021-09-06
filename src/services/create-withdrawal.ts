import { Withdrawal, AccountType, Operation, TransactionType } from '@domain/index'
import { CheckAmountUseCase, CheckDocumentUseCase, CheckBalanceIsEnough } from '@useCases/index'

export class CreateWithdraw {
  private readonly checkDocumentUseCase: CheckDocumentUseCase
  private readonly checkAmountUseCase: CheckAmountUseCase
  private readonly checkBalanceIsEnough: CheckBalanceIsEnough

  constructor(
    private readonly withdrawalCreationOperations: Map<string, TransactionType[]>,
    private readonly accountCreationOperations: Map<string, AccountType>,
    private readonly operation: Operation
  ) {
    this.checkDocumentUseCase = new CheckDocumentUseCase(this.operation)
    this.checkAmountUseCase = new CheckAmountUseCase(this.operation)
    this.checkBalanceIsEnough = new CheckBalanceIsEnough()
  }

  async handle(): Promise<void> {
    const document = await this.checkDocumentUseCase.handle()
    const amount = await this.checkAmountUseCase.handle()

    const accountToWithdraw = this.accountCreationOperations.get(document)

    if (!accountToWithdraw) {
      throw new Error('Account does not exist!')
    }

    await this.checkBalanceIsEnough.handle(accountToWithdraw.balance, amount)

    const newWithdraw = new Withdrawal(amount)

    accountToWithdraw.balance -= newWithdraw.amount

    const withdrawals = [
      this.withdrawalCreationOperations.get(document)?.flat(),
      { ...newWithdraw },
    ]
      .flat()
      .filter(item => item != null)

    this.withdrawalCreationOperations.set(document, withdrawals as never)
  }
}

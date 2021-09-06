import { TransactionType, TransferType, Operation, AccountType, Transfer } from '@domain/index'
import {
  CheckTransferIsValidUserCase,
  CheckAmountUseCase,
  CheckBalanceIsEnough,
  CheckAccountUseCase,
} from '@useCases/index'

export class CreateTransfer {
  private readonly checkTransferIsValidUseCase: CheckTransferIsValidUserCase
  private readonly checkAmountUseCase: CheckAmountUseCase
  private readonly checkBalanceIsEnough: CheckBalanceIsEnough
  private readonly checkAccountUseCase: CheckAccountUseCase

  constructor(
    private readonly accountCreationOperations: Map<string, AccountType>,
    private readonly transferTransactionOperations: Map<string, TransactionType & TransferType>,
    private readonly operation: Operation
  ) {
    this.checkTransferIsValidUseCase = new CheckTransferIsValidUserCase(this.operation)
    this.checkAmountUseCase = new CheckAmountUseCase(this.operation)
    this.checkBalanceIsEnough = new CheckBalanceIsEnough()
    this.checkAccountUseCase = new CheckAccountUseCase(this.accountCreationOperations)
  }

  async handle(): Promise<void> {
    const { payer, receiver, id } = await this.checkTransferIsValidUseCase.checkParams()

    const amount = await this.checkAmountUseCase.handle()

    await this.checkTransferIsValidUseCase.checkDestinyAndOrigin(payer, receiver)

    const payerAccount = await this.checkAccountUseCase.notExists(payer)

    const receiverAccount = await this.checkAccountUseCase.notExists(receiver)

    if (!payerAccount || !receiverAccount) {
      throw new Error(`Failed to get transfers account`)
    }

    await this.checkBalanceIsEnough.handle(payerAccount.balance, amount)

    const transfer = new Transfer(id, amount, payer, receiver)

    payerAccount.balance -= amount
    receiverAccount.balance += amount

    this.transferTransactionOperations.set(id, transfer)
  }
}

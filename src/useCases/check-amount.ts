import { Operation } from '@domain/operation'
import { OperationKind } from '@domain/operation-kind'

export class CheckAmountUseCase {
  constructor(private readonly operation: Operation) {}

  async handle(): Promise<number> {
    const amount =
      this.operation.type === OperationKind.TRANSFER
        ? this.operation?.transaction?.amount
        : this.operation.amount

    if (!amount || amount <= 0) {
      throw new Error('Amount was not provided or amount value is invalid!')
    }
    return amount
  }
}

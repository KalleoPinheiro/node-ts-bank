import { Operation } from '@domain/operation'

export class CheckAmountUseCase {
  constructor(private readonly operation: Operation) {}

  async handle(): Promise<number> {
    if (!this.operation.amount || this.operation.amount <= 0) {
      throw new Error('Amount was not provided or amount value is invalid!')
    }
    return this.operation.amount
  }
}

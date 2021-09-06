import { Operation, TransferType } from '@domain/index'

export class CheckTransferIsValidUserCase {
  constructor(private readonly operation: Operation) {}

  async checkParams(): Promise<TransferType> {
    if (
      !this.operation.transaction ||
      !this.operation.transaction.id ||
      !this.operation.transaction.amount ||
      !this.operation.transaction.payer ||
      !this.operation.transaction.receiver
    ) {
      throw new Error('Invalid transfer params was provided!')
    }

    return this.operation.transaction
  }

  async checkDestinyAndOrigin(payer: string, receiver: string): Promise<void> {
    if (payer === receiver) {
      throw new Error('Transfers to the same account is not allowed!')
    }
  }
}

export class CheckBalanceIsEnough {
  async handle(balance: number, amount: number): Promise<void> {
    if (balance < amount) {
      throw new Error('Balance unavailable for this operation!')
    }
  }
}

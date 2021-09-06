import { AccountType } from '@domain/transactions'

export class CheckAccountUseCase {
  constructor(private readonly accountCreationOperations: Map<string, AccountType>) {}

  async exists(document: string): Promise<void> {
    if (this.accountCreationOperations.has(document)) {
      throw new Error(`Account with this document ${document}, already exists!`)
    }
  }

  async notExists(document: string): Promise<AccountType | void> {
    if (!this.accountCreationOperations.has(document)) {
      throw new Error(`Account does not exists!`)
    }
    return this.accountCreationOperations.get(document)
  }
}

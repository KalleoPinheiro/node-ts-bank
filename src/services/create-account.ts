import { CheckAccountUseCase, CheckDocumentUseCase } from '@useCases/index'
import { Operation, Account, AccountType } from '@domain/index'

export class CreateAccount {
  private readonly checkDocumentUseCase: CheckDocumentUseCase
  private readonly checkAccountUseCase: CheckAccountUseCase

  constructor(
    private readonly accountCreationOperations: Map<string, AccountType>,
    private readonly operation: Operation
  ) {
    this.checkDocumentUseCase = new CheckDocumentUseCase(this.operation)
    this.checkAccountUseCase = new CheckAccountUseCase(this.accountCreationOperations)
  }

  async handle(): Promise<void> {
    const document = await this.checkDocumentUseCase.handle()
    await this.checkAccountUseCase.exists(document)

    const newAccount = new Account(this.operation?.balance)

    this.accountCreationOperations.set(document, newAccount)
  }
}

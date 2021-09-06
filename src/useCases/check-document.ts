import { Operation } from '@domain/operation'

export class CheckDocumentUseCase {
  constructor(private readonly operation: Operation) {}

  async handle(): Promise<string> {
    if (!this.operation.document) {
      throw new Error('Document was not provided!')
    }
    return this.operation.document
  }
}

import { TransactionType, ExtractType, TransferType, Operation, Extract } from '@domain/index'
import { CheckDocumentUseCase } from '@useCases/index'

export class CreateExtract {
  private readonly checkDocumentUseCase: CheckDocumentUseCase

  constructor(
    private readonly depositTransactionOperations: Map<string, TransactionType[]>,
    private readonly withdrawalTransactionOperations: Map<string, TransactionType[]>,
    private readonly transferTransactionOperations: Map<string, TransactionType & TransferType>,
    private readonly extractTransactionOperations: Map<string, ExtractType>,
    private readonly operation: Operation
  ) {
    this.checkDocumentUseCase = new CheckDocumentUseCase(this.operation)
  }

  async handle(): Promise<void> {
    const document = await this.checkDocumentUseCase.handle()

    const deposits = this.depositTransactionOperations.get(document)?.flat() ?? []

    const withdrawals = this.withdrawalTransactionOperations.get(document)?.flat() ?? []

    const transfers =
      Array.from(this.transferTransactionOperations.values()).filter(
        transfer => transfer.payer === document
      ) ?? []

    const extractInfo = { deposits, withdrawals, transfers }

    const extract = new Extract(document, extractInfo)

    this.extractTransactionOperations.set(document, extract)
  }
}

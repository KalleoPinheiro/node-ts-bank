import { PrintOperation } from '@domain/index'
import { writeFile } from 'fs/promises'

export class IssueProofOfTransaction {
  async handle(
    fileName: string,
    { operation, clientDocument, data }: PrintOperation
  ): Promise<void> {
    try {
      await writeFile(
        fileName,
        JSON.stringify({
          operation,
          clientDocument,
          data,
        }),
        'utf-8'
      )
    } catch (error) {
      throw new Error(`Failed to create file, ${fileName}`)
    }
  }
}

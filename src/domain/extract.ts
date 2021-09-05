import { ExtractTransactions, TransactionType } from '@domain/transactions'
import { formatDate } from 'src/utils/format-date'
import { v4 } from 'uuid'

export class Extract implements TransactionType {
  transactionId: string
  transactionDate: string
  document: string
  transactions: ExtractTransactions

  constructor(document: string, transactions: ExtractTransactions) {
    this.transactionId = v4()
    this.transactionDate = formatDate(new Date())
    this.document = document
    this.transactions = transactions
  }
}

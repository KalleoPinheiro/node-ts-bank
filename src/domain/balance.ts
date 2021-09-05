import { TransactionType } from '@domain/transactions'
import { formatDate } from 'src/utils/format-date'
import { v4 } from 'uuid'

export class Balance implements TransactionType {
  transactionId: string
  amount: number
  transactionDate: string

  constructor(value: number) {
    this.transactionId = v4()
    this.amount = value
    this.transactionDate = formatDate(new Date())
  }
}

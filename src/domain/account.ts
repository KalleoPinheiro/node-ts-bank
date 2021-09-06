import { TransactionType } from '@domain/transactions'
import { formatDate } from '@utils/format-date'
import { v4, v5 } from 'uuid'

export class Account implements TransactionType {
  transactionId: string
  transactionDate: string
  accountNumber: string
  balance: number
  endDate: string | null

  constructor(amount?: number) {
    this.transactionId = v4()
    this.accountNumber = v5('account_key', process.env.API_KEY || v4())
    this.balance = amount ?? 0
    this.transactionDate = formatDate(new Date())
    this.endDate = null
  }
}

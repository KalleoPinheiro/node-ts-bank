import { TransactionType, TransferType } from '@domain/transactions'
import { formatDate } from '@utils/format-date'
import { v4 } from 'uuid'

export class Transfer implements TransactionType, TransferType {
  transactionId: string
  id: string
  amount: number
  transactionDate: string
  payer: string
  receiver: string

  constructor(id: string, value: number, origin: string, destiny: string) {
    this.transactionId = v4()
    this.id = id
    this.amount = value
    this.transactionDate = formatDate(new Date())
    this.payer = origin
    this.receiver = destiny
  }
}

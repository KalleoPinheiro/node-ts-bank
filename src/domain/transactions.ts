export type TransactionType = {
  transactionId: string
  amount?: number
  transactionDate: string
}

export type AccountType = {
  accountNumber: string
  balance: number
  endDate: string | null
}

export type TransferType = {
  id: string
  payer: string
  receiver: string
  amount: number
}

export interface ExtractTransactions {
  deposits: TransactionType[]
  withdrawals: TransactionType[]
  transfers: TransactionType[]
}

export interface ExtractType {
  transactionId: string
  transactionDate: string
  document: string
  transactions: ExtractTransactions
}

export type PrintOperation = {
  operation: string
  clientDocument: string
  data: unknown
}

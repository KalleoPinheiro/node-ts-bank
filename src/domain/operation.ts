import { OperationKind } from './operation-kind'
import { TransferType } from './transactions'

export type Operation = {
  type: OperationKind
  document?: string
  balance?: number
  amount?: number
  transaction?: TransferType
}

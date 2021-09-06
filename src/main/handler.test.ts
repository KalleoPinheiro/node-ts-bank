import { Operation } from '@domain/operation'
import data from '@input/data.json'
import { Handler } from './handler'
import { SegregateOperationType } from '@services/segregate-operation-type'

jest.mock('@services/segregate-operation-type')

const SegregateOperationMock = SegregateOperationType as jest.MockedClass<
  typeof SegregateOperationType
>

beforeEach(() => {
  SegregateOperationMock.mockClear()
})

describe('Handler tests', () => {
  it('should check if the segregate class called the class constructor', async () => {
    const handlerConsumer = new Handler(data as unknown as Operation[])
    expect(SegregateOperationMock).not.toHaveBeenCalled()
    handlerConsumer.main()
    expect(SegregateOperationMock).toHaveBeenCalledTimes(1)
  })
})

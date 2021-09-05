import 'dotenv/config'
import data from '@input/data.json'
import { Operation } from '@domain/index'
import { Handler } from '@main/handler'

const handler = new Handler(data as unknown as Operation[])

handler.main()

import { v4 } from 'uuid'

export const generateFileName = (
  outputPath: string,
  operationType: string,
  document: string
) => {
  return `${outputPath}/${operationType.toLowerCase()}/${operationType.toUpperCase()}-${document}-${v4().substring(
    0,
    8
  )}.json`
}

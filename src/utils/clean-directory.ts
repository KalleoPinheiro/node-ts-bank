import { resolve } from 'path'
import { readdir } from 'fs/promises'

export async function* getFiles(dir: string): any {
  const directories = await readdir(dir, { withFileTypes: true })
  for (const directory of directories) {
    const res = resolve(dir, directory.name)
    if (directory.isDirectory()) {
      yield* getFiles(res)
    } else {
      yield res
    }
  }
}

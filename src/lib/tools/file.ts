import fs from 'node:fs'
import { createIgnoreSync, getProjectRoot, walkDirSync } from './fileutils'
import { execSync } from 'node:child_process'
import { dirname } from 'node:path'
import path from 'node:path'
import { readFileSync } from 'node:fs'

export function readProjectTree(): string {
  const root = getProjectRoot()
  return execSync(`tree -L 3 -I 'node_modules|.git|.svelte-kit|build|dist' ${root}`, {
    encoding: 'utf-8',
  })
}

export const makeDirectory = (path: string) => fs.mkdirSync(path, { recursive: true })

export const remove = (path: string): void => {
  fs.rmSync(path, { recursive: true, force: true })
}

export function writeFile(filePath: string, content: string): void {
  makeDirectory(dirname(filePath))
  fs.writeFileSync(filePath, content, 'utf-8')
}

export function readFolderContents(target: string, depth: number): string {
  const absoluteTarget = path.resolve(target)
  const ig = createIgnoreSync(absoluteTarget)
  const files = walkDirSync(absoluteTarget, absoluteTarget, ig, depth)

  const content = files.map(file => {
    const stat = fs.statSync(file)
    const relativePath = path.relative(absoluteTarget, file)
    const lastModified = stat.mtime.toISOString()
    const header = `\n/* File: ${relativePath}\n   Absolute path: ${file}\n   Last modified: ${lastModified} */\n\n`
    return (
      header +
      (stat.isDirectory() ? `// Directory: ${relativePath}\n` : fs.readFileSync(file, 'utf-8'))
    )
  })

  return content.join('\n')
}

// console.log(readFolderContents('src/components/ui', 4))
// console.log(readFolderContents('src/components/core', 4))
// console.log(readFile('src/lib/stores/index.svelte.ts'))

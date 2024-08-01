import fs from 'node:fs'
import path from 'node:path'
import ignore from 'ignore'
import { findUpSync } from 'find-up'

export const IGNORE_PATTERNS = [
  // Directories
  '**/node_modules/**',
  '**/out.txt',
  '**/.npmrc',
  '**/.prettierrc',
  '**/.prettierignore',
  '**/.svelte-kit/**',
  '**/.git/**',
  '**/build/**',
  '**/dist/**',
  '**/.vscode/**',

  // Config files
  '**/svelte.config.js',
  '**/tailwind.config.js',
  '**/postcss.config.js',
  '**/.eslintrc.*',
  '**/eslint.config.js',

  // Package manager files
  '**/package-lock.json',
  '**/yarn.lock',
  '**/pnpm-lock.yaml',

  // Misc files
  '**/.DS_Store',
  '**/*.log',
  '**/*.lock',
  '**/*.sh',
  '**/*.env*',
  '!**/.env.example',

  // Binary files
  '**/*.png',
  '**/*.jpg',
  '**/*.gif',
  '**/*.svg',

  // Temporary files
  '**/*.tmp',
  '**/*.temp',
  '**/*.cache',

  // Specific to your project
  '**/copy_to_clipboard.sh',
  '**/fix_packages_to_knowledgecutoff.sh',
  '**/setup_tailwind.sh',

  //? Included for AI SWE bot
  // "**/tsconfig.json",
  // "**/vite.config.ts",
  // "**/playwright.config.ts",
  // "**/*.test.ts",
  // "**/*.spec.ts",
  // "**/tests/**",
]

export const getProjectRoot = () => {
  const packageJsonPath = findUpSync('package.json')
  if (!packageJsonPath) throw new Error('Unable to find project root')
  return path.dirname(packageJsonPath)
}

export function walkDirSync(
  baseDir: string,
  currentDir: string,
  ig: ReturnType<typeof ignore>,
  depth: number
): string[] {
  const list = fs.readdirSync(currentDir)
  const results: string[] = []

  for (const file of list) {
    const filePath = path.join(currentDir, file)
    const relativePath = path.relative(baseDir, filePath)
    if (ig.ignores(relativePath)) continue

    const stat = fs.statSync(filePath)
    if (stat.isDirectory() && depth !== 0) {
      results.push(...walkDirSync(baseDir, filePath, ig, depth > 0 ? depth - 1 : -1))
    } else {
      results.push(filePath)
    }
  }

  return results
}

export const resolveProjectPath = (...segments: string[]) =>
  path.join(getProjectRoot(), ...segments)

export const createIgnoreSync = (dir: string) => {
  const gitignorePath = path.join(dir, '.gitignore')
  let gitignorePatterns: string[] = []

  try {
    const content = fs.readFileSync(gitignorePath, 'utf-8')
    gitignorePatterns = content.split('\n').filter(line => line.trim() && !line.startsWith('#'))
  } catch {
    // If .gitignore doesn't exist or can't be read, use an empty array
  }

  return ignore().add([...IGNORE_PATTERNS, ...gitignorePatterns])
}

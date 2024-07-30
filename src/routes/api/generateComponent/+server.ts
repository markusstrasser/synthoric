import { json } from '@sveltejs/kit'
import type { RequestHandler } from './$types'
import { writeFile, mkdir } from 'node:fs/promises'
import { nanoid } from 'nanoid'
import path from 'node:path'

export const POST: RequestHandler = async ({ request }) => {
  try {
    const { componentName } = await request.json()

    // Your component generation logic here
    const generatedComponent = `
    <script>
    import SubmitButton from '$components/SubmitButton.svelte'
    let count = $state(0)
  </script>
  
  <h2>dynamic</h2>
  <SubmitButton />
  <button onclick={() => count++}>
    Clicks: {count}
  </button>  
    `

    const filename = `Dynamic_${nanoid()}.svelte`

    try {
      const dirPath = path.join(process.cwd(), 'src', 'components', '_generated')
      const filePath = path.join(dirPath, filename)

      // Ensure the directory exists
      await mkdir(dirPath, { recursive: true })

      // Write the file
      await writeFile(filePath, generatedComponent)

      return json({
        success: true,
        filePath,
      })
    } catch (error) {
      console.error('Error saving component:', error)
      return json({ success: false, error: 'Failed to save component' }, { status: 500 })
    }
  } catch (error) {
    console.error('Error generating component:', error)
    return json({ success: false, error: 'Failed to generate component' }, { status: 500 })
  }
}

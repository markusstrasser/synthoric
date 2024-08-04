import { json } from '@sveltejs/kit'
import type { RequestHandler } from './$types'
import { mkdir } from 'node:fs/promises'
import path from 'node:path'
import Tools from '$lib/tools'
import { convexClient } from '$lib/providers'
import { api } from '$convex/_generated/api'
import formatContextPrompt from '$lib/formatContextPrompt'
import generateDynamicInterface from '$lib/generateDynamicInterface'
// import { dynamicComponentStarterMarkup } from '$lib/tools/AIToolConfigs/DynamicInterface'

const mockComponent = `
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

import { writeFile } from '$lib/tools/file'
export const POST: RequestHandler = async ({ request }) => {
  try {
    const { componentName, patchPrompt, action, interactionId, seqIndex = 2 } = await request.json()
    const context = await convexClient.query(api.interactions.getContext, {
      seqIndex,
    })
    const contextStr = formatContextPrompt(context)
    writeFile('.logs/context.txt', contextStr)
    const { specficationPrompt, debug } = await Tools.InterfaceSpec.execute(contextStr)
    console.log('Interaction Spec', specficationPrompt)
    writeFile('.logs/interactionSpec.txt', specficationPrompt)
    // Your component generation logic here
    const svelteCode = await generateDynamicInterface(specficationPrompt)
    writeFile('.logs/generatedComponent.txt', svelteCode)
    // console.log('generatedComponent', svelteCode)
    const filename = `Dynamic_${Date.now()}.svelte`

    try {
      const dirPath = path.join(process.cwd(), 'src', 'components', '_generated')
      const filePath = path.join(dirPath, filename)

      // Ensure the directory exists
      await mkdir(dirPath, { recursive: true })

      // Write the file
      await writeFile(filePath, svelteCode)

      return json({
        success: true,
        filePath,
        debug,
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

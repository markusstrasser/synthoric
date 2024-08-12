<script lang="ts">
  import type { ComponentType } from 'svelte'
  import Markdown from '$components/core/Markdown.svelte'
  import actions, { createDispatch } from '$stores/index.svelte'
  import DynamicTest from '$components/_generated/Dynamic_1722868406297.svelte'
  let componentName = $state('')
  let DynamicComponent = $state<ComponentType | null>(null)
  let error = $state<string | null>(null)
  let importPath = $state<string>('')
  let InteractionSpecDebug = $state<string>('')

  async function generateComponent() {
    error = null
    DynamicComponent = null

    try {
      const response = await fetch('/api/generateComponent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ componentName }),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const result = await response.json()

      if (result.success) {
        // importPath = `../../components/${result.filename}`
        importPath = `${result.filePath}`
        console.log('Attempting to import from:', importPath)
        InteractionSpecDebug = result.debug

        try {
          const module = await import(/* @vite-ignore */ importPath)

          if (module.default) {
            DynamicComponent = module.default
          } else if (typeof module === 'function') {
            DynamicComponent = module as ComponentType
          } else {
            throw new Error('Imported module is not a valid Svelte component')
          }
        } catch (importError) {
          console.error('Error during import:', importError)
          throw new Error(
            `Failed to import component: ${importError instanceof Error ? importError.message : 'Unknown error'}`
          )
        }
      } else {
        throw new Error(result.error || 'Server returned an unsuccessful response')
      }
    } catch (err) {
      console.error('Error generating component:', err)
      error = err instanceof Error ? err.message : 'An unknown error occurred'
    }
  }

  $effect(() => {
    if (DynamicComponent) {
      console.log('Effect triggered - New component loaded:', DynamicComponent)
    }
  })
</script>

<form on:submit|preventDefault={generateComponent}>
  <input bind:value={componentName} placeholder="Enter component name" required />
  <button type="submit">Generate Component</button>
</form>

<Markdown content={InteractionSpecDebug} />
{#if error}
  <p style="color: red;">{error}</p>
{/if}

{#if importPath}
  <p>Import path: {importPath}</p>
{/if}

{#if DynamicComponent}
  <div>
    <h3>Generated Component:</h3>
    <svelte:component this={DynamicComponent} />
  </div>
{:else}
  <p>No component loaded yet.</p>
{/if}

<DynamicTest />

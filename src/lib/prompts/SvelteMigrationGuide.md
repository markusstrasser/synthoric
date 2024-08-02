<svelte5-migration-guide>
# Svelte 5 Migration Guide: Introducing Runes

## Background

Svelte is a web UI framework using a compiler to turn declarative component code into optimized JavaScript that updates the document when state changes. Svelte 5 introduces "runes," which provide universal, fine-grained reactivity.

## Key Changes

### 1. State Declaration

```svelte
<!-- Before (Svelte 4) -->
<script>
  let count = 0;
</script>

<!-- After (Svelte 5) -->
<script>
  let count = $state(0);
</script>
```

### 2. Derived Values

```svelte
<!-- Before -->
<script>
  let count = 0;
  $: doubleCount = count * 2;
</script>

<!-- After -->
<script>
  let count = $state(0);
  let doubleCount = $derived(count * 2);
</script>
```

### 3. Side Effects

```svelte
<!-- Before -->
<script>
  let count = 0;
  $: {
    if (count > 10) console.log('Count is high!');
  }
</script>

<!-- After -->
<script>
  let count = $state(0);
  $effect(() => {
    if (count > 10) console.log('Count is high!');
  });
</script>
```

### 4. Component Props

```svelte
<!-- Before -->
<script>
  export let name = 'World';
</script>

<!-- After -->
<script>
  let { name = 'World' } = $props();
</script>
```

### 5. Event Handling

```svelte
<!-- Before -->
<button on:click={handleClick}>Click me</button>

<!-- After -->
<button onclick={handleClick}>Click me</button>
```

### 6. Stores

```javascript
// Before (store.js)
import { writable } from 'svelte/store'
export const count = writable(0)

// After (store.svelte.js)
export const count = $state(0)
```

```svelte
<!-- Before (Component.svelte) -->
<script>
  import { count } from './store.js';
</script>
<p>The count is {$count}</p>

<!-- After (Component.svelte) -->
<script>
  import { count } from './store.svelte.js';
</script>
<p>The count is {count}</p>
```

### 7. Snippets (replacing slots)

```svelte
<!-- Before -->
<Card>
  <h2 slot="title">Card Title</h2>
  <p>Card content</p>
</Card>

<!-- After -->
<Card>
  {#snippet title()}
    <h2>Card Title</h2>
  {/snippet}
  <p>Card content</p>
</Card>
```

## Additional Runes

### $state.frozen

Creates immutable state:

```javascript
let numbers = $state.frozen([1, 2, 3])
```

### $state.snapshot

Takes a static snapshot of reactive state:

```javascript
console.log($state.snapshot(counter))
```

### $state.is

Compares values, useful for reactive proxies:

```javascript
console.log($state.is(foo.bar, bar))
```

### $derived.by

For complex derivations:

```javascript
let total = $derived.by(() => {
  let sum = 0
  for (const n of numbers) {
    sum += n
  }
  return sum
})
```

### $effect.pre

Runs before DOM updates:

```javascript
$effect.pre(() => {
  // Code here runs before DOM updates
})
```

### $effect.tracking

Tells if code is running in a tracking context:

```javascript
console.log($effect.tracking())
```

### $effect.root

Creates a non-tracked scope:

```javascript
const cleanup = $effect.root(() => {
  // Non-tracked scope
})
```

### $bindable

Declares props as bindable:

```javascript
let { bindableProp = $bindable() } = $props()
```

### $inspect

Logs value changes during development:

```javascript
$inspect(count)
```

### $host

Retrieves the custom element's `this` reference:

```javascript
$host().dispatchEvent(new CustomEvent('greeting', { detail: greeting }))
```

## Imports

New imports from 'svelte':

- flushSync
- mount
- hydrate
- unmount
- untrack
- createRawSnippet

From 'svelte/reactivity':

- SvelteMap, SvelteSet, SvelteDate, SvelteURL

From 'svelte/events':

- on

From 'svelte/server':

- render

From 'svelte/elements':

- Various DOM types for proper HTML element typing

## Benefits of Runes

1. Universal Reactivity: Extends to .svelte.js and .svelte.ts modules.
2. Runtime Reactivity: Dependencies determined at runtime, improving refactorability.
3. Fine-grained Updates: Changes to values inside large lists don't invalidate other list members.
4. Simplified API: Replaces several existing concepts.

   </svelte5-migration-guide>

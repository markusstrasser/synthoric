# Svelte-actions Docs and examples

```ts
import { longpress, preventTabClose, shortcut } from 'svelte-actions'
```

```ts
export function longpress(node: HTMLElement, duration: number): ReturnType<Action>
//Creates longpress event when mousedown above duration milliseconds.

<script>
  import {longpress} from 'svelte-actions'
</script>

<button use:longpress={duration}
    on:longpress="{() => pressed = true}"
    on:mouseenter="{() => pressed = false}"
  >press and hold</button>
```

```ts

API
export function shortcut(node: Action, {
  control?: boolean;
  shift?: boolean;
  alt?: boolean;
  code: string;
  callback?: (node?: HTMLElement) => void;
})
//Add a keyboard shortcut to a div or a button.
//It either calls a callback or clicks on the node it was put on.


<script>
  import {shortcut} from 'svelte-actions'
	let buttonCount = 0, divCount = 0;
</script>

<button use:shortcut={{shift: true, code: 'Digit1'}} on:click={() => buttonCount++}>
	Triggers a click on the button (Shift + 1)
</button>

Clicked: {buttonCount}

```

```ts
export function preventTabClose(_, enabled: boolean)

//Prevent current tab from being closed by user.

<script>
  import {preventTabClose} from 'svelte-actions'
  let isOn = false
</script>

<button use:preventTabClose={isOn} on:click={() => isOn = !isOn}>Click me</button>
```

<script>
  // Example icons for different inference types
  const icons = {
    knowledge: '📘',
    skill: '🛠️',
    misconception: '❌',
    other: '🔍',
  }

  const { inference, listStyle = false } = $props()
</script>

<div
  class="flex items-center rounded-lg bg-white p-2 shadow-md"
  class:flex-col={!listStyle}
  class:space-y-2={!listStyle}
  class:space-x-4={listStyle}
>
  <span class="text-lg">{icons[inference.type]}</span>
  <div class="flex-grow">
    <h2 class="truncate text-sm font-bold text-gray-800">
      {inference.description}
    </h2>
    <div class="flex text-xs text-gray-600">
      <p class="mr-2">
        Type: <span class="font-semibold">{inference.type}</span>
      </p>
      <p class="mr-2">
        Mastery:
        <span class="font-semibold">
          {(inference.assumedMasteryLevel * 100).toFixed(0)}%
        </span>
      </p>
      <p>
        Confidence:
        <span class="font-semibold">
          {(inference.systemConfidence * 100).toFixed(0)}%
        </span>
      </p>
    </div>
  </div>
  <div class="text-xs">
    <h3 class="font-semibold">Sources:</h3>
    {#each inference.sources as source, index (index)}
      <p class="truncate">
        {source.whyRelevant} ({(source.weight * 100).toFixed(0)}%)
      </p>
    {/each}
  </div>
</div>

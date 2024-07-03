<script lang="ts">
  export const size = 24
</script>

<svg
  class={$$props.class}
  width={size}
  height={size}
  viewBox="0 0 24 24"
  xmlns="http://www.w3.org/2000/svg"
>
  <circle
    class="spinner"
    cx="12"
    cy="12"
    r="10"
    fill="none"
    stroke="currentColor"
    stroke-width="4"
  />
</svg>

<style>
  .spinner {
    animation: spin 1s linear infinite;
    transform-origin: center;
  }

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
</style>

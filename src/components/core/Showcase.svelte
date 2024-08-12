<script lang="ts">
  import Dropdown from './Dropdown.svelte'
  import GridMultiSelect from './GridMultiSelect.svelte'
  import LinePlot from './LinePlot.svelte'
  import Markdown from './Markdown.svelte'
  import MultipleChoice from './MultipleChoice.svelte'
  import P5Example from './P5Example.svelte'
  import P5Example2 from './P5Example2.svelte'
  import SolutionReview from './SolutionReview.svelte'
  import Tree from './Tree.svelte'

  // Mock data for Dropdown
  const dropdownItems = ['Item 1', 'Item 2', 'Item 3']

  // Mock data for GridMultiSelect
  const physicsProblems = [
    {
      id: '1',
      content: 'Calculate the velocity of a falling object after 5 seconds',
      row: 0,
      col: 0,
    },
    {
      id: '2',
      content: 'Determine the wavelength of a sound wave with frequency 440 Hz',
      row: 0,
      col: 1,
    },
    {
      id: '3',
      content: 'Find the electric field at a point due to two point charges',
      row: 0,
      col: 2,
    },
    {
      id: '4',
      content: 'Solve for the final velocity using conservation of momentum in a collision',
      row: 1,
      col: 0,
    },
    { id: '5', content: 'Calculate the resonant frequency of an LC circuit', row: 1, col: 1 },
    {
      id: '6',
      content: 'Determine the magnetic force on a moving charged particle',
      row: 1,
      col: 2,
    },
    {
      id: '7',
      content: 'Use the Schrödinger equation to find the energy levels of a particle in a box',
      row: 2,
      col: 0,
    },
    {
      id: '8',
      content: 'Calculate the relativistic mass of a particle moving at 0.8c',
      row: 2,
      col: 1,
    },
    {
      id: '9',
      content: 'Determine the half-life of a radioactive isotope given its decay rate',
      row: 2,
      col: 2,
    },
  ]
  const gridRows = 3
  const gridCols = 3
  const gridRowLabels = ['Easy', 'Medium', 'Hard']
  const gridColLabels = ['Mechanics', 'Waves & E&M', 'Modern Physics']

  // Mock data for LinePlot
  const plotData = [1, 3, 2, 5, 4, 7, 6, 8, 9]

  // Mock data for Markdown
  const markdownContent = '# Hello\n\nThis is **bold** and this is *italic*.'

  // Mock data for MultipleChoice
  const multipleChoiceData = {
    choices: ['Option A', 'Option B', 'Option C'],
    isCorrect: [true, false, false],
  }

  // Mock data for SolutionReview
  const solutionReviewData = {
    title: 'Example Solution',
    sections: [
      { title: 'Introduction', content: 'This is the introduction.' },
      { title: 'Main Body', content: 'This is the main body.' },
    ],
    steps: [
      { id: '1', content: 'Step 1', depth: 0 },
      { id: '2', content: 'Step 2', depth: 1 },
      { id: '3', content: 'Step 3', depth: 1 },
    ],
  }

  // Mock data for Tree
  const treeData = [
    {
      id: '1',
      name: 'Root',
      children: [
        { id: '2', name: 'Child 1' },
        { id: '3', name: 'Child 2', children: [{ id: '4', name: 'Grandchild' }] },
      ],
    },
  ]

  let selectedMultipleChoiceIndex = $state<number | null>(null)
</script>

<div class="space-y-8 p-4">
  <section>
    <h2 class="text-2xl font-bold">Dropdown</h2>
    <Dropdown>
      <span>Click me</span>
      <ul slot="dropDownList">
        {#each dropdownItems as item}
          <li>{item}</li>
        {/each}
      </ul>
    </Dropdown>
  </section>

  <section>
    <h2 class="text-2xl font-bold">Physics Problem Selector</h2>
    <p class="mb-2">Select the problems you think you could solve without help:</p>
    <GridMultiSelect
      items={physicsProblems}
      rows={gridRows}
      cols={gridCols}
      rowLabels={gridRowLabels}
      colLabels={gridColLabels}
      onSelect={selectedIds => console.log('Selected problems:', selectedIds)}
    />
  </section>

  <section>
    <h2 class="text-2xl font-bold">LinePlot</h2>
    <LinePlot data={plotData} />
  </section>

  <section>
    <h2 class="text-2xl font-bold">Markdown</h2>
    <Markdown content={markdownContent} />
  </section>

  <section>
    <h2 class="text-2xl font-bold">MultipleChoice</h2>
    <MultipleChoice
      choices={multipleChoiceData.choices}
      isCorrect={multipleChoiceData.isCorrect}
      onSelect={(choice, index) => console.log('Selected:', choice, 'at index', index)}
      bind:selectedIndex={selectedMultipleChoiceIndex}
    />
  </section>
  <!-- 
  <section>
    <h2 class="text-2xl font-bold">P5Example</h2>
    <P5Example />
  </section>

  <section>
    <h2 class="text-2xl font-bold">P5Example2</h2>
    <P5Example2 />
  </section> -->

  <section>
    <h2 class="text-2xl font-bold">SolutionReview</h2>
    <SolutionReview
      title={solutionReviewData.title}
      sections={solutionReviewData.sections}
      steps={solutionReviewData.steps}
      onSelect={id => console.log('Selected step:', id)}
    />
  </section>

  <section>
    <h2 class="text-2xl font-bold">Tree</h2>
    <Tree content={treeData} />
  </section>
</div>

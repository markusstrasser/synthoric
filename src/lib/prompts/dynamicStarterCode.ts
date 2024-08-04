//Shadcn components
import { Tabs, TabsList, TabsTrigger, TabsContent } from '$components/ui/tabs'
import { Tooltip, TooltipTrigger, TooltipContent } from '$components/ui/tooltip'

//Custom components
import SolutionReview from '$components/core/SolutionReview.svelte'
import Tree from '$components/core/Tree.svelte'
import Markdown from '$components/core/Markdown.svelte'

//Libraries
import P5 from 'p5-svelte'
import type { Sketch } from 'p5-svelte'
import * as d3 from 'd3'

import actions from '$stores/index.svelte'
import { createDispatch, dispatch } from '$stores/index.svelte'

import { clickOutside, longpress, preventTabClose, shortcut } from 'svelte-actions'

//Your code and svelte html/markup + tailwind below ...  ->

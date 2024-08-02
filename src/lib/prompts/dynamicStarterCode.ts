//Shadcn components
import { Tabs, TabsList, TabsTrigger, TabsContent } from '$components/ui/tabs'
import {
  FormField,
  FormLabel,
  FormControl,
  FormDescription,
  FormFieldset,
  FormLegend,
} from '$components/ui/form'
import { Tooltip, TooltipTrigger, TooltipContent } from '$components/ui/tooltip'
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '$components/ui/card'
import { Input } from '$components/ui/input'
import { Skeleton } from '$components/ui/skeleton'
import { Label } from '$components/ui/label'
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuCheckboxItem,
  DropdownMenuRadioItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuGroup,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
  DropdownMenuRadioGroup,
} from '$components/ui/dropdown-menu'
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
} from '$components/ui/dialog'
import { Button } from '$components/ui/button'
import {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableHead,
  TableRow,
  TableCell,
  TableCaption,
} from '$components/ui/table'
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectLabel,
} from '$components/ui/select'

//Custom components
import SolutionReview from '$components/core/SolutionReview.svelte'
import GridMultiSelect from '$components/core/GridMultiSelect.svelte'
import MultipleChoice from '$components/core/MultipleChoice.svelte'
import Tree from '$components/core/Tree.svelte'
import Markdown from '$components/core/Markdown.svelte'

import actions from '$stores/index.svelte'
import { createDispatch, dispatch } from '$stores/index.svelte'

//Your code and svelte html/markup + tailwind below ...  ->

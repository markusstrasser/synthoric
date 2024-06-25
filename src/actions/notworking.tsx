'use server'
import { streamUI } from 'ai/rsc';
import { openai } from "@/lib/providers";
import { z } from 'zod';
import { ApplicationGoalTemplate, ContextExplainerTemplate } from '@/lib/prompts/snippets';
import { getContext } from '@/lib/utils';
import spec from '@/lib/tools';
import Handlebars from 'handlebars';
import { generateObject } from 'ai';

import ExerciseWithTextInput from '@/components/ExerciseWithTextInput';
import Markdown from '@/components/Markdown';
import { ServerWrapper } from './ServerWrapper';
// Import the ExerciseWithTextInput component dynamically

const LoadingComponent = () => (
  <div className="animate-pulse p-4">getting weather...</div>
);

const getWeather = async (location: string) => {
  await new Promise(resolve => setTimeout(resolve, 2000));
  return '82°F️ ☀️';
};

interface WeatherProps {
  location: string;
  weather: string;
}

const WeatherComponent = (props: WeatherProps) => (
  <div className="border border-neutral-200 p-4 rounded-lg max-w-fit">
    The weather in {props.location} is {props.weather}
  </div>
);


export async function streamComponent() {
  const context = await getContext();
  const topic = 'physics';


  //! useless! can't stream client components???
  return streamUI({
    model: openai('gpt-4o'),
    prompt: `${ApplicationGoalTemplate}
    ----
    Your job now is to decide on the best next interaction type [toolcall] to serve to the student. 
    
    The general topic is ${topic} 
    ${Handlebars.compile(ContextExplainerTemplate)(context)}
    
    If the tool parameters have a 'prompt' field: 
    * in the parameters you need to generate a specific prompt for the tool AI generator to use that details the subtopic, what skill/concept should be tested and so on. Consult the previous student history to generate a fitting, personalized instruction (interactions and system inferences about the student). 
    * In the prompt, also list any context (interactions, inferences) to best inform the tool AI.
    ----
    `,
    toolChoice: "required",
    tools: {
      ExerciseWithTextInput: {
        description: 'A small exercise meant to be answered with freeform text input. The solution is revealed after the student submits an answer',
        parameters: z.object({
          prompt: z.string().describe("Detailed instruction for the LLM to generate a fitting exercise for the student, taking in account previous history"),
        }),
        generate: async function* ({ prompt }) {
          yield <ServerWrapper><div>Creating a custom made exercise for you</div></ServerWrapper>;
          // const task = await generateTextInputTask(prompt);
          //! apparently streamUI cannot stream CLIENT COMPONETS!!?? 2 hours wasted trying it
          return <ServerWrapper><div>aa</div></ServerWrapper>;
          // const solution = await generateTextInputSolution(task);
          // return <ServerWrapper><ExerciseWithTextInput interaction={{task, solution}} /></ServerWrapper>;
        },
      },
      getWeather: {
        description: 'Get the weather for a location',
        parameters: z.object({
          location: z.string(),
        }),
        generate: async function* ({ location }) {
          yield <LoadingComponent />;
          const weather = await getWeather(location)
          yield <div>STILL LOOADING</div>
          const weather2 = await getWeather(location);
          return <WeatherComponent weather={weather2} location={location} />;
        },
      },
    },
  });
}
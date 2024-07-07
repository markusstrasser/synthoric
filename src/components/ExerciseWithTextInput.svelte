'use client'
import Markdown from "./Markdown";
import { TextInput } from "./TextInput";
import { isEmpty } from "lodash";
import SolutionReview from "./SolutionReview";
import { useStore } from "@/app/appStore";


import dynamic from 'next/dynamic';

export default function ({
  interaction,
  readOnly = false,
  children = null,
}) {
  const { task, solution, systemFeedback } = interaction;
  const { finalActionTriggered } = useStore();
  return (
    <>
      <progress key="progress" value={0.7} />
      <Markdown>{task}</Markdown>
      <TextInput id={"1"} />
      {children} //? answersubmit button etc //? once archived all inputs are
      disabled
      {!isEmpty(systemFeedback) && (
        <>
          <h3>YOUR SUBMISSION: {interaction.userActions[0].value}</h3>
          <div>{JSON.stringify(systemFeedback)}</div>
        </>
      )}
      {!finalActionTriggered ? (
        <div>-.*submit to see solution.*.-</div>
      ) : (
        <SolutionReview {...solution} />
      )}
      <hr />
    </>
  );
}
'use server';

import Markdown from "@/components/Markdown";

export const ServerWrapper = async ({ children }: { children: React.ReactNode; }) => (
  <div>
    server component wrapper
    <div><Markdown>#hello</Markdown></div>
  </div>
);

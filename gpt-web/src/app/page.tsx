'use client';

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import React from "react";
import { callGPT4Mini } from "./actions";
import ReactMarkdown from 'react-markdown';
import Image from 'next/image';
import alice from "../../public/alice.png";

export default function Home() {
  const [story, setStory] = React.useState<string>("");
  const [loading, setLoading] = React.useState<boolean>(false);
  const [value, setValue] = React.useState<string>("");

  const generate = async () => {
    const prompt = value;
    setLoading(true);
    setValue("");
    try {
        const response = await callGPT4Mini(prompt);
        setStory(response);
    } catch (error) {
        console.error('Failed to generate story:', error);
        // Optionally set an error state here
    } finally {
        setLoading(false);
    }
  };

  return (
    <main>
      <style jsx global>{`
      body {
        background-image: url('/bg2.svg');
        background-repeat: no-repeat;
        background-size: cover;
      }
      .prose p {
        margin-bottom: 1.5em;
      }
      `}</style>
      <div className="min-h-screen flex items-center justify-center gap-4 p-4 mx-auto">
        <Card className="w-full max-w-[300px] h-[80vh] flex flex-col m-4 ">
          <CardHeader>
            <CardTitle>Alice in Climate Change Wonderland</CardTitle>
            <CardDescription>Generate children stories about climate change in the style of Alice in Wonderland</CardDescription>
          </CardHeader>
            <CardContent className="relative flex-1 p-4 flex items-center justify-center">
              <div className="relative w-[90%] h-full rounded-lg overflow-hidden">
                <Image 
                  src={alice.src} 
                  alt="Alice in Wonderland" 
                  fill
                  priority
                  className="object-cover rounded-lg"
                  sizes="(max-width: 300px) 100vw, 300px"
                />
              </div>
            </CardContent>
        </Card>
        <Card className="w-full max-w-[800px] h-[80vh] flex flex-col">
          <CardHeader>
          <CardTitle><h2>Generate!</h2></CardTitle>
          </CardHeader>
          <CardContent className="flex-1 overflow-hidden">
          <ScrollArea className="h-full pr-4">
              <div className="prose space-y-6 dark:prose-invert">
                <ReactMarkdown>{story}</ReactMarkdown>
              </div>
          </ScrollArea>
          </CardContent>
          <CardFooter className="gap-2">
          <Input 
            type="text" 
            id="theme" 
            className="w-[75%]" 
            value={value} 
            onChange={(e) => setValue(e.target.value)}
            placeholder="Enter a theme for the story (e.g. pollution, deforestation, etc.)"
          />
          <Button 
            onClick={generate} 
            className="w-[25%]"
            disabled={loading}
          >
            {loading ? (
            <>
              <svg
              className="mr-2 h-4 w-4 animate-spin"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
              </svg>
              Generating...
            </>
            ) : (
            "Generate"
            )}
          </Button>
          </CardFooter>
        </Card>
        <Card className="w-full max-w-[300px] h-[80vh] flex flex-col m-4 ">
          <CardHeader>
            <CardTitle>About</CardTitle>
            <CardDescription>This little web app generates bedtime stories for children in the style of 
              Alice in Wonderland. <br></br><br></br>The stories are all about climate change, and serve as a great way to raise awareness
              early on in a child's life. <br></br><br></br> GPT-3.5 Turbo was fine-tuned in order to achieve a similar style every time.
              <br></br><br></br>Finally, the user's location data is shared with the model to make the stories more relevant to the child geographically.
              <br></br><br></br>This project is Émilien Lavallée's submission for MariHacks 8.0
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    </main>
  );
}

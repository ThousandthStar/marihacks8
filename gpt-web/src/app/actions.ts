'use server';

import { ChatAnthropic } from "@langchain/anthropic";
import { ChatOpenAI } from "@langchain/openai";
import { PromptTemplate } from "@langchain/core/prompts";
import { headers } from "next/headers";
import { z } from "zod";

export async function getLocation() {
  const headersList = await headers();
  const ip = headersList.get("x-forwarded-for")?.split(",")[0] ?? "8.8.8.8";
  const res = await fetch(`https://ipapi.co/${ip}/json/`, { cache: "no-store" });
  const data = await res.json();

  return {
    country: data.country_name,
    region: data.region,
  };
}

export async function callGPT4Mini(topic: string) {
    console.log("Sending request")
    const model = new ChatOpenAI({
        modelName: 'ft:gpt-3.5-turbo-0125:personal:alice2:BIuIDWam',
        temperature: 0.7,
        apiKey: process.env.OPENAI_API_KEY, 
    });

    const prompt = new PromptTemplate({
        template: "Write a nice bedtime children's story in the style of Alice in Wonderland on this topic of climate change: {topic}. Make it fun and engaging for children. This child is currently living in {location}, so make it accurate for his reality. Make sure it is in the style of Alice in Wonderland",
        inputVariables: ["topic", "location"],
    });

    // Get location first
    const { country, region } = await getLocation();
    const location = `${country}, ${region}`;
    
    // Then generate the story
    //const schema = z.object({
    //    story: z.string().describe("The story"),
    //});
    const chain = prompt.pipe(model);
    const result = await chain.invoke({ topic, location });
    console.log(result);
    return result.content.toString().replace(/\n/g, "\n\n\n");
}
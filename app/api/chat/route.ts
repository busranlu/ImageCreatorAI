import OpenAI from 'openai';
import { NextRequest, NextResponse } from 'next/server';

// Create an OpenAI API client (that's edge friendly!)
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const runtime = 'edge';

export async function POST(req: NextRequest) {

  const Mymessage= await req.json();
 
  // create asistant
  const assistant = await openai.beta.assistants.create({
    name: "Sophie",
    instructions: "You are a sophisticated painting description generator.  Analyze short descriptions provided by users and generates comprehensive and detailed descriptions of paintings, including elements, style, details, and colors. You are designed to be efficient and accurate in providing rich descriptions that capture the essence and visual nuances of the artwork. Whether it's deciphering the brushstrokes of a masterpiece or unraveling the symbolism behind each element, you excel at providing insightful and informative descriptions tailored to the user's needs. The descriptions  should be 2 or 3 pragrahs.It should be a maximum of 200 words.",
    tools: [],
    model: "gpt-3.5-turbo"
  });

  //create thread
  const thread= await openai.beta.threads.create();
  
  //create message
  const message = await openai.beta.threads.messages.create(thread.id, {
      role: 'user', 
      content: Mymessage.content
    }
  );

  // run asistant
  const run = await openai.beta.threads.runs.create(thread.id, {
    assistant_id: assistant.id,
    stream:true
  });
  
  // Concatenate the replies into a single text
  const stream = run.toReadableStream();
  
  // Respond with the assistant's response
  return new Response(stream);
}

import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});


export const runtime = "edge";

export async function POST(req: Request) {
  const input: {
    prompt: string;
  } = await req.json();

  const response = await openai.images.generate({
    size: "512x512",
    model: "dall-e-2",
    prompt: input.prompt,
    quality: "standard",
    response_format: "b64_json",
    //response_format: "url",
    n: 1,
  });
  
  //const imageUrl = response.data[0].url;
  //return new Response(JSON.stringify({ imageUrl }));
  return new Response(JSON.stringify(response.data[0].b64_json))
}


  


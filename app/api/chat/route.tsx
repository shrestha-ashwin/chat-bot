import { OpenAI } from "openai";
import { NextResponse } from "next/server";

const openai = new OpenAI({ apiKey: process.env.OPEN_API_KEY });

export async function POST(req: Request) {
  console.log("it hit the POST route");
  const { messages } = await req.json();
  console.log(messages);

  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: messages,
    max_tokens: 200,
  });

  const response = completion.choices[0].message.content;
  const id = completion.id;

  console.log("left POST route");

  return NextResponse.json({ response, id }, { status: 200 });
}

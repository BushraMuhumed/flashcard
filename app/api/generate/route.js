import { NextResponse } from 'next/server';
// Assuming you have a Gemini client library or you can use a generic fetch function
import fetch from 'node-fetch';

const systemPrompt = `
You are a flashcard creator, you take in text and create multiple flashcards from it. Make sure to create exactly 10 flashcards.
Both front and back should be one sentence long.
You should return in the following JSON format:
{
  "flashcards":[
    {
      "front": "Front of the card",
      "back": "Back of the card"
    }
  ]
}
`;

export async function POST(req) {
  const apiKey = process.env.GEMINI_API_KEY; // Use the Gemini API key
  const data = await req.text();

  const response = await fetch('https://api.gemini.com/v1/endpoint', { // Replace with the correct Gemini endpoint
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`, // Use Bearer token authentication
    },
    body: JSON.stringify({
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: data },
      ],
      model: 'Gemini Pro', // Adjust if using a different model
      response_format: 'json', // Ensure the response is in JSON format
    }),
  });

  const completion = await response.json();

  // Assuming the response structure from Gemini API is similar
  const flashcards = completion.flashcards || [];

  // Return the flashcards as a JSON response
  return NextResponse.json(flashcards);
}

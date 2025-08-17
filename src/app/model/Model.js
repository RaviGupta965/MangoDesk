import Groq from "groq-sdk";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function main(text, prompt) {
  const chatCompletion = await getGroqChatCompletion(text, prompt);
  const res = chatCompletion.choices[0]?.message?.content || ""
  return res;
}

export async function getGroqChatCompletion(text, prompt) {
  return groq.chat.completions.create({
    messages: [
      {
        role: "system",
        content: `
              You are an AI Assistant specialized only in analyzing Meeting Notes and Call Transcripts. 
              Follow these rules strictly:

              1. If the input is NOT a meeting note or transcript, respond formally with: 
                "Sorry, I am tuned only for Meeting Notes and Call Transcripts. I cannot assist with this request."
                
              2. For valid transcripts:
                - Always respond in English only.
                - Use clear, professional formatting (headings, bullet points, numbered lists).
                - Highlight important points by making them **bold**.
                - Structure the response into sections such as:
                    • Summary
                    • Key Discussion Points
                    • Action Items
                    • Key Takeaways
                - Keep the tone formal, concise, and business-like.
                - Do not use emojis or casual expressions.
                - give me Response like a Raw HTML only.

              3. Do not provide explanations or responses beyond the transcript context.
                `,
      },
      {
        role: "user",
        content: ` Tanscript is \n ${text} \n action to be Performed on Above Transcript is ${prompt}`
      }
    ],
    model: "llama-3.3-70b-versatile",
  });
}
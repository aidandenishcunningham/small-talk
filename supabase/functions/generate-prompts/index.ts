type GeneratePromptRequest = {
  profile: {
    firstName?: string;
    tone?: "warm" | "playful" | "professional";
    comfortLevel?: number;
  };
  event: {
    contextKey: string;
    audienceSummary: string;
    goal: string;
    timeframeLabel?: string;
    contactName?: string;
    companyName?: string;
    publicContext?: string;
  };
};

Deno.serve(async (request) => {
  if (request.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  const apiKey = Deno.env.get("OPENAI_API_KEY");
  if (!apiKey) {
    return Response.json({ error: "Missing OPENAI_API_KEY" }, { status: 500 });
  }

  const body = (await request.json()) as GeneratePromptRequest;

  const systemPrompt = `
You create socially safe small-talk prompts for mobile users.
Return strict JSON with this shape:
{
  "prompts": [
    {
      "opener": "string",
      "followUp": "string",
      "whyItWorks": "string"
    }
  ],
  "notificationIdeas": ["string"]
}

Rules:
- Make prompts feel natural, specific, and kind.
- Avoid manipulative, invasive, or overly personal questions.
- Keep each opener under 24 words.
- Prefer curiosity over performance.
- If context is business or interview, stay polished and professional.
`.trim();

  const userPrompt = `
Profile:
- First name: ${body.profile.firstName ?? "Unknown"}
- Tone: ${body.profile.tone ?? "warm"}
- Comfort level: ${body.profile.comfortLevel ?? 5}/10

Event:
- Context: ${body.event.contextKey}
- Audience: ${body.event.audienceSummary}
- Goal: ${body.event.goal}
- Timeframe: ${body.event.timeframeLabel ?? "Not provided"}
- Contact name: ${body.event.contactName ?? "Not provided"}
- Company name: ${body.event.companyName ?? "Not provided"}
- Public context: ${body.event.publicContext ?? "Not provided"}

Generate 6 prompts and 3 notification ideas.
`.trim();

  const response = await fetch("https://api.openai.com/v1/responses", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "gpt-5-mini",
      input: [
        {
          role: "system",
          content: [{ type: "input_text", text: systemPrompt }],
        },
        {
          role: "user",
          content: [{ type: "input_text", text: userPrompt }],
        },
      ],
      text: {
        format: {
          type: "json_schema",
          name: "conversation_prompt_pack",
          strict: true,
          schema: {
            type: "object",
            additionalProperties: false,
            properties: {
              prompts: {
                type: "array",
                items: {
                  type: "object",
                  additionalProperties: false,
                  properties: {
                    opener: { type: "string" },
                    followUp: { type: "string" },
                    whyItWorks: { type: "string" },
                  },
                  required: ["opener", "followUp", "whyItWorks"],
                },
              },
              notificationIdeas: {
                type: "array",
                items: { type: "string" },
              },
            },
            required: ["prompts", "notificationIdeas"],
          },
        },
      },
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    return Response.json({ error: data }, { status: response.status });
  }

  return Response.json(data);
});

import { ConversationPrompt, EventInput, ProfileSignals } from "../types";

const promptBank = {
  networking: {
    defaultAudience: "other professionals you have not met before",
    openers: [
      "What kind of work has been keeping you busiest this quarter?",
      "What made you decide this event was worth coming to?",
      "What sort of projects are most exciting for you at the moment?",
      "What does a win look like for you this year?",
      "Is there a problem in your industry that nobody is talking about but should be?",
    ],
    followUps: [
      "How did you end up in that space?",
      "What are you noticing change in your industry right now?",
      "What kind of people are you hoping to meet here?",
      "What would you do differently if you were starting that from scratch?",
      "Who else do you think is doing interesting work in that area?",
    ],
  },
  birthday: {
    defaultAudience: "other parents waiting near the cake table",
    openers: [
      "How do you know the birthday family?",
      "What age are your kids at now?",
      "Have you survived many of these parties this year?",
      "What is your go-to trick for keeping kids entertained at home?",
      "What is the most surprising thing about the age your kids are at right now?",
    ],
    followUps: [
      "What are they into at the moment?",
      "Any local activities your family has actually loved lately?",
      "Do you have a go-to weekend plan when you need to burn off energy?",
      "Did your kids get into that themselves or did you nudge them into it?",
      "What is the thing you wish someone had told you earlier about that age?",
    ],
  },
  office: {
    defaultAudience: "colleagues you see often but do not know deeply",
    openers: [
      "What has your week looked like so far?",
      "Is there anything interesting your team is working on right now?",
      "Have you found any good routines for making the week feel less chaotic?",
      "What is the part of your job that surprises people most when you explain it?",
      "What would make this month feel like a proper win for you?",
    ],
    followUps: [
      "How did that land on your plate?",
      "Is that the kind of work you enjoy most?",
      "What would make this month feel like a win?",
      "How long have you been working in that area?",
      "What is the thing most people misunderstand about what your team does?",
    ],
  },
  gym: {
    defaultAudience: "people sharing a class, sporting sideline, or training space",
    openers: [
      "Have you been coming here long?",
      "What got you into this class or sport in the first place?",
      "Do you usually do this for fun, fitness, or a bit of both?",
      "What is your favourite thing about this session or routine?",
      "Have you tried anything else here that you would recommend?",
    ],
    followUps: [
      "Have you found any sessions here that are actually enjoyable?",
      "What keeps you consistent with it?",
      "Did someone get you into it or did you discover it yourself?",
      "How long did it take before it stopped feeling hard?",
      "What would you tell someone who is just starting out?",
    ],
  },
  wedding: {
    defaultAudience: "guests who may only know the couple through a different part of their life",
    openers: [
      "How do you know the couple?",
      "Have you known them for long?",
      "What is your favourite story about them as a pair?",
      "Did you travel far for today?",
      "What do you make of the venue — have you been here before?",
    ],
    followUps: [
      "Did you travel far for the wedding?",
      "Which side of the friendship tree are you on?",
      "What kind of events do you actually enjoy going to these days?",
      "What is the most memorable wedding you have ever been to?",
      "Do you find these things easy or do you need to warm up first?",
    ],
  },
  interview: {
    defaultAudience: "an interviewer or hiring manager you are meeting for the first time",
    openers: [
      "How has your day been going so far?",
      "I was curious what you enjoy most about working here at the moment.",
      "What tends to make conversations like this especially useful for you?",
      "What does the team look like right now — is it growing or consolidating?",
      "What is the thing about this company that does not come across in the job description?",
    ],
    followUps: [
      "How has the team changed recently?",
      "What kinds of people tend to do well here long term?",
      "What are you most focused on in the role over the next six months?",
      "What made you decide to stay here as long as you have?",
      "What is the thing you wish you had known before joining?",
    ],
  },
};

const randomQuestionPool = [
  "If you could swap jobs with anyone in this room for a week, who would you pick?",
  "What is something you changed your mind about in the last year?",
  "What is the best piece of advice you have actually acted on?",
  "What skill are you quietly working on right now?",
  "What is a topic you could talk about for twenty minutes without preparing?",
  "What is the most interesting thing you have learned recently?",
  "What is something most people assume about you that is wrong?",
  "What would you be doing today if you had taken a completely different path?",
  "What is the last thing that genuinely surprised you?",
  "What do you think is underrated that more people should try?",
  "What is a habit you have picked up that has actually stuck?",
  "If you had a free Saturday with no obligations, how would you spend it?",
  "What is something you do well that you rarely get to use at work?",
  "What question do you wish people asked you more often?",
  "What is the best conversation you have had in the last month?",
];

function shuffle<T>(arr: T[]): T[] {
  const out = [...arr];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

function buildWhyItWorks(profile: ProfileSignals, audienceSummary: string, goal: string) {
  const toneHint =
    profile.tone === "professional"
      ? "It sounds thoughtful and polished."
      : profile.tone === "playful"
        ? "It feels light without being throwaway."
        : "It lands as warm and approachable.";

  return `${toneHint} It invites the other person to talk about themselves, which lowers pressure. It also matches your goal: ${goal.toLowerCase()} with ${audienceSummary.toLowerCase()}.`;
}

function personalizeOpener(
  opener: string,
  contextKey: string,
  profile: ProfileSignals
): string {
  if (contextKey === "birthday" && profile.likesChildrenTopics) {
    return `${opener} I always like hearing what stage everyone is in with their kids.`;
  }
  if (contextKey === "networking" && profile.enjoysWorkTopics) {
    return `${opener} I find those answers way more interesting than the usual job-title exchange.`;
  }
  if (contextKey === "office" && profile.enjoysWorkTopics) {
    return `${opener} I like knowing what people are actually spending their energy on.`;
  }
  if (contextKey === "gym" && profile.tone === "playful") {
    return `${opener} No wrong answer — I'm just trying to look like I know what I'm doing.`;
  }
  if (contextKey === "wedding" && profile.tone === "warm") {
    return `${opener} I love hearing how different people ended up in the same place.`;
  }
  if (contextKey === "interview" && profile.tone === "professional") {
    return `${opener} I always find those early impressions really useful.`;
  }
  return opener;
}

export function generatePrompts(profile: ProfileSignals, event: EventInput): ConversationPrompt[] {
  const preset = promptBank[event.contextKey];
  const audienceSummary = event.audienceSummary || preset.defaultAudience;

  const openers = shuffle(preset.openers).slice(0, 3);
  const followUps = shuffle(preset.followUps);

  return openers.map((opener, index) => {
    const followUp = followUps[index % followUps.length];
    const personalizedOpener = personalizeOpener(opener, event.contextKey, profile);

    return {
      id: `${event.contextKey}-${Date.now()}-${index}`,
      opener: personalizedOpener,
      followUp,
      whyItWorks: buildWhyItWorks(profile, audienceSummary, event.goal),
      premium: event.contextKey === "networking" || event.contextKey === "interview",
    };
  });
}

export function buildNotificationIdeas(event: EventInput): string[] {
  const audience = event.audienceSummary.trim().toLowerCase() || "the other person";
  const goal = event.goal.trim().toLowerCase() || "keeping the conversation moving";

  return [
    `Arriving soon: ask one easy question about ${audience}.`,
    `Mid-event reset: go with curiosity, not performance. Ask what has been most interesting for them lately.`,
    `If the conversation stalls, try a follow-up connected to ${goal}.`,
  ];
}

export function getRandomQuestion(): string {
  return randomQuestionPool[Math.floor(Math.random() * randomQuestionPool.length)];
}

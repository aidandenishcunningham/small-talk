import { ConversationPrompt, EventInput, ProfileSignals } from "../types";

const promptBank = {
  networking: {
    defaultAudience: "other professionals you have not met before",
    openers: [
      "What kind of work has been keeping you busiest this quarter?",
      "What made you decide this event was worth coming to?",
      "What sort of projects are most exciting for you at the moment?",
    ],
    followUps: [
      "How did you end up in that space?",
      "What are you noticing change in your industry right now?",
      "What kind of people are you hoping to meet here?",
    ],
  },
  birthday: {
    defaultAudience: "other parents waiting near the cake table",
    openers: [
      "How do you know the birthday family?",
      "What age are your kids at now?",
      "Have you survived many of these parties this year?",
    ],
    followUps: [
      "What are they into at the moment?",
      "Any local activities your family has actually loved lately?",
      "Do you have a go-to weekend plan when you need to burn off energy?",
    ],
  },
  office: {
    defaultAudience: "colleagues you see often but do not know deeply",
    openers: [
      "What has your week looked like so far?",
      "Is there anything interesting your team is working on right now?",
      "Have you found any good routines for making the week feel less chaotic?",
    ],
    followUps: [
      "How did that land on your plate?",
      "Is that the kind of work you enjoy most?",
      "What would make this month feel like a win?",
    ],
  },
  gym: {
    defaultAudience: "people sharing a class, sporting sideline, or training space",
    openers: [
      "Have you been coming here long?",
      "What got you into this class or sport in the first place?",
      "Do you usually do this for fun, fitness, or a bit of both?",
    ],
    followUps: [
      "Have you found any sessions here that are actually enjoyable?",
      "What keeps you consistent with it?",
      "Did someone get you into it or did you discover it yourself?",
    ],
  },
  wedding: {
    defaultAudience: "guests who may only know the couple through a different part of their life",
    openers: [
      "How do you know the couple?",
      "Have you known them for long?",
      "What is your favorite story about them as a pair?",
    ],
    followUps: [
      "Did you travel far for the wedding?",
      "Which side of the friendship tree are you on?",
      "What kind of events do you actually enjoy going to these days?",
    ],
  },
  interview: {
    defaultAudience: "an interviewer or hiring manager you are meeting for the first time",
    openers: [
      "How has your day been going so far?",
      "I was curious what you enjoy most about working here at the moment.",
      "What tends to make conversations like this especially useful for you?",
    ],
    followUps: [
      "How has the team changed recently?",
      "What kinds of people tend to do well here long term?",
      "What are you most focused on in the role over the next six months?",
    ],
  },
};

function buildWhyItWorks(profile: ProfileSignals, audienceSummary: string, goal: string) {
  const toneHint =
    profile.tone === "professional"
      ? "It sounds thoughtful and polished."
      : profile.tone === "playful"
        ? "It feels light without being throwaway."
        : "It lands as warm and approachable.";

  return `${toneHint} It invites the other person to talk about themselves, which lowers pressure. It also matches your goal: ${goal.toLowerCase()} with ${audienceSummary.toLowerCase()}.`;
}

export function generatePrompts(profile: ProfileSignals, event: EventInput): ConversationPrompt[] {
  const preset = promptBank[event.contextKey];
  const audienceSummary = event.audienceSummary || preset.defaultAudience;

  return preset.openers.map((opener, index) => {
    const followUp = preset.followUps[index % preset.followUps.length];

    const personalizedOpener =
      event.contextKey === "birthday" && profile.likesChildrenTopics
        ? `${opener} I always like hearing what stage everyone is in with their kids.`
        : event.contextKey === "networking" && profile.enjoysWorkTopics
          ? `${opener} I find those answers way more interesting than the usual job-title exchange.`
          : opener;

    return {
      id: `${event.contextKey}-${index + 1}`,
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

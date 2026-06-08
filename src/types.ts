export type ContextKey =
  | "networking"
  | "birthday"
  | "office"
  | "gym"
  | "wedding"
  | "interview";

export type ConversationContext = {
  key: ContextKey;
  label: string;
  emoji: string;
  description: string;
  energy: "gentle" | "curious" | "professional";
};

export type ProfileSignals = {
  name: string;
  comfortLevel: number;
  tone: "warm" | "playful" | "professional";
  likesChildrenTopics: boolean;
  enjoysWorkTopics: boolean;
};

export type EventInput = {
  contextKey: ContextKey;
  audienceSummary: string;
  goal: string;
  timeframeLabel: string;
};

export type ConversationPrompt = {
  id: string;
  opener: string;
  followUp: string;
  whyItWorks: string;
  premium?: boolean;
};

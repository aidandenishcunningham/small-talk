import { ConversationContext } from "../types";

export const socialContexts: ConversationContext[] = [
  {
    key: "networking",
    label: "Business Networking",
    emoji: "B",
    description: "Thoughtful openers for conferences, meetups, and new-business chats.",
    energy: "professional",
  },
  {
    key: "birthday",
    label: "Kids' Birthday Party",
    emoji: "P",
    description: "Low-pressure prompts for chatting with other parents while the kids run wild.",
    energy: "gentle",
  },
  {
    key: "office",
    label: "Office Chit-Chat",
    emoji: "O",
    description: "Natural prompts for colleagues you know a little but not deeply.",
    energy: "professional",
  },
  {
    key: "gym",
    label: "Gym or Sports Event",
    emoji: "G",
    description: "Casual openers that feel relaxed instead of forced.",
    energy: "curious",
  },
  {
    key: "wedding",
    label: "Wedding or Social Event",
    emoji: "W",
    description: "Friendly ways into conversation with strangers at shared tables.",
    energy: "gentle",
  },
  {
    key: "interview",
    label: "Interview Prep",
    emoji: "I",
    description: "Professional openers for those first few minutes before the formal questions start.",
    energy: "professional",
  },
];

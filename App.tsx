import { StatusBar } from "expo-status-bar";
import { useState } from "react";
import {
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  View,
} from "react-native";
import { socialContexts } from "./src/data/socialContexts";
import {
  buildNotificationIdeas,
  generatePrompts,
  getRandomQuestion,
} from "./src/lib/promptEngine";
import {
  ContextKey,
  ConversationPrompt,
  EventInput,
  ProfileSignals,
} from "./src/types";

const initialProfile: ProfileSignals = {
  name: "Aidan",
  comfortLevel: 4,
  tone: "warm",
  likesChildrenTopics: true,
  enjoysWorkTopics: true,
};

const initialEvent: EventInput = {
  contextKey: "birthday",
  audienceSummary: "parents of school-aged children",
  goal: "start conversations that feel natural",
  timeframeLabel: "2:00 PM to 4:00 PM",
};

export default function App() {
  const [profile, setProfile] = useState(initialProfile);
  const [eventInput, setEventInput] = useState(initialEvent);
  const [prompts, setPrompts] = useState<ConversationPrompt[]>(() =>
    generatePrompts(initialProfile, initialEvent),
  );
  const [notificationIdeas, setNotificationIdeas] = useState<string[]>(() =>
    buildNotificationIdeas(initialEvent),
  );
  const [randomQuestion, setRandomQuestion] = useState<string>(() =>
    getRandomQuestion(),
  );

  function regeneratePrompts(
    nextEvent: EventInput = eventInput,
    nextProfile: ProfileSignals = profile,
  ) {
    setPrompts(generatePrompts(nextProfile, nextEvent));
    setNotificationIdeas(buildNotificationIdeas(nextEvent));
  }

  function selectContext(contextKey: ContextKey) {
    const nextEvent = { ...eventInput, contextKey };
    setEventInput(nextEvent);
    regeneratePrompts(nextEvent, profile);
  }

  const comfortLabels = ["Very shy", "Shy", "Neutral", "Comfortable", "Very comfortable"];

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="dark" />
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.hero}>
          <Text style={styles.eyebrow}>Small Talk</Text>
          <Text style={styles.title}>AI help for awkward social moments.</Text>
          <Text style={styles.subtitle}>
            Build confidence before the event, get context-aware prompts during it, and keep the
            conversation feeling human.
          </Text>
        </View>

        {/* Random Question Generator */}
        <View style={styles.randomCard}>
          <Text style={styles.randomEyebrow}>Random Question</Text>
          <Text style={styles.randomQuestion}>{randomQuestion}</Text>
          <Pressable
            style={styles.randomButton}
            onPress={() => setRandomQuestion(getRandomQuestion())}
          >
            <Text style={styles.randomButtonText}>New question</Text>
          </Pressable>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Your style</Text>
          <TextInput
            value={profile.name}
            onChangeText={(name) => {
              const nextProfile = { ...profile, name };
              setProfile(nextProfile);
              regeneratePrompts(eventInput, nextProfile);
            }}
            placeholder="Your name"
            placeholderTextColor="#8a7e70"
            style={styles.input}
          />

          <Text style={styles.miniLabel}>Conversation tone</Text>
          <View style={styles.pillRow}>
            {(["warm", "playful", "professional"] as ProfileSignals["tone"][]).map((tone) => (
              <Pressable
                key={tone}
                onPress={() => {
                  const nextProfile = { ...profile, tone };
                  setProfile(nextProfile);
                  regeneratePrompts(eventInput, nextProfile);
                }}
                style={[styles.pill, profile.tone === tone && styles.pillActive]}
              >
                <Text style={[styles.pillText, profile.tone === tone && styles.pillTextActive]}>
                  {tone}
                </Text>
              </Pressable>
            ))}
          </View>

          <Text style={styles.miniLabel}>
            Comfort level — {comfortLabels[(profile.comfortLevel ?? 3) - 1]}
          </Text>
          <View style={styles.comfortRow}>
            {[1, 2, 3, 4, 5].map((level) => (
              <Pressable
                key={level}
                onPress={() => {
                  const nextProfile = { ...profile, comfortLevel: level };
                  setProfile(nextProfile);
                  regeneratePrompts(eventInput, nextProfile);
                }}
                style={[
                  styles.comfortDot,
                  profile.comfortLevel >= level && styles.comfortDotActive,
                ]}
              />
            ))}
          </View>

          <View style={styles.switchRow}>
            <Text style={styles.switchLabel}>Lean into parent-chat prompts</Text>
            <Switch
              value={profile.likesChildrenTopics}
              onValueChange={(likesChildrenTopics) => {
                const nextProfile = { ...profile, likesChildrenTopics };
                setProfile(nextProfile);
                regeneratePrompts(eventInput, nextProfile);
              }}
            />
          </View>
          <View style={styles.switchRow}>
            <Text style={styles.switchLabel}>Lean into work-topic prompts</Text>
            <Switch
              value={profile.enjoysWorkTopics}
              onValueChange={(enjoysWorkTopics) => {
                const nextProfile = { ...profile, enjoysWorkTopics };
                setProfile(nextProfile);
                regeneratePrompts(eventInput, nextProfile);
              }}
            />
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Choose the setting</Text>
          <View style={styles.contextGrid}>
            {socialContexts.map((context) => (
              <Pressable
                key={context.key}
                onPress={() => selectContext(context.key)}
                style={[
                  styles.contextCard,
                  eventInput.contextKey === context.key && styles.contextCardActive,
                ]}
              >
                <Text style={styles.contextEmoji}>{context.emoji}</Text>
                <Text style={styles.contextTitle}>{context.label}</Text>
                <Text style={styles.contextDescription}>{context.description}</Text>
              </Pressable>
            ))}
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Event details</Text>
          <TextInput
            value={eventInput.audienceSummary}
            onChangeText={(audienceSummary) => {
              const nextEvent = { ...eventInput, audienceSummary };
              setEventInput(nextEvent);
              regeneratePrompts(nextEvent, profile);
            }}
            placeholder="Who will you be talking to?"
            placeholderTextColor="#8a7e70"
            style={styles.input}
          />
          <TextInput
            value={eventInput.goal}
            onChangeText={(goal) => {
              const nextEvent = { ...eventInput, goal };
              setEventInput(nextEvent);
              regeneratePrompts(nextEvent, profile);
            }}
            placeholder="What do you want help with?"
            placeholderTextColor="#8a7e70"
            style={styles.input}
          />
          <TextInput
            value={eventInput.timeframeLabel}
            onChangeText={(timeframeLabel) => {
              const nextEvent = { ...eventInput, timeframeLabel };
              setEventInput(nextEvent);
              regeneratePrompts(nextEvent, profile);
            }}
            placeholder="When is the event?"
            placeholderTextColor="#8a7e70"
            style={styles.input}
          />
        </View>

        <View style={styles.card}>
          <View style={styles.rowBetween}>
            <Text style={styles.sectionTitle}>Prompt pack</Text>
            <Pressable style={styles.generateButton} onPress={() => regeneratePrompts()}>
              <Text style={styles.generateButtonText}>Refresh</Text>
            </Pressable>
          </View>
          {prompts.map((prompt) => (
            <View key={prompt.id} style={styles.promptCard}>
              <View style={styles.rowBetween}>
                <Text style={styles.promptLabel}>
                  {prompt.premium ? "Premium-ready" : "Prompt"}
                </Text>
                <Text style={styles.promptBadge}>{eventInput.contextKey}</Text>
              </View>
              <Text style={styles.promptOpener}>{prompt.opener}</Text>
              <Text style={styles.promptFollowUp}>Follow-up: {prompt.followUp}</Text>
              <Text style={styles.promptWhy}>{prompt.whyItWorks}</Text>
            </View>
          ))}
        </View>

        <View style={[styles.card, styles.notificationCard]}>
          <Text style={styles.sectionTitle}>Event-time nudges</Text>
          <Text style={styles.notificationWindow}>Window: {eventInput.timeframeLabel}</Text>
          {notificationIdeas.map((idea) => (
            <View key={idea} style={styles.notificationBubble}>
              <Text style={styles.notificationText}>{idea}</Text>
            </View>
          ))}
        </View>

        <View style={[styles.card, styles.premiumCard]}>
          <Text style={styles.premiumEyebrow}>Premium direction</Text>
          <Text style={styles.premiumTitle}>Interview and networking prep</Text>
          <Text style={styles.premiumCopy}>
            Add a company name, a public profile link, or a meeting goal and generate tailored
            talking points, safe industry themes, and first-five-minute conversation ideas.
          </Text>
          <View style={styles.premiumInputGroup}>
            <TextInput
              placeholder="Company or organisation name"
              placeholderTextColor="#7a9e99"
              style={styles.premiumInput}
            />
            <TextInput
              placeholder="Their LinkedIn or profile URL"
              placeholderTextColor="#7a9e99"
              style={styles.premiumInput}
            />
            <TextInput
              placeholder="Your meeting goal"
              placeholderTextColor="#7a9e99"
              style={styles.premiumInput}
            />
          </View>
          <Pressable style={styles.premiumButton}>
            <Text style={styles.premiumButtonText}>Generate tailored pack</Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#f5efe6",
  },
  container: {
    paddingHorizontal: 18,
    paddingBottom: 36,
    gap: 16,
  },
  hero: {
    backgroundColor: "#183a37",
    borderRadius: 28,
    padding: 24,
    marginTop: 12,
  },
  eyebrow: {
    color: "#f3c969",
    fontSize: 13,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 1.1,
    marginBottom: 10,
  },
  title: {
    color: "#fffaf2",
    fontSize: 34,
    lineHeight: 38,
    fontWeight: "800",
    marginBottom: 10,
  },
  subtitle: {
    color: "#d6e3df",
    fontSize: 16,
    lineHeight: 23,
  },
  randomCard: {
    backgroundColor: "#f3c969",
    borderRadius: 24,
    padding: 20,
  },
  randomEyebrow: {
    color: "#6b4e00",
    fontSize: 12,
    fontWeight: "800",
    textTransform: "uppercase",
    letterSpacing: 0.8,
    marginBottom: 10,
  },
  randomQuestion: {
    color: "#2f2a25",
    fontSize: 20,
    fontWeight: "800",
    lineHeight: 27,
    marginBottom: 16,
  },
  randomButton: {
    alignSelf: "flex-start",
    backgroundColor: "#183a37",
    borderRadius: 999,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  randomButtonText: {
    color: "#fff8ee",
    fontWeight: "700",
    fontSize: 14,
  },
  card: {
    backgroundColor: "#fffaf2",
    borderRadius: 24,
    padding: 18,
    shadowColor: "#6b5b48",
    shadowOpacity: 0.09,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
    elevation: 3,
  },
  sectionTitle: {
    color: "#183a37",
    fontSize: 20,
    fontWeight: "800",
    marginBottom: 12,
  },
  miniLabel: {
    color: "#5d5348",
    fontSize: 13,
    fontWeight: "700",
    textTransform: "uppercase",
    marginBottom: 10,
  },
  input: {
    backgroundColor: "#f6eee4",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#eadfce",
    paddingHorizontal: 14,
    paddingVertical: 14,
    fontSize: 16,
    color: "#2f2a25",
    marginBottom: 12,
  },
  pillRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginBottom: 16,
  },
  pill: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 999,
    backgroundColor: "#f6eee4",
  },
  pillActive: {
    backgroundColor: "#183a37",
  },
  pillText: {
    color: "#5d5348",
    fontWeight: "700",
    textTransform: "capitalize",
  },
  pillTextActive: {
    color: "#fff8ee",
  },
  comfortRow: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 16,
  },
  comfortDot: {
    width: 36,
    height: 36,
    borderRadius: 999,
    backgroundColor: "#f6eee4",
    borderWidth: 1,
    borderColor: "#eadfce",
  },
  comfortDotActive: {
    backgroundColor: "#183a37",
    borderColor: "#183a37",
  },
  switchRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
    gap: 12,
  },
  switchLabel: {
    flex: 1,
    color: "#2f2a25",
    fontSize: 15,
    lineHeight: 20,
  },
  contextGrid: {
    gap: 10,
  },
  contextCard: {
    backgroundColor: "#f6eee4",
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: "#eadfce",
  },
  contextCardActive: {
    borderColor: "#183a37",
    backgroundColor: "#e6f0ee",
  },
  contextEmoji: {
    fontSize: 22,
    marginBottom: 8,
  },
  contextTitle: {
    color: "#183a37",
    fontSize: 16,
    fontWeight: "800",
    marginBottom: 4,
  },
  contextDescription: {
    color: "#5d5348",
    fontSize: 14,
    lineHeight: 20,
  },
  rowBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 12,
  },
  generateButton: {
    backgroundColor: "#183a37",
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  generateButtonText: {
    color: "#fff8ee",
    fontWeight: "700",
  },
  promptCard: {
    backgroundColor: "#f6eee4",
    borderRadius: 18,
    padding: 16,
    marginTop: 10,
  },
  promptLabel: {
    color: "#b86f52",
    fontSize: 12,
    fontWeight: "800",
    textTransform: "uppercase",
    letterSpacing: 0.6,
  },
  promptBadge: {
    color: "#5d5348",
    fontSize: 12,
    textTransform: "capitalize",
  },
  promptOpener: {
    color: "#183a37",
    fontSize: 18,
    lineHeight: 24,
    fontWeight: "800",
    marginTop: 10,
    marginBottom: 8,
  },
  promptFollowUp: {
    color: "#2f2a25",
    fontSize: 15,
    lineHeight: 22,
    marginBottom: 8,
  },
  promptWhy: {
    color: "#6c6256",
    fontSize: 14,
    lineHeight: 20,
  },
  notificationCard: {
    backgroundColor: "#efe2d0",
  },
  notificationWindow: {
    color: "#5d5348",
    fontSize: 14,
    marginBottom: 12,
  },
  notificationBubble: {
    backgroundColor: "#fffaf2",
    borderRadius: 16,
    padding: 14,
    marginTop: 8,
  },
  notificationText: {
    color: "#2f2a25",
    fontSize: 15,
    lineHeight: 22,
  },
  premiumCard: {
    backgroundColor: "#183a37",
  },
  premiumEyebrow: {
    color: "#f3c969",
    fontSize: 12,
    fontWeight: "800",
    textTransform: "uppercase",
    letterSpacing: 0.8,
    marginBottom: 8,
  },
  premiumTitle: {
    color: "#fffaf2",
    fontSize: 24,
    fontWeight: "800",
    marginBottom: 8,
  },
  premiumCopy: {
    color: "#d6e3df",
    fontSize: 15,
    lineHeight: 22,
    marginBottom: 16,
  },
  premiumInputGroup: {
    gap: 10,
    marginBottom: 14,
  },
  premiumInput: {
    backgroundColor: "#1f4a46",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#2e6660",
    paddingHorizontal: 14,
    paddingVertical: 13,
    fontSize: 15,
    color: "#fffaf2",
  },
  premiumButton: {
    backgroundColor: "#f3c969",
    borderRadius: 999,
    paddingVertical: 14,
    alignItems: "center",
  },
  premiumButtonText: {
    color: "#2f2a25",
    fontWeight: "800",
    fontSize: 15,
  },
});

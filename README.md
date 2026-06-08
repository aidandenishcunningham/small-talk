# Small Talk

An AI-assisted mobile app concept for helping people through awkward social moments with prompts that feel contextual instead of generic.

## What this repo includes

- An Expo/React Native MVP app shell
- A guided prompt experience for different social settings
- A local "prompt engine" so the UI works before a real AI backend is wired up
- A Supabase Edge Function example for secure server-side AI generation
- A starter database schema and a practical launch roadmap

## Recommended stack

- Mobile app: Expo + React Native + TypeScript
- Backend: Supabase Auth, Postgres, Edge Functions
- AI: OpenAI Responses API called from the backend
- Notifications: `expo-notifications`
- Payments: RevenueCat for free vs paid plans

This stack is a good fit for a first launch because it keeps the app mobile-first, reduces custom backend work, and leaves room for premium features later.

## MVP product shape

### Free

- Quick prompt packs for everyday settings
- Event setup with a few clarifying questions
- Save favorite prompts
- Local scheduled nudges for an event window

### Paid

- Deeper contextual prompt generation
- Interview and business networking modes
- More personalized coaching
- Contact research briefs generated from user-provided public profile links
- Saved conversation plans and post-event reflection

## Important product note

For the "look up a person on LinkedIn" idea, do not assume broad profile-search access will be available through LinkedIn's API. For MVP, the safer route is:

1. Let the user paste a public profile URL or company URL they already have.
2. Generate conversation prep from user-provided details and public company context.
3. Treat richer professional data integrations as a later compliance project.

## Run locally

1. Install dependencies:

```bash
npm install
```

2. Start Expo:

```bash
npm run start
```

3. Open on iPhone, Android, simulator, or web through Expo.

## Next build steps

1. Connect the app to Supabase Auth and database tables in `supabase/schema.sql`.
2. Deploy the Edge Function in `supabase/functions/generate-prompts`.
3. Add real notification scheduling.
4. Add RevenueCat and a paywall.
5. Submit iOS TestFlight and Android internal testing builds.

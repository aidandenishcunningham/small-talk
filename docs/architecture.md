# Product Blueprint

## Core user problem

People often know how they want to show up socially, but freeze in the first thirty seconds of conversation. The app reduces blank-page anxiety by giving:

- context-aware opening prompts
- natural follow-up questions
- gentle event-time nudges
- lightweight coaching that makes the user sound human rather than scripted

## Primary user flows

### 1. Quick help

- User opens the app
- Chooses a setting like `Networking`, `Birthday Party`, `Office`, or `Interview`
- Answers a few short questions
- Gets 5-8 prompt ideas with follow-ups

### 2. Event mode

- User creates an event window
- Sets start and end time
- Chooses how frequently they want nudges
- Receives prompts during the event

### 3. Premium prep

- User chooses `Business` or `Interview`
- Adds a person name, company, and optional public links
- AI produces a short prep brief:
  - safe talking points
  - recent company themes
  - relevant industry topics
  - thoughtful follow-up angles

## Suggested information architecture

- Home
- Event Setup
- Prompt Feed
- Learn
- Premium

## Data model

### `profiles`

- id
- first_name
- conversation_style
- comfort_level
- interests
- parenting_stage
- work_role
- subscription_tier

### `event_sessions`

- id
- profile_id
- context_key
- title
- start_at
- end_at
- tone
- audience_summary
- prompt_count

### `generated_prompts`

- id
- event_session_id
- prompt_text
- follow_up_text
- rationale
- source_type

### `saved_prompts`

- id
- profile_id
- generated_prompt_id

## Delivery plan

### Phase 1

- Manual onboarding
- Prompt generation
- Local notifications
- Favorites
- Premium paywall stub

### Phase 2

- Auth
- Cloud sync
- Learn content
- Post-event reflection

### Phase 3

- Company/news research
- Wearable-friendly cards
- A/B testing on prompt quality
- richer personalization

## Risk notes

- Avoid making the user sound manipulative or over-rehearsed.
- Keep prompts socially safe and low-pressure.
- Do not claim certainty about another person's interests.
- LinkedIn and people-data integrations need careful permission and compliance handling.

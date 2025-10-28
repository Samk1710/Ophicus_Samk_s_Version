🌌 Ophiuchus: The 13th Zodiac of Songs

“Written in the stars. Heard in your soul.”

🎮 Game Concept Summary

Ophiuchus is a single-player, celestial-themed musical quest powered by the user’s Spotify data. The player embarks on a journey through 5 cosmic rooms, each designed to test their intuition, memory, and emotional understanding of music they already love. Clues from each room help the player uncover their hidden “Cosmic Song” — a main track secretly chosen from their listening history.

🌠 Game Flow
1. Login & Initiation: The Big Bang

User logs in via Spotify.

LLM chooses 1 “Cosmic Song” from their data (e.g., You Belong With Me – Taylor Swift).

A poetic, one-liner clue is shown:

"She stood on the bleachers while love climbed rooftops without her."

User is transported to the Astral Nexus, a celestial map of 5 glowing planets (rooms).

🪐 Room Overview

The player can explore five rooms in any order. Each room provides a unique clue — lyrical, emotional, visual, or logical — to help them guess the Cosmic Song.

1. 🌫️ Nebula — Riddle of Echoes

Tagline: “Where whispers shape your stars.”

A poetic riddle is generated about an intermediary song from user data.

Sunsetz – Cigarettes After Sex

🧩 Example Riddle:

You talk to her in languages I’ve memorized,
but she never reads between your lines.
I wear comfort like a second skin,
while she walks in heels you’ll never fit in.
You call it friendship —
but I’ve been screaming quietly:
You were always meant for me.

Which song am I, written in the margins of a love that never looked up?

3 guesses allowed.

Correct guess = reward: poetic riddle of the Cosmic Song.

Failure = misleading lyric clue.

2. 🌍 Cradle — The Veiled Origin

Tagline: “What was born of Earth must be uncovered in shadow.”

Player receives a poetic identity clue about the main artist:

“She writes with glitter and burns with folklore. She was once 15, and now she haunts her own eras.”

Unlimited Gandalf-style questions to guess the artist.

LLM never reveals artist directly but will respond with:

“They have 12 Grammys.”

“They began in country music.”

“Yes, she’s collaborated with Bon Iver.”

When confident, the player enters a guess for the artist.

3. ☄️ Comet — Flash of the Past

Tagline: “Catch the lyric before it burns out.”

A lyric from another intermediary song flashes across screen for 10 seconds.

“I still remember, third of December.”
(Heather – Conan Gray)

Correct guess = reward: lyric from the main song.

Failure = comet fades, no reward.

4. 🌖 Aurora — The Voice of Light

Tagline: “Feel the emotion. Find the harmony.”

Gemini API generates an emotional audio vignette (no emotion is mentioned).

Ex: A girl bashfully narrates how someone remembered her favorite song on a late night drive.

Player suggests a song matching the vibe.

“Enchanted” – Taylor Swift

LLM scores it 1–10:

7+ = grant a mood-aligned clue for the main song.

<7 = no reward.

5. 🌌 Nova — The Reverb of Memory

Tagline: “Only memory can unlock the cosmic hum.”

A personal memory round with 5 Spotify-based questions:

🎧 Sample Questions:

Which artist have you streamed the most recently?

What genre dominated your past week’s listening?

What time of day do you usually play music?

Complete the lyric: “I remember you driving to my house in the ___.”

Which of these was NOT in your recently played songs?

Scoring:

5 correct = humming or muffled chorus of main song

4 correct = fragmented reversed audio

3 correct = encrypted lyric

<3 = genre hint or mood cue only

🌟 Final Phase: Ascension of the Song

After visiting at least 3 rooms, user unlocks the Final Portal.

Can submit 2 guesses for their Cosmic Song.

✅ Correct Guess:

Ascension animation plays.

A custom Ophiuchus Zodiac Identity is generated:

“Ophiuchus of the Quiet Chorus — a soul born of friendship’s echo, craving visibility through melody.”

Shareable NFT-style badge generated.

❌ Wrong Guess:

Retry allowed. If failed twice:

“The constellations remain silent. Return when the sky aligns once more.”

🔧 Tech Backbone
Layer	Tech
Frontend	Next.js + Tailwind + Framer Motion
Backend	Node.js / Elixir
AI Layer	GPT-4o / Gemini for riddles, scoring
Audio	Gemini TTS or Google Cloud Voice
Spotify	OAuth + Web API
DB	MongoDB / Firestore
NFT/Badge (optional)	IPFS + Polygon
🧭 Thematic Aesthetic

Aurora Borealis palette (lavender, teal, indigo, rose)

Celestial UI with glowing rings, soft star motion, zodiac glyphs

Elegant typography:

Headings: “Cormorant Garamond”, “Cinzel”

Body: “Inter”, “Poppins”

Glassmorphic card elements, constellation-hover effects, space music ambiance

🔄 Replayability

Every run features a new Cosmic Song from the user’s top data.

Room clues evolve per song + emotional model.

Additional features can include:

Weekly Zodiac challenges

Multiplayer duels: “Guess Your Friend’s Song”

Unlockable achievements like “The Riddler” or “Melancholy Voyager”
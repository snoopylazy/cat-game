# Cat vs Cat — Sound Battle

A microphone-powered fighting game. **Shout louder than the enemy cat** to push
the clash meter into their side and drain their HP. Beat all **17 levels** and
unlock skins with the coins you earn.

No dependencies. No build step. Pure HTML + CSS + JS.

---

## How to run

The microphone **only works on a secure page**, so `file://` (double-clicking)
usually won't work. Run a tiny local server instead:

```bash
cd cat-vs-cat
python3 -m http.server 8000
```

Then open **http://localhost:8000** in Chrome/Edge/Safari and allow microphone access.

> To play on your phone, use your computer's LAN IP, e.g. `http://192.168.x.x:8000`
> (mic works there too as long as it's `localhost` or `https`).

---

## How to play

1. **FIGHT** → **Enable Microphone** (or **Use Keyboard** for quiet testing).
2. Stay quiet for ~3 seconds while the game measures your room's noise.
3. Two cats face off. A **clash meter** sits between them:
   - Your **sound** pushes the meter toward the enemy.
   - If the meter reaches the **enemy side → you land a hit**.
   - If it reaches **your side → you take a hit**.
4. Drain the enemy's HP to **0** to win the level.

### The voices
Every cat has a **real recorded meow** (MP3 files in `sounds/`):
- **You** — your equipped skin's own voice (each of the 16 skins sounds different).
- **Each rival** — its own distinct meow, from cute kittens early on to angry toms at the
  end. The rival also taunts when a fight begins, cries out when it lands a hit,
  whimpers when it's nearly beaten, and makes a final cry when the level ends.
- The built-in synthesized effects (hit thumps, hisses, chimes) play quietly underneath,
  and you can balance them against the cat voices in **Settings**.

### Controls
| Input | Action |
|---|---|
| Speak / shout | Push the clash meter |
| **SPACE** (quiet mode) | Simulate a roar |
| **Hold to shout** (touch devices) | On-screen roar button — for phones or no-mic play |
| **F** or the button | Unleash **MEGA MEOW** when charged |
| **Sensitivity slider** | Make the mic easier/harder to trigger |
| **M** | Mute sound · **P / Esc** pause · **T** switch Dark/Light theme |
| **Gear button** (menu) | Open **Settings** — set Cat-voice and Effects volume |
| **Shop** | Spend coins on skins |
| **Sun / Moon button** | Toggle Dark ↔ Light theme (top-right of menu & shop) |

---

## Coins & skins

- Win a level: `25 + level×5`, plus up to **+50** for HP kept and **+50** for a flawless win.
- Lose: a small **+5** consolation.
- **16 skins** from **Shadow** (free) up to **Cap'n Whiskers** (1,500).
- Each skin changes both your cat's **look** and its **voice**.

The full roster, in shop order:

| Skin | Price | Style |
|---|---|---|
| Shadow | free | plain grey |
| Mittens | 60 | white socks + chest bib |
| Sunny Tabby | 100 | stripes |
| Cookie | 120 | brown spots |
| Snowpuff | 150 | snow white |
| Sir Tuxedo | 200 | tuxedo |
| Calico Crazy | 250 | calico |
| Mister Siamese | 300 | siamese points |
| Pepper | 350 | stripes + scarf |
| Ninja Neko | 400 | bandana |
| Wizard Whiskers | 500 | stars + wizard hat |
| Boba | 600 | heart patch + bow |
| King Whiskers | 800 | crown |
| Professor Paws | 1,000 | tuxedo + shades |
| Cosmic Neko | 1,200 | stars + halo |
| Cap'n Whiskers | 1,500 | siamese points + pirate hat |

- Coins, owned skins and your equipped skin are saved in `localStorage`.

## The 17 rivals

Scared Kitten → Sunny Tom → Alley Shadow → Calico Crazy → Duke Tuxedo →
Mister Siamese → Ninja Neko → Wizard Whiskers → Shadowfang → **King Whiskers** →
Mittens the Merciless → Cookie Crusher → Pepper Puncher → Boba Brawler →
Professor Claws → Cosmic Cataclysm → **Cap'n Chaos** (final boss).

Each level has more HP, pushes harder, hits for more damage — **and has its own meow**
(levels 11–17 reuse a sound file at a different pitch, so every enemy still sounds distinct).

---

## Sound files

All cat voices are real recordings in `sounds/` (10 MP3s):

- **Enemies** pick their file by level (`snd` field in the `LEVELS` array) and their
  pitch (`rate` — optional, defaults to 1).
- **Player skins** reuse a file at a tuned pitch (`voice` + `vrate` in `SKINS`).

To swap a sound, drop a replacement with the same name in `sounds/`, or edit those
fields in `game.js`. If a file ever fails to load, the game falls back to a synth meow.

---

## Tuning

Open `game.js` and edit the constants near the top:

```js
const PLAYER_POWER = 1.30;  // how hard your loudness pushes
const METER_RATE   = 62;    // meter speed
const SPECIAL_GAIN = 12;    // special charge rate
```

Per-level difficulty lives in the `LEVELS` array (`hits`, `push`, `dmg`); add or remove
rows there and the level count updates everywhere automatically. Mic calibration/threshold
lives in `readPlayerRaw()`.
Cat-voice and effect volumes are saved in `save.volCat` / `save.volFx`
(set them in-game from **Settings**, or edit the `DEFAULT_SAVE` values).

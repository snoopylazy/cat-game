# Cat vs Cat — Sound Battle

A microphone-powered fighting game. **Shout louder than the enemy cat** to push
the clash meter into their side and drain their HP. Beat all **10 levels** and
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

### The two voices
Both cats meow, so you can tell them apart by ear:
- **You** — a bright, higher meow.
- **The rival** — a deeper, raspier **tomcat** meow (plus the occasional growl or hiss).

### Controls
| Input | Action |
|---|---|
| Speak / shout | Push the clash meter |
| **SPACE** (quiet mode) | Simulate a roar |
| **F** or the button | Unleash **MEGA MEOW** when charged |
| **Sensitivity slider** | Make the mic easier/harder to trigger |
| **M** | Mute sound · **P / Esc** pause · **T** switch Dark/Light theme |
| **Shop** | Spend coins on skins |
| **Sun / Moon button** | Toggle Dark ↔ Light theme (top-right of menu & shop) |

---

## Coins & skins

- Win a level: `25 + level×5`, plus up to **+50** for HP kept and **+50** for a flawless win.
- Lose: a small **+5** consolation.
- 9 skins from **Shadow** (free) up to **King Whiskers** (800).
- Coins, owned skins and your equipped skin are saved in `localStorage`.

## The 10 rivals

Scared Kitten → Sunny Tom → Alley Shadow → Calico Crazy → Duke Tuxedo →
Mister Siamese → Ninja Neko → Wizard Whiskers → Shadowfang → **King Whiskers**.

Each level has more HP, pushes harder, and hits for more damage.

---

## Tuning

Open `game.js` and edit the constants near the top:

```js
const PLAYER_POWER = 1.30;  // how hard your loudness pushes
const METER_RATE   = 62;    // meter speed
const SPECIAL_GAIN = 12;    // special charge rate
```

Per-level difficulty lives in the `LEVELS` array (`hits`, `push`, `dmg`).
Mic calibration/threshold lives in `readPlayerRaw()`.

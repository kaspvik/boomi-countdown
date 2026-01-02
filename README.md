# Boomi Countdown

Ett snabbt, socialt partyspel (4–12 spelare) där ni ansluter via mobil/dator till samma rum. Under varje 60-sekundersrunda skickas den pixliga “bomb-varelsen” **Boomi** mellan spelarna medan ni försöker lista ut vem som i hemlighet är **Boomi-placerare**.

## Länkar

- **Live (Vercel):** <https://boomi-countdown.vercel.app/>
- **Repo (GitHub):** <https://github.com/kaspvik/boomi-countdown/tree/main>

---

## Projektidé

**Boomi Countdown** är ett socialt deduktionsspel utan voice-chat där UI:t hjälper till att dölja roller på ett rättvist sätt (“täckmantlar”).  
En hemlig roll (Boomi-placerare) väljer startoffer i smyg. Offret kan:

- **Gissa** vem som placerade Boomi (risk/reward),
- eller spela kort som **Pass/Block** för att skicka vidare Boomi och överleva rundan.

**Vinstvillkor**

- **Offer-laget vinner** när alla Boomi-placerare åker ut.
- **Boomi-placerare vinner** när de är i majoritet.

---

## Mål

- Spelbart partyspel för **4–12 spelare**
- Låg friktion: **lobby + rumskod** för att joina snabbt
- Tydlig rundloop: **valfas → diskussion → handling (gissa/pass/block) → rundslut**
- Retro/pixelkänsla: sprites, micro-animationer, enkel ljudbild
- Tillgänglighet enligt **WCAG 2.1 (A/AA)**

---

## Funktioner (sammanfattning)

- **Realtime multiplayer**: rum, spelare, status och rundor synkas live
- **Lobby**: skapa/join med rumskod, host-kontroller
- **Rundloop**: timer-driven 60s runda + resultatskärm
- **Rollhemlighet**: UI-mönster som undviker att avslöja roller oavsiktligt
- **Kort**: t.ex. Pass/Block som påverkar flödet
- **Pixel UI**: återanvändbara komponenter (frames/buttons/panels)
- **Animationer & ljud**: Boomi-animationer och SFX/BGM

---

## Tech stack & tekniska val

- **React + TypeScript + Vite** – snabb dev-loop, bra TS-stöd och komponentbaserad UI
- **Firebase / Firestore** – realtime-synk och enkel rum-/spelarmodell
- **Zustand** – lättviktig global state (UI-state + lokala “view models”)
- **@pixi/react + PixiJS** – sprites/animationer för Boomi och pixelkänsla
- **Howler.js** – SFX/BGM med mute/volume via store
- **CSS Modules** – isolerad styling, konsekvent pixeltema

**Varför dessa val?**

- Realtidsflödet (rum + spelare + runda) kräver stabil synk → Firestore passar bra.
- Zustand ger enkel global state utan Redux-boilerplate.
- Pixi ger bättre kontroll på sprite-animationer än “bara CSS” när det blir spelkänsla.

---

## Hur funktioner är implementerade

### Realtime rum & spelare (Firestore)

- En **rooms**-kollektion håller rummets state (fas, timer, current holder, runda, etc.)
- En **players**-struktur (t.ex. subcollection eller separat collection med roomId) håller:
  - `name`, `alive`, `role`, `cards`, etc.
- UI lyssnar via hooks (t.ex. `useRoom`, `usePlayers`) som:
  - subskar på dokument/queries
  - mappar snapshot → typed state
  - hanterar loading/error

### Rundloop & state machine

Rummet styrs av en enkel “state machine” i datan, t.ex.:

- `phase: "lobby" | "role" | "question" | "round" | "roundResults" | "gameOver"`
- `roundResultsStep` för stegvis reveal (ex. “role”, “votes”, etc.)

Byten sker genom:

- kontrollerade “transition”-funktioner (t.ex. `startGame`, `onNext`, `onStartGame`)
- atomiska uppdateringar i Firestore (updateDoc/increment/timestamps)

### Timer och synk

- Timer drivs från **server-timestamp** (för fairness) och klienten räknar ner lokalt.
- Vid timeout triggas rundslut och relevanta fält uppdateras i room-documentet.

### “Täckmantlar” för roller (social deduktion utan voice-chat)

- UI visar olika info beroende på:
  - om spelaren är alive/utslagen
  - om spelaren är current holder
  - vilken phase man är i
- Målet: minimera “läckage” av hemlig roll via UI (t.ex. genom att bara visa viss info i rätt steg).

### Kort: Pass / Block

- Kort är data på spelaren (t.ex. array/flags).
- När ett kort spelas:
  - valideras action (rätt phase, spelaren är alive, har kortet)
  - uppdaterar player state + ev. room state
  - logik ligger i service-funktioner för att hålla komponenter tunna.

### Animationer & ljud

- Boomi renderas i en Pixi-canvas-komponent (`BoomiCanvas` / `BoomiSprite`).
- Animationer drivs av små “runtimes” som stegas i tick-loop.
- Ljud styrs via en `soundStore`
  - `sfxMuted`, `sfxVolume`, `bgmMuted`, `bgmVolume`
  - `playSfx(key)` / `playRandomHello()` etc.

### CRUD-operationer

- **Create:** skapa rum och lägga till spelare vid _Create/Join_ i lobbyn.
- **Read:** realtidslyssning via `useRoom` och `usePlayers` för att kontinuerligt synka UI med databasen.
- **Update:** majoriteten av spellogiken är uppdateringar i Firestore, t.ex. `startGame`, `passBomb`, `killPlayer` samt fas-/rollflödet (phases och role reveals).
- **Delete:** spelare kan tas bort via `leaveRoom`, och rum kan städas bort via `deleteRoom`.

### Tillgänglighet (WCAG 2.1 A/AA)

- Semantisk HTML: `main`, `header`, `section`, `button`, `label`, etc.
- Tangentbordsnavigering: fokusordning + tydliga fokusstilar
- ARIA där det behövs (t.ex. “status”-texter, modaler, dialoger)
- Kontrast och läsbarhet även i pixeltema

---

## Kom igång lokalt

### Förkrav

- **Node.js** (rekommenderat: LTS)
- **npm** (eller pnpm/yarn om du använder det)

### 1) Installera

```bash
npm install
```

### 2) Miljövariabler

Skapa en `.env` i projektroten:

```bash
VITE_FIREBASE_API_KEY=xxxxxxxx
VITE_FIREBASE_AUTH_DOMAIN=xxxxxxxx
VITE_FIREBASE_PROJECT_ID=xxxxxxxx
VITE_FIREBASE_STORAGE_BUCKET=xxxxxxxx
VITE_FIREBASE_MESSAGING_SENDER_ID=xxxxxxxx
VITE_FIREBASE_APP_ID=xxxxxxxx
```

### 3. Starta dev-server

npm run dev

Öppna sedan adressen som Vite skriver ut (ofta http://localhost:5173).

### 4. Build & preview

npm run build
npm run preview

### 5. För opponerare:

Spelet är byggt för minst 4 spelare. För att kunna testa flödet själv går det att köra med 2 webbläsare (eller ett inkognito-fönster) genom att tillfälligt sänka min-kravet i koden.

#### Så testar du med 2 spelare:

- Öppna projektet och gå till:
src/services/rooms/startGame.ts

- Ändra min-kravet från 4 till 2:

if (players.length < 2) {
  throw new Error("Need at least 2 players to start the game.");
}

- Starta appen.

- Öppna två webbläsarfönster (t.ex. Chrome + inkognito).

- Skapa ett rum i första fönstret (host) och gå med i samma rum i andra fönstret.

- Starta spelet från host-fönstret.

Tips: Inkognito gör att du får en separat session/användare utan att logga ut.

## Deploy (Vercel)

Projektet är deployat på Vercel och bygger automatiskt från GitHub.

Byggkommando: npm run build

### Projektplan (6 veckor, grov)

- Research & scope: målgrupp, risker, backlog, repo + CI-grund

- UX/UI: Figma-wireframes + klickbar prototyp, WCAG-tänk

- Grundapp: lobby → rundloop end-to-end (mock → riktig data)

- Kort + a11y: pass/block, ARIA, keyboard, playtest + åtgärdslista

- Stabilitet/optimering: realtime-stabilitet, förbättrad struktur, extern playtest

- Polish & leverans: animationer/ljud, README, slutrapport, sista test

## Checklista: betygskriterier

### Godkänt (G)

- [x] Planering & research: målgruppsanalys genomförd
- [x] Backlogverktyg: GitHub Projects används
- [x] Design & prototyp: wireframes + Figma-prototyp
- [x] Responsiv design: fungerar minst på mobil + desktop
- [x] WCAG 2.1 (A/AA): semantisk HTML + a11y-anpassningar
- [x] Modernt JS-ramverk: React
- [x] Databas: Firestore för lagring/hämtning
- [x] State-hantering
- [x] Versionshantering: Git + GitHub repo
- [x] Deploy: publikt hostad på Vercel
- [x] README: projektbeskrivning, körinstruktioner, länk, kriterier
- [x] Helhetsupplevelse: obruten navigation mellan skärmar/faser

### Väl godkänt (VG)

- [x] Allt för G
- [x] Interaktiv prototyp: demonstrerar användarflöde nära slutprodukt
- [x] State management: Zustand för global state
- [x] WAVE-test: testad i WebAIM WAVE utan errors/warnings
- [x] Optimering: återanvändbara komponenter, minskad duplicering, rimlig bundle
- [x] CRUD: Create/Read/Update/Delete för rum/spelare.
- [x] Auth: Firebase Authentication (anonym inloggning) används.
- [x] Full responsivitet: mobil → stora skärmar med dynamisk layout
- [x] README (fördjupad): tekniska val + hur funktioner implementerats
- [x] Git-flöde: feature branches + PRs, tydliga commits
- [x] Automatiserad deploy: GitHub → Vercel auto build & deploy
- [x] Professionell UX: tydlig feedback vid interaktioner, stabil demo, playtests

### Credits

UI/Ljud/Design/Dev: **Kasper Vikström**

Boomi-sprite: (Original name - Chom Bombs) - Created by **Chiecola**

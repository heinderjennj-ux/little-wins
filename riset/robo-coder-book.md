# Robo Coder Book: research behind the design

Goal (owner, 2026-10-20): children **want to finish the whole book**, and their thinking keeps working while they do.
Every design rule below cites where it comes from. Weak or second-hand sources are marked.

## 1. What the research says, and the rule we take from it

| # | Finding | Source | Rule for the book |
|---|---|---|---|
| 1 | Worked examples beat problem solving at the **start** of learning; later, solving beats examples. Fading (remove one step at a time) moves learners between the two. Backward fading = learner first fills only the **last** step. Benefit mixed in some domains (2024 study). | Renkl & Atkinson; reviews at [ASU](https://faculty.engineering.asu.edu/mre/wp-content/uploads/sites/31/2020/02/Exp_Rev_LI06.pdf), [PsychArchives](https://www.psycharchives.org/handle/20.500.11780/196), [Frontiers 2024](https://www.frontiersin.org/journals/education/articles/10.3389/feduc.2024.1293516/pdf) | Each mission: **3 solved ★ examples** → "Finish the Code" (last arrows blank) → solo puzzles. |
| 2 | Kumon: very small steps from easy to hard so children advance without help; example solutions shown when a concept is new; ~800 sheets revised by watching children. (Kumon's own claims, not independent research.) | [Kumon small steps](https://kumongroup.com/eng/about-kumon/method/small-steps), [Kumon method](https://www.kumon.co.uk/our-method) | Start on **3x3 and 4x4 boards** with a dotted trail; grow board size and code length one notch at a time. |
| 3 | Learning is fastest when the learner succeeds about **85%** of the time (model result, binary tasks; authors link it to the "zone of proximal development"). | [Wilson et al. 2019, Nature Communications](https://pmc.ncbi.nlm.nih.gov/articles/PMC6831579) | Main task on every puzzle should be solvable by most kids; difficulty spikes go into an **optional ★ Challenge**, never into the main task. |
| 4 | Curiosity activates the midbrain/dopamine circuit and improves memory, even for things learned while curious (fMRI, adults). | [Gruber, Gelman & Ranganath 2014, Neuron](https://pmc.ncbi.nlm.nih.gov/articles/PMC4252494/) | Build "what happens next?" moments: hidden pixel pictures, story cliffhanger at each mission end, a mystery in the river. |
| 5 | Expected tangible rewards can lower interest in an activity children already like (drawing study); verbal/informational praise raises it. Contested scope (Cameron & Pierce). | Lepper, Greene & Nisbett 1973; Deci, Koestner & Ryan 1999 (via [summary](https://behavioraleconomics.com/resources/mini-encyclopedia-of-be/overjustification-effect); [reanalysis](https://scholarhub.vn/publication/:slug/9460423c-1ed9-4760-995d-5dd57e6628aa)) | No "do X to get a prize" framing. Celebrate **mastery** ("You figured out loops!"), badges to colour are the child's own record, certificate at the end. |
| 6 | Endowed progress: a card with 2 of 10 stamps already filled was completed 34% vs 19% with an empty 8-stamp card (same work left). | [Nunes & Drèze 2006](https://thinkinsights.net/consulting/endowed-progress-effect) | Mission map starts with **one star already earned** ("You opened the book!"). Visible progress dots on every puzzle page. |
| 7 | Interleaved practice (mixing problem types) roughly doubled delayed test scores vs blocked practice (grade 7 maths); some blocked practice first helps. | [Rohrer et al. 2014](https://Www.Gwern.net/doc/psychology/spaced-repetition/2014-rohrer.pdf), [Learning Scientists](https://www.learningscientists.org/blog/2021/10/28-1) | Short block of one type to learn it, then **mix** puzzle types inside a mission instead of 6 identical puzzles in a row (also less boring). |
| 8 | Robot Turtles (Kickstarter hit, ages 3–8): designer's own kids were the testers; simple sequences → mazes → subroutines; a "bug/undo" card keeps mistakes fun. | [NPR](https://www.npr.org/sections/alltechconsidered/2013/09/17/223402361/this-board-game-aims-to-teach-preschoolers-how-to-code), [Crosscut](https://crosscut.com/2014/04/robot-turtles-coding-board-game-accidental) | Debugging framed as a game ("Fix the Bug"), and **real children test the book** before launch. |
| 9 | ScratchJr/KIBO (Bers, Tufts/BC): sequencing is the core early skill; designs for young children must not copy models for older children; "coding as playground". | [Bers, EDUCON](https://sites.bc.edu/devtech/wp-content/uploads/sites/181/2018/05/EDUCON.pdf) | Sequencing gets the most puzzles; Starter Pack stays playful (story, colouring). |
| 10 | Young readers: smaller font and longer lines lowered 2nd graders' comprehension. Evidence base is thin. | [PLoS ONE 2013](https://doaj.org/article/4b393b5e9f87496da73aa680a5986392) | Instructions one short sentence, large type, same icon per puzzle type so pre-readers recognise the task. |
| 11 | Children react positively to bright colours (pink, blue, red), negatively to dark/brown/grey; red/yellow/blue rank high across countries (small studies). | [Boyatzis & Varghese 1994](https://moodle2.units.it/pluginfile.php/413780/mod_resource/content/0/Verghese1994.pdf), [summary](https://richtmann.org/journal/index.php/mjss/article/download/1909/1908/7524) | White page, bright sand-yellow board, Robo blue, no beige/moss. |

## 2. Why would a child finish this book? (our working model)

A child stops at one of four points. Each has a countermeasure, and each can be measured in a playtest.

| Where kids quit | Why | Countermeasure in the book |
|---|---|---|
| Page 1–3 | too much text, unclear task | story in 2 short paragraphs, 3 solved ★ examples, follow-the-dots warm-up on 3x3 |
| First difficulty spike | fails twice in a row | small steps (3x3 → 4x4 → 5x5), backward fading, hard parts only in optional ★ Challenge |
| Middle of a mission | boredom, every page the same | interleaved types, new item/friend per mission, mini goal every page |
| Between missions | no reason to continue | mission complete page + star on the map + cliffhanger + next friend's problem |

**Playtest protocol (the proof):** 3–5 children aged 5–9, printed book, a pencil, no help unless asked.
Record for each puzzle: solved yes/no, time, help needed. Targets: ≥85% of main tasks solved alone;
every child reaches "Mission 1 complete" in the first sitting (about 20 minutes); note the page where anyone
stops or sighs. Fix that page first.

## 3. Risks we have not talked about yet

1. **Reading level**: ages 5–9 includes children who cannot read yet. Needs icons + a grown-up reading the story.
2. **AI art**: our characters were generated with AI. US Copyright Office does not protect AI-generated images
   (Zarya of the Dawn, 2023) — others could copy Robo; our text and arrangement are protected
   ([Creative Commons summary](https://creativecommons.org/2023/02/27/zarya-of-the-dawn-us-copyright-office-affirms-limits-on-copyright-of-ai-outputs/)).
   Etsy asks sellers to disclose AI use in listings ([TechCrunch 2024](https://techcrunch.com/2024/07/09/etsy-new-seller-policy-2024-generative-ai)).
3. **Name**: "ROBOCODE" is a US trademark filing for IT training and a coding app name; "Robo Coder" not found as a
   registered kids product, but a USPTO/EUIPO search is still needed before launch
   ([Justia](https://trademark.justia.com/owners/yildiz-ozkur-3980416)).
4. **Ink**: home printers; keep large colour areas light; check the book prints readable in black and white.
5. **Paper size**: Letter (US/CA) and A4 (UK/AU) versions.
6. **Answer key**: "write the code" puzzles have many correct answers; key says "(example)".

## 4. Gumroad images: how to generate them (research, 2026-10-20)

Sources: Google Cloud, *Ultimate prompting guide for Nano Banana* (official, March 2026)
https://cloud.google.com/blog/products/ai-machine-learning/ultimate-prompting-guide-for-nano-banana ·
fal, *How to use Nano Banana 2* https://fal.ai/learn/tools/how-to-use-nano-banana-2 ·
Artlist, *Nano Banana Pro prompts* https://artlist.io/blog/nano-banana-prompts/ ·
Creatsy, *AI mockup generators tested* https://creatsy.com/blog/1752128853-we-tested-every-ai-mockup-generator-in-2026-heres-what-actually-works-and-what-doesnt
(vendor/blog sources are weaker than Google's guide).

| Finding | Source | Production rule |
|---|---|---|
| Describe the scene as a narrative, not keywords; start with a strong verb; most important detail first | Google | Every prompt: verb + subject + action + place + composition + style, in sentences |
| Say what you want, not what you don't ("empty desk", not "no text") | Google | Positive framing only: "blank white paper", "plain wooden desk" |
| With references: state each image's ROLE ("use image 2 as the exact character design") | Google | Number every reference and give it one job |
| Up to 14 reference images | Google, Krea | Character sheets every time for consistency |
| Edits: say exactly what changes and what stays the same | Google | Edit prompts start with "Keep … exactly. Change only …" |
| Text: quote it, name the font style, keep 3–5 short phrases; small/dense text blurs or mutates, especially at 1K | Google, fal, Artlist | AI never renders our small book text. Big headline text is rendered by HTML on top |
| AI mockups redraw the design instead of placing it, so fine print shifts; pros generate the scene with AI and composite the real artwork | Creatsy, mockup guides; confirmed by our hook v2 | Pipeline: HTML prototype → AI scene with blank sheets (2K) → paste real PDF pages (komposit.py) → HTML text overlay |
| Light/camera words control the look (softbox, top-down, shallow depth of field) | Google | One shared "style block" (desk, light, lens) reused on all 8 slides so they look like one set |

**QA before a slide is used:** (1) zoom 100%: no misspelled or garbled text anywhere; (2) shrink to phone thumbnail: product + "Ages 5–9" readable in 3 seconds; (3) every page shown is a real page of the book; (4) same desk, light and palette as the other slides; (5) characters match the approved sheets.

## 5. Gumroad copy: title, description, pack descriptions (research, 2026-10-20)

| Finding | Source | Rule for our copy |
|---|---|---|
| 79% of users scan; concise + scannable + objective copy scored 124% higher usability than promotional copy | Nielsen & Morkes 1997 (NN/g) https://www.deceptive.design/articles/concise-scannable-and-objective-how-to-write-for-the-web | Short sections, bold lead-ins, bullets, no hype words |
| Far more people read headlines than body copy; never write a "blind" headline that needs the body to make sense | Ogilvy (secondary quotes) https://swipefile.com/five-times-as-many-people-read-the-headlines-david-ogilvy | Title says what it is, for whom, format |
| Match the message to the buyer's awareness level | Schwartz, Breakthrough Advertising (summaries) https://personalmba.com/levels-of-awareness/ | Gumroad buyers are solution-aware: lead with what makes this one different |
| Write with the customer's own words (voice of customer); handle objections on the page | Joanna Wiebe / Copyhackers (summaries) https://microcopyexamples.substack.com/p/use-the-voice-of-the-customer | We have no reviews yet: objections taken from parent concerns; replace with real buyer words later |
| Long descriptions work when split into highlights that a quick scan reveals | Baymard https://baymard.com/research-articles/structure-descriptions-by-highlights | Highlight blocks, each answering one question |
| Show what's inside (structure of contents), benefits not just features | Gumroad sales-page guides https://actionpoints.substack.com/p/how-to-write-gumroad-sales-page | "What's inside" list + pack comparison |
| Pediatric guidance pushes parents to limit screen time | AAP summaries https://support.apple.com/guide/aap-apple/dwpwek4yury5/web | "Screen-free" is a real parent motive, state it plainly |
| With three options, people lean to the middle one (compromise effect) | Simonson 1989 https://cognition.aau.at/bg/BA/Simonson%20%281989%29.pdf | Three packs; Full Pack is the natural middle choice |

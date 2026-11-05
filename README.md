# Little Wins

Skills, brand guide and research behind Little Wins content.

- `skills/membuat-video-iklan-2d/` — Claude skill for making 2D vertical ads & YouTube Shorts (copywriting → script → ElevenLabs voice → AI characters → Remotion animation → render), with its research references and helper scripts.
- `skills/brand-little-wins/` — Little Wins brand guide (positioning, mascot, characters, script rules).
- `brand-little-wins/` — mascot and US character images.
- `video-3d/` — Remotion project (2D storybook animation): ads & Shorts source code (`src/`), helper scripts and assets (`public/`: AI characters, voice-overs, SFX, music). Run `npm install` then `npx remotion studio`. Rendered videos (`out/`) are not included.
- `riset/analisis-video-rel-kereta/` — frame-by-frame analysis of a reference video (camera-driven transitions, expressions, micro details), a localhost analysis toolkit (camera motion, scenes, depth, palette, audio) and a Blender (bpy) recipe + starter scene.
- `riset/` — research notes (Robo Coder book, video hook scripts, animation style, Shorts detail research, audience research brief).

To use a skill with Claude Code, copy its folder into `~/.claude/skills/`.

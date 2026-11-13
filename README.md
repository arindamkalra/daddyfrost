# Frost 🐾

The official website of Frost: Persian, floof, professional napper, part-time bird inspector.

## What's here

- `index.html`, `style.css`, `script.js`: the website
- `assets/photos/`: web-sized copies of the photos
- `assets/video/`: the window bird-watching video (MP4)
- `assets/audio/frost-voice.mp3`: the voice played by the "Hear His Majesty Speak" button

## Swapping in Frost's real voice

Replace `assets/audio/frost-voice.mp3` with your recording, keeping the same file name.
`meow-2.mp3` and `meow-3.mp3` are used for other clicks on the page and can be swapped the same way.

## Preview locally

```bash
cd ~/Desktop/Daddyfrost
python3 -m http.server 8000
# open http://localhost:8000
```

## Publish to GitHub Pages

```bash
cd ~/Desktop/Daddyfrost
git init
git add .
git commit -m "Frost's website"
git branch -M main
git remote add origin https://github.com/arindamkalra/daddyfrost.git
git push -u origin main
```

Then on GitHub: repo **Settings → Pages → Source: Deploy from a branch → main / (root) → Save**.
The site goes live at https://arindamkalra.github.io/daddyfrost/ within a minute or two.

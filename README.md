# 🎥 Video to GIF Converter with Giphy Integration

Convert your videos into high-quality GIFs **directly in the browser** using [FFmpeg.wasm](https://github.com/ffmpegwasm/ffmpeg.wasm).
Add custom text overlays, download locally, or upload your GIFs to **Giphy** and share them instantly. 🚀

---

## ✨ Features

* 🎞️ Upload any video (MP4, WebM, etc.)
* ⚡ Convert to GIF fully client-side (no server needed)
* 📝 Add custom text captions
* 💾 Download your GIF locally
* 🌐 Upload directly to **Giphy** via their API
* 📋 Copy the Giphy share link with one click
* 🌙 Light/Dark mode support

---

## 🛠️ Tech Stack

* [React + Vite](https://vitejs.dev/) ⚛️
* [FFmpeg.wasm](https://github.com/ffmpegwasm/ffmpeg.wasm) 🎬
* [Tailwind CSS](https://tailwindcss.com/) 🎨
* [FileSaver.js](https://github.com/eligrey/FileSaver.js/) 💾
* [Giphy Upload API](https://developers.giphy.com/docs/api/endpoint#upload) 🎉

---

## 📦 Installation

Clone the repo:

```bash
git clone https://github.com/your-username/video-gif-converter.git
cd video-gif-converter
```

Install dependencies:

```bash
npm install
```

Run development server:

```bash
npm run dev
```

Build for production:

```bash
npm run build
```

---

## 🔑 Environment Variables

Create a `.env` file in the root:

```
VITE_GIPHY_API=your_giphy_api_key_here
```

* Get your free API key from [Giphy Developers](https://developers.giphy.com/).
* Keys must be prefixed with `VITE_` to be exposed to the client.

---

## 🚀 Deployment

This app is designed for **Vercel** or **Netlify**.

### Important (FFmpeg.wasm):

You must set headers to enable `SharedArrayBuffer`:

For **Vercel**, create a `vercel.json` file:

```json
{
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        { "key": "Cross-Origin-Opener-Policy", "value": "same-origin" },
        { "key": "Cross-Origin-Embedder-Policy", "value": "require-corp" }
      ]
    }
  ]
}
```

For **Netlify**, create a `_headers` file in `public/`:

```
/*
  Cross-Origin-Opener-Policy: same-origin
  Cross-Origin-Embedder-Policy: require-corp
```

---

## 📂 Project Structure

```
src/
 ├── components/
 │    └── Navbar.jsx
 ├── VideoShow.jsx   # main conversion logic
 ├── App.jsx
 ├── main.jsx
public/
 ├── font.ttf        # custom font for GIF text
 └── _headers / vercel.json (for deployment)
```

---


## 🧩 Future Improvements

* 🔊 Support audio → GIF with sound as MP4 export
* 🎨 More advanced text styling (color, position, animations)
* 🌐 Social share buttons

---

## 📜 License

MIT License © 2025 Aarish Mansur
Feel free to use, modify, and share. 🎉

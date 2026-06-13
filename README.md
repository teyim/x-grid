# X-Grid

X-Grid is a client-only image grid maker for X/Twitter and Instagram.

The app runs image processing in the browser with Canvas/Fabric. Images never leave the visitor's device.

## Features

- X/Twitter 2x2 image splitter
- X custom 9-image grid illusion
- Instagram 3x3 profile grid splitter
- Instagram carousel splitter
- Local preview and JPG downloads
- Locale-specific SEO pages

## Development

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Privacy Model

Images are selected from the visitor's device and processed locally in the browser. Generated tiles are downloaded directly from browser-created blobs.

## Checks

```bash
npm run lint
npx tsc --noEmit
npm run build
```

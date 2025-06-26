This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## How to Use

1. **Select Images for Your Twitter Grid**
   - Click the "Select Images" button to upload images from your device.
   - You must select exactly **9 images** to proceed.

2. **Assign Images to Grid Quadrants**
   - After uploading, assign each image to a specific slot in the grid (Header, Main, Footer for each quadrant).
   - Click on a slot (e.g., "Header TL", "Main", "Footer BR") and choose an image to assign.
   - All slots must be filled before you can continue.

3. **Upload and Process**
   - Once all images are assigned, click "Upload Images".
   - The app will process your images and generate a Twitter-style grid preview.

4. **Preview and Download**
   - After processing, you'll see a preview of your Twitter grid as it would appear in a tweet.
   - Download each grid image using the provided download buttons.

5. **Convert Another Grid**
   - Use the "Convert Another Image Grid" button to start over and create a new grid.

## Frequently Asked Questions (FAQ)

**Q: Why do I need to upload exactly 9 images?**  
A: The app is designed to create a 3x3 Twitter grid, which requires 9 images—one for each slot (Header, Main, Footer in each quadrant).

**Q: What image formats are supported?**  
A: You can upload any standard image format (JPEG, PNG, etc.). All images must be valid and non-corrupted.

**Q: How do I assign images to specific grid slots?**  
A: After uploading, click on a slot (e.g., "Header TL") and select the image you want to assign. Repeat for all slots.

**Q: What happens after I upload and assign all images?**  
A: The app processes your images and displays a Twitter-style preview. You can then download each part of the grid.

**Q: Can I re-do or change my grid after processing?**  
A: Yes! Click "Convert Another Image Grid" to start over and upload a new set of images.

**Q: My upload failed or processing didn't complete. What should I do?**  
A: If processing fails, you'll see an error message. Please check your internet connection and try again. If the problem persists, check the function logs or contact support.

**Q: Where are my images stored?**  
A: Uploaded images are stored securely using Supabase Storage and are only used for processing your grid.

**Q: Is my data private?**  
A: Yes, your images are only used for the grid you create and are not shared with third parties.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

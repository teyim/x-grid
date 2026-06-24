import type { Metadata } from 'next';
import type { GridModeId } from '@/lib/gridModes';
import { SITE_URL } from '@/lib/seo';

export type LandingPageSlug =
  | 'x-grid-maker'
  | 'twitter-image-splitter'
  | 'create-twitter-grid'
  | 'twitter-puzzle-maker'
  | 'x-banner-maker'
  | 'x-profile-grid-maker'
  | 'instagram-puzzle-maker'
  | 'instagram-image-splitter'
  | 'instagram-carousel-maker'
  | 'instagram-grid-layout'
  | 'split-photo-for-instagram'
  | 'split-image-for-twitter'
  | 'split-image-for-x'
  | 'twitter-banner-grid'
  | 'twitter-mosaic-maker'
  | 'twitter-photo-grid'
  | 'x-photo-grid';

export type LandingPageContent = {
  slug: LandingPageSlug;
  primaryKeyword: string;
  title: string;
  description: string;
  kicker: string;
  heading: string;
  body: string;
  ctaLabel: string;
  initialMode: GridModeId;
  toolModes: GridModeId[];
  seoTitle: string;
  seoIntro: string;
  steps: { title: string; text: string }[];
  sections: { title: string; text: string }[];
  faqs: { question: string; answer: string }[];
  sampleImage: '/samples/social-grid-landscape.jpg' | '/samples/social-grid-carousel.jpg';
  sampleAlt: string;
  relatedLinks: { href: string; label: string }[];
  keywords: string[];
};

const xRelatedLinks = [
  { href: '/twitter-grid-maker', label: 'Twitter grid maker' },
  { href: '/create-twitter-grid-effect', label: 'Twitter grid effect' },
  { href: '/twitter-image-splitter', label: 'Twitter image splitter' },
];

const instagramRelatedLinks = [
  { href: '/instagram-grid-maker', label: 'Instagram grid maker' },
  { href: '/instagram-image-splitter', label: 'Instagram image splitter' },
  { href: '/instagram-carousel-maker', label: 'Instagram carousel maker' },
];

function makeXPage(
  slug: LandingPageSlug,
  primaryKeyword: string,
  options: {
    title?: string;
    heading?: string;
    description?: string;
    kicker?: string;
    body?: string;
    initialMode?: GridModeId;
    toolModes?: GridModeId[];
    ctaLabel?: string;
    sampleAlt?: string;
  } = {}
): LandingPageContent {
  const title = options.title ?? toTitleCase(primaryKeyword);
  const heading = options.heading ?? title;

  return {
    slug,
    primaryKeyword,
    title: `${title} - Free Online Tool`,
    description:
      options.description ??
      `Use this free ${primaryKeyword} to split images for X/Twitter posts, preview the grid, and download ordered JPG tiles in your browser.`,
    kicker: options.kicker ?? 'X and Twitter grid tool',
    heading,
    body:
      options.body ??
      `Create a ${primaryKeyword} from one image, preview the X/Twitter post layout, and download the tiles in the right order. Image processing stays on your device.`,
    ctaLabel: options.ctaLabel ?? `Open the ${primaryKeyword}`,
    initialMode: options.initialMode ?? 'x-single',
    toolModes: options.toolModes ?? ['x-single', 'x-custom'],
    seoTitle: `How to use a ${primaryKeyword}`,
    seoIntro:
      `The ${primaryKeyword} workflow is built for people who already have an image and need post-ready X/Twitter tiles without opening a design app.`,
    steps: [
      {
        title: 'Choose the X preset',
        text: 'Use the 2x2 splitter for one image or custom mode for the original multi-image grid illusion.',
      },
      {
        title: 'Preview the grid',
        text: 'Check how the tiles line up in the post-style preview before downloading.',
      },
      {
        title: 'Post the tiles together',
        text: 'Download the numbered JPG files and attach them to one X/Twitter post.',
      },
    ],
    sections: [
      {
        title: 'Made for post grids',
        text: 'The X preset creates four ordered tiles that fit the familiar compact feed preview.',
      },
      {
        title: 'Useful for campaigns',
        text: 'Use it for launches, announcements, art reveals, banner-style visuals, and social experiments.',
      },
      {
        title: 'Private image splitting',
        text: 'The tool uses browser canvas processing, so your source image is not uploaded to a server.',
      },
    ],
    faqs: [
      {
        question: `What does this ${primaryKeyword} do?`,
        answer:
          'It turns one image into ordered tiles that can be uploaded together to create an X/Twitter grid post.',
      },
      {
        question: 'Does it work for both X and Twitter?',
        answer:
          'Yes. People search for both names, but the post image grid workflow is the same.',
      },
      {
        question: 'Do I need to install anything?',
        answer:
          'No. The splitter runs in the browser and downloads JPG files when processing is complete.',
      },
      {
        question: 'Are my images uploaded?',
        answer:
          'No. The image is processed locally in your browser and stays on your device.',
      },
    ],
    sampleImage: '/samples/social-grid-landscape.jpg',
    sampleAlt:
      options.sampleAlt ??
      `Example image preview for a ${primaryKeyword} created with X-Grid`,
    relatedLinks: xRelatedLinks.filter((link) => link.href !== `/${slug}`),
    keywords: [primaryKeyword],
  };
}

function makeInstagramPage(
  slug: LandingPageSlug,
  primaryKeyword: string,
  options: {
    title?: string;
    heading?: string;
    description?: string;
    kicker?: string;
    body?: string;
    initialMode?: GridModeId;
    toolModes?: GridModeId[];
    ctaLabel?: string;
    sampleImage?: LandingPageContent['sampleImage'];
    sampleAlt?: string;
  } = {}
): LandingPageContent {
  const title = options.title ?? toTitleCase(primaryKeyword);
  const heading = options.heading ?? title;

  return {
    slug,
    primaryKeyword,
    title: `${title} - Free Online Tool`,
    description:
      options.description ??
      `Use this free ${primaryKeyword} to split photos into Instagram grid posts or carousel slides directly in your browser.`,
    kicker: options.kicker ?? 'Instagram image splitter',
    heading,
    body:
      options.body ??
      `Create Instagram-ready tiles from one photo. Choose a profile grid or carousel layout, preview the result, and download ordered JPG files.`,
    ctaLabel: options.ctaLabel ?? `Open the ${primaryKeyword}`,
    initialMode: options.initialMode ?? 'instagram-grid',
    toolModes: options.toolModes ?? ['instagram-grid', 'instagram-carousel'],
    seoTitle: `How to use an ${primaryKeyword}`,
    seoIntro:
      `The ${primaryKeyword} workflow helps turn one image into square tiles for a profile grid, puzzle layout, or swipeable carousel.`,
    steps: [
      {
        title: 'Pick a layout',
        text: 'Choose 3x3 grid for a profile mural or carousel for a wide image split into slides.',
      },
      {
        title: 'Set the crop',
        text: 'Use cover for full square tiles or contain when you need to keep the full image visible.',
      },
      {
        title: 'Download and post',
        text: 'Use the numbered filenames to publish carousel slides left-to-right or grid posts in reverse order.',
      },
    ],
    sections: [
      {
        title: 'Profile grid or carousel',
        text: 'Use the same upload flow for Instagram puzzle grids, 3x3 layouts, and square carousel slides.',
      },
      {
        title: '1080px square exports',
        text: 'The Instagram presets export practical square JPG tiles for posts and carousel slides.',
      },
      {
        title: 'Local processing',
        text: 'Your photo is split in the browser with canvas APIs, so the site does not store the source image.',
      },
    ],
    faqs: [
      {
        question: `What does this ${primaryKeyword} create?`,
        answer:
          'It creates square image tiles for Instagram profile grids or carousel posts, depending on the mode you choose.',
      },
      {
        question: 'Can I split one photo into a 3x3 grid?',
        answer:
          'Yes. Choose Instagram 3x3 Grid Maker to download nine square tiles from one image.',
      },
      {
        question: 'Can I make carousel slides?',
        answer:
          'Yes. Choose Instagram Carousel Splitter to divide one wide image into square slides.',
      },
      {
        question: 'Do my photos stay private?',
        answer:
          'Yes. Processing happens in your browser and the original photo is not uploaded.',
      },
    ],
    sampleImage: options.sampleImage ?? '/samples/social-grid-carousel.jpg',
    sampleAlt:
      options.sampleAlt ??
      `Example image preview for an ${primaryKeyword} created with X-Grid`,
    relatedLinks: instagramRelatedLinks.filter((link) => link.href !== `/${slug}`),
    keywords: [primaryKeyword],
  };
}

export const landingPages: Record<LandingPageSlug, LandingPageContent> = {
  'x-grid-maker': makeXPage('x-grid-maker', 'x grid maker', {
    heading: 'X Grid Maker',
    description:
      'Free X grid maker for 2x2 posts, custom grid illusions, and X photo grids. Split and download images privately in your browser.',
  }),
  'twitter-image-splitter': makeXPage('twitter-image-splitter', 'twitter image splitter', {
    heading: 'Twitter Image Splitter',
    ctaLabel: 'Split an image for Twitter',
    description:
      'Split images for Twitter/X posts with a free browser image splitter. Preview a 2x2 grid and download ordered JPG tiles.',
  }),
  'create-twitter-grid': makeXPage('create-twitter-grid', 'create twitter grid', {
    heading: 'Create Twitter Grid',
    ctaLabel: 'Create a Twitter grid',
    description:
      'Create a Twitter grid online from one image. Preview the X/Twitter grid layout and download the four image tiles.',
  }),
  'twitter-puzzle-maker': makeXPage('twitter-puzzle-maker', 'twitter puzzle maker', {
    heading: 'Twitter Puzzle Maker',
    body:
      'Build a puzzle-style Twitter/X post by splitting one image into four tiles or using the advanced custom grid illusion workflow.',
  }),
  'x-banner-maker': makeXPage('x-banner-maker', 'x banner maker', {
    heading: 'X Banner Maker',
    body:
      'Turn a wide banner-style image into an X/Twitter 2x2 post grid. Preview the feed layout and download ordered tiles.',
  }),
  'x-profile-grid-maker': makeXPage('x-profile-grid-maker', 'x profile grid maker', {
    heading: 'X Profile Grid Maker',
    body:
      'Create a grid-style X profile post from one image. Split the image, check the layout, and download post-ready JPG tiles.',
  }),
  'instagram-puzzle-maker': makeInstagramPage(
    'instagram-puzzle-maker',
    'instagram puzzle maker',
    {
      heading: 'Instagram Puzzle Maker',
      body:
        'Create puzzle-style Instagram tiles from one photo. Use a 3x3 profile grid or split wide artwork into carousel slides.',
    }
  ),
  'instagram-image-splitter': makeInstagramPage(
    'instagram-image-splitter',
    'instagram image splitter',
    {
      heading: 'Instagram Image Splitter',
      ctaLabel: 'Split an image for Instagram',
      description:
        'Free Instagram image splitter for 3x3 profile grids and carousel slides. Split photos privately in your browser.',
    }
  ),
  'instagram-carousel-maker': makeInstagramPage(
    'instagram-carousel-maker',
    'instagram carousel maker',
    {
      heading: 'Instagram Carousel Maker',
      initialMode: 'instagram-carousel',
      ctaLabel: 'Create Instagram carousel slides',
      body:
        'Split a wide photo or graphic into square Instagram carousel slides. Preview the swipeable layout and download ordered JPG files.',
    }
  ),
  'instagram-grid-layout': makeInstagramPage('instagram-grid-layout', 'instagram grid layout', {
    heading: 'Instagram Grid Layout',
    body:
      'Plan and export a 3x3 Instagram grid layout from one image, with square tiles ready for profile posts.',
  }),
  'split-photo-for-instagram': makeInstagramPage(
    'split-photo-for-instagram',
    'split photo for instagram',
    {
      heading: 'Split Photo for Instagram',
      ctaLabel: 'Split a photo for Instagram',
      description:
        'Split a photo for Instagram into a 3x3 grid or square carousel slides with a free browser-based tool.',
    }
  ),
  'split-image-for-twitter': makeXPage('split-image-for-twitter', 'split image for twitter', {
    heading: 'Split Image for Twitter',
    ctaLabel: 'Split an image for Twitter',
  }),
  'split-image-for-x': makeXPage('split-image-for-x', 'split image for x', {
    heading: 'Split Image for X',
    ctaLabel: 'Split an image for X',
  }),
  'twitter-banner-grid': makeXPage('twitter-banner-grid', 'twitter banner grid', {
    heading: 'Twitter Banner Grid',
    body:
      'Turn a banner or panoramic image into a Twitter/X post grid. The tool splits the image into four ordered tiles.',
  }),
  'twitter-mosaic-maker': makeXPage('twitter-mosaic-maker', 'twitter mosaic maker', {
    heading: 'Twitter Mosaic Maker',
    body:
      'Create a mosaic-style Twitter/X post from one image or use custom mode for a more advanced grid illusion.',
  }),
  'twitter-photo-grid': makeXPage('twitter-photo-grid', 'twitter photo grid', {
    heading: 'Twitter Photo Grid',
    body:
      'Create a Twitter photo grid from one image. Preview the 2x2 layout and download numbered JPG tiles for one post.',
  }),
  'x-photo-grid': makeXPage('x-photo-grid', 'x photo grid', {
    heading: 'X Photo Grid',
    body:
      'Create an X photo grid from one source image. Split, preview, and download four ordered post tiles in your browser.',
  }),
};

export const landingPageSlugs = Object.keys(landingPages) as LandingPageSlug[];

export function getLandingPage(slug: LandingPageSlug) {
  return landingPages[slug];
}

export function getLandingMetadata(slug: LandingPageSlug): Metadata {
  const page = getLandingPage(slug);
  const url = `${SITE_URL}/${slug}`;

  return {
    title: page.title,
    description: page.description,
    alternates: {
      canonical: url,
    },
    keywords: page.keywords,
    openGraph: {
      title: page.heading,
      description: page.description,
      url,
      siteName: 'X-Grid',
      type: 'website',
    },
    twitter: {
      card: 'summary',
      title: page.heading,
      description: page.description,
    },
  };
}

function toTitleCase(value: string) {
  return value.replace(/\b\w/g, (letter) => letter.toUpperCase());
}

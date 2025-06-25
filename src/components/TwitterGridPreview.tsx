'use client';

import Image from 'next/image';
import { Button } from '@/components/ui/button';

const cartoonAvatar =
  'data:image/svg+xml;utf8,<svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="20" cy="20" r="20" fill="%23F9D423"/><ellipse cx="20" cy="25" rx="10" ry="7" fill="%23fff"/><ellipse cx="14" cy="18" rx="3" ry="4" fill="%23000"/><ellipse cx="26" cy="18" rx="3" ry="4" fill="%23000"/><ellipse cx="14" cy="19" rx="1" ry="1.5" fill="%23fff"/><ellipse cx="26" cy="19" rx="1" ry="1.5" fill="%23fff"/><ellipse cx="20" cy="28" rx="4" ry="2" fill="%23F76B1C"/></svg>';

type Props = {
  images: string[]; // Array of image URLs
  user?: {
    name: string;
    username: string;
    avatarUrl: string;
    time: string;
  };
};

const defaultUser = {
  name: 'Jane Doe',
  username: 'janedoe',
  avatarUrl: cartoonAvatar,
  time: '2h',
};

export default function TwitterGridPreview({ images, user = defaultUser }: Props) {
  return (
    <div className="max-w-xl mx-auto bg-white rounded-lg shadow p-4 border">
      {/* Fake Twitter header */}
      <div className="flex items-center gap-3 mb-3">
        <Image
          src={user.avatarUrl}
          alt="avatar"
          width={40}
          height={40}
          className="rounded-full"
        />
        <div>
          <div className="font-semibold">{user.name}</div>
          <div className="text-gray-500 text-sm">@{user.username} · {user.time}</div>
        </div>
      </div>
      {/* Fake tweet text */}
      <div className="mb-3 text-gray-800">
        Here&apos;s my new Twitter grid! #twittergrid #mosaic
      </div>
      {/* 2x2 grid */}
      <div className="grid grid-cols-2 grid-rows-2 gap-1 rounded-lg overflow-hidden border">
        {images.map((url, i) => (
          <div key={i} className="relative aspect-square bg-gray-100">
            <Image
              src={url}
              alt={`Grid part ${i + 1}`}
              fill
              style={{ objectFit: 'cover' }}
              sizes="50vw"
            />
          </div>
        ))}
      </div>
      {/* Download links */}
      <div className="mt-4 flex flex-wrap gap-2">
        {images.map((url, i) => (
          <a
            key={i}
            href={url}
            download
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button variant="outline" size="sm">
              Download Image {i + 1}
            </Button>
          </a>
        ))}
      </div>
    </div>
  );
}

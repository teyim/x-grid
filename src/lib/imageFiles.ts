export function isHeicFile(file: File) {
  return (
    file.type === 'image/heic' ||
    file.type === 'image/heif' ||
    /\.(heic|heif)$/i.test(file.name)
  );
}

export async function normalizeImageFile(file: File): Promise<Blob> {
  if (!isHeicFile(file)) return file;

  const { default: heic2any } = await import('heic2any');
  const converted = await heic2any({
    blob: file,
    toType: 'image/jpeg',
    quality: 0.92,
  });

  return Array.isArray(converted) ? converted[0] : converted;
}

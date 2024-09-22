export const getDataUriFromImageUrl = (
  imageUrl: string,
  isFallback = false
): Promise<string> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'Anonymous'; // This is important for cross-origin images

    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;

      const ctx = canvas.getContext('2d');
      ctx?.drawImage(img, 0, 0);

      const dataUri = canvas.toDataURL('image/png');
      resolve(dataUri);
    };

    img.onerror = () => {
      if (!isFallback) {
        // Recursive call with fallback image
        getDataUriFromImageUrl('assets/image-placeholder-500x500.jpg', true)
          .then(resolve)
          .catch(() =>
            reject(
              new Error('Failed to load both original and fallback images')
            )
          );
      }
      reject('Failed to load image');
    };

    img.src = imageUrl;
  });
};

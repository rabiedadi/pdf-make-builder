export const getDataUriFromImageUrl = (imageUrl: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'Anonymous'; // This is important for cross-origin images
    img.src = imageUrl;

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
      reject('Failed to load image');
    };
  });
};

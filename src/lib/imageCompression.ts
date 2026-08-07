const MAX_ADMIN_IMAGE_BYTES = 100 * 1024;

/**
 * Compress an admin-uploaded image before embedding it in a Firestore document.
 * The cap keeps catalogue, category, and banner records below Firestore's 1 MiB limit.
 */
export const compressAdminImage = (file: File): Promise<string> => new Promise((resolve, reject) => {
  const reader = new FileReader();
  reader.onerror = () => reject(new Error('Could not read the selected image.'));
  reader.onload = () => {
    const source = new Image();
    source.onerror = () => reject(new Error('Could not process the selected image.'));
    source.onload = () => {
      let maxDimension = 700;
      let quality = 0.72;

      for (let attempt = 0; attempt < 8; attempt += 1) {
        const scale = Math.min(1, maxDimension / Math.max(source.width, source.height));
        const canvas = document.createElement('canvas');
        canvas.width = Math.max(1, Math.round(source.width * scale));
        canvas.height = Math.max(1, Math.round(source.height * scale));
        const context = canvas.getContext('2d');
        if (!context) {
          reject(new Error('Your browser cannot optimise this image.'));
          return;
        }

        context.drawImage(source, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL('image/jpeg', quality);
        const estimatedBytes = Math.ceil((dataUrl.length * 3) / 4);
        if (estimatedBytes <= MAX_ADMIN_IMAGE_BYTES) {
          resolve(dataUrl);
          return;
        }

        maxDimension = Math.round(maxDimension * 0.8);
        quality = Math.max(0.35, quality - 0.06);
      }

      reject(new Error('This image is too detailed to optimise. Please choose a smaller image.'));
    };
    source.src = reader.result as string;
  };
  reader.readAsDataURL(file);
});

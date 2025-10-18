// utils/imageProcessor.ts
export async function watermarkImg(
  file: File,
  watermarkSvg: string,
  maxWidth: number = 1200,
  quality: number = 0.8
): Promise<File> {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d')!;
    const img = new Image();

    img.onload = async () => {
      let { width, height } = img;
      if (width > maxWidth) {
        height = (height * maxWidth) / width;
        width = maxWidth;
      }

      canvas.width = width;
      canvas.height = height;
      ctx.drawImage(img, 0, 0, width, height);

      const watermark = new Image();
      watermark.onload = () => {
        // Mantener la relación de aspecto original de la marca de agua
        const watermarkMaxSize = Math.min(width, height) * 0.5;
        const watermarkAspectRatio = watermark.width / watermark.height;

        let watermarkWidth, watermarkHeight;

        if (watermarkAspectRatio > 1) {
          // Marca de agua horizontal
          watermarkWidth = watermarkMaxSize;
          watermarkHeight = watermarkMaxSize / watermarkAspectRatio;
        } else {
          // Marca de agua vertical o cuadrada
          watermarkHeight = watermarkMaxSize;
          watermarkWidth = watermarkMaxSize * watermarkAspectRatio;
        }

        const x = (width - watermarkWidth) / 2;
        const y = (height - watermarkHeight) / 2;

        // Guardar estado del contexto
        ctx.save();

        // Aplicar opacidad baja
        ctx.globalAlpha = 0.3;

        // Aplicar filtro de paso alto
        ctx.filter = 'contrast(200%) brightness(110%)';

        // Dibujar marca de agua manteniendo relación de aspecto
        ctx.drawImage(watermark, x, y, watermarkWidth, watermarkHeight);

        // Restaurar contexto
        ctx.restore();

        canvas.toBlob(
          (blob) => {
            const processedFile = new File(
              [blob!],
              file.name.replace(/\.[^/.]+$/, ".webp"),
              { type: "image/webp" }
            );
            resolve(processedFile);
          },
          "image/webp",
          quality
        );
      };
      watermark.src = watermarkSvg;
    };
    img.onerror = reject;
    img.src = URL.createObjectURL(file);
  });
}
// hooks/useExportToImage.ts
import { useCallback } from 'react';
import html2canvas from 'html2canvas';

export const useExportToImage = () => {
  const exportToImage = useCallback(async (element: HTMLElement, fileName: string = 'card') => {
    try {
      const canvas = await html2canvas(element, {
        backgroundColor: '#ffffff',
        scale: 2,
        useCORS: true,
        allowTaint: false,
        logging: false,
        width: element.scrollWidth,
        height: element.scrollHeight,
        onclone: (clonedDoc) => {
          // Garantir que todos os estilos sejam aplicados no clone
          const clonedElement = clonedDoc.querySelector(`[data-exporting="true"]`);
          if (clonedElement) {
            clonedElement.setAttribute('data-exporting', 'false');
          }
        }
      });

      const image = canvas.toDataURL('image/png', 1.0);
      
      const link = document.createElement('a');
      link.download = `${fileName}-${new Date().getTime()}.png`;
      link.href = image;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      return image;
    } catch (error) {
      console.error('Erro ao exportar imagem:', error);
      throw new Error('Falha ao exportar imagem');
    }
  }, []);

  return { exportToImage };
};
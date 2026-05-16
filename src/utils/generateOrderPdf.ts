import { jsPDF } from 'jspdf';
import type { ProductSnapshot } from './productSnapshotRegistry';

type GenerateOrderPdfParams = {
  snapshots?: ProductSnapshot[];
};

type LoadedImage = {
  width: number;
  height: number;
};

function loadImageDimensions(imageSource: string) {
  return new Promise<LoadedImage>((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve({ width: image.width, height: image.height });
    image.onerror = () => reject(new Error('Snapshot-Bild konnte nicht geladen werden.'));
    image.src = imageSource;
  });
}

export async function generateOrderPdf({ snapshots = [] }: GenerateOrderPdfParams = {}) {
  const pdf = new jsPDF({ format: 'a4', unit: 'mm', orientation: 'portrait' });
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const margin = 18;

  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(20);
  pdf.text('Technische Produktdokumentation', margin, 22);

  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(11);
  pdf.text(`Datum: ${new Date().toLocaleDateString('de-DE')}`, margin, 34);
  pdf.text('Bestellnummer: {{ORDER_NUMBER}}', margin, 42);
  pdf.text('Kunde: {{CUSTOMER_NAME}}', margin, 50);
  pdf.text('Interne Produkt-ID: {{INTERNAL_PRODUCT_ID}}', margin, 58);

  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(13);
  pdf.text('Konfigurationswerte', margin, 74);

  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(11);
  const configLines = [
    '{{PRODUCT_NAME}}',
    '{{WIDTH}}',
    '{{HEIGHT}}',
    '{{DEPTH}}',
    '{{MATERIAL}}',
    '{{COLOR}}',
    '{{PRICE}}',
    '{{CONFIG_ID}}',
  ];

  configLines.forEach((line, index) => {
    pdf.text(line, margin, 84 + (index * 8));
  });

  if (snapshots.length === 0) {
    pdf.setTextColor(120, 120, 120);
    pdf.text('Es konnten keine Modellansichten erzeugt werden. Die PDF enthält nur die Übersicht.', margin, 162);
    pdf.setTextColor(0, 0, 0);
  }

  for (const snapshot of snapshots) {
    pdf.addPage('a4', 'portrait');
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(18);
    pdf.text(snapshot.name, margin, 20);

    try {
      // Jede Ansicht wird proportional in das A4-Layout eingepasst, damit nichts abgeschnitten wird.
      const imageSize = await loadImageDimensions(snapshot.image);
      const usableWidth = pageWidth - (margin * 2);
      const usableHeight = pageHeight - 40;
      const scale = Math.min(usableWidth / imageSize.width, usableHeight / imageSize.height);
      const renderedWidth = imageSize.width * scale;
      const renderedHeight = imageSize.height * scale;
      const x = (pageWidth - renderedWidth) / 2;
      const y = 30 + ((usableHeight - renderedHeight) / 2);

      pdf.addImage(snapshot.image, 'PNG', x, y, renderedWidth, renderedHeight, undefined, 'FAST');
    } catch (imageError) {
      console.error(`PDF-Seite für ${snapshot.name} konnte nicht erstellt werden.`, imageError);
      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(11);
      pdf.text('Diese Ansicht konnte nicht in die PDF eingebettet werden.', margin, 36);
    }
  }

  pdf.save(`technische-produktdokumentation-${Date.now()}.pdf`);
  return pdf;
}
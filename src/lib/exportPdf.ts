import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";

const A4_WIDTH_MM = 210;
const A4_HEIGHT_MM = 297;

export async function exportToPdf(element: HTMLElement, filename: string) {
  const canvas = await html2canvas(element, {
    scale: 2,
    useCORS: true,
    logging: false,
    backgroundColor: "#ffffff",
  });

  const imgWidth = A4_WIDTH_MM;
  const imgHeight = (canvas.height * A4_WIDTH_MM) / canvas.width;

  const pdf = new jsPDF("p", "mm", "a4");
  let position = 0;

  if (imgHeight <= A4_HEIGHT_MM) {
    pdf.addImage(canvas.toDataURL("image/png"), "PNG", 0, 0, imgWidth, imgHeight);
  } else {
    let remainingHeight = imgHeight;
    while (remainingHeight > 0) {
      if (position > 0) pdf.addPage();

      const sourceY = (position * canvas.height) / imgHeight;
      const sourceHeight = (A4_HEIGHT_MM * canvas.height) / imgHeight;

      const pageCanvas = document.createElement("canvas");
      pageCanvas.width = canvas.width;
      pageCanvas.height = Math.min(sourceHeight, canvas.height - sourceY);
      const ctx = pageCanvas.getContext("2d");
      if (ctx) {
        ctx.drawImage(
          canvas,
          0,
          sourceY,
          canvas.width,
          pageCanvas.height,
          0,
          0,
          canvas.width,
          pageCanvas.height,
        );
      }

      const pageImgHeight = (pageCanvas.height * A4_WIDTH_MM) / pageCanvas.width;
      pdf.addImage(pageCanvas.toDataURL("image/png"), "PNG", 0, 0, imgWidth, pageImgHeight);

      position += A4_HEIGHT_MM;
      remainingHeight -= A4_HEIGHT_MM;
    }
  }

  pdf.save(`${filename}.pdf`);
}

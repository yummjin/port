// Client-only PDF helpers: page thumbnails via pdf.js, merging via pdf-lib.
// Both libraries are imported lazily so they stay out of the initial bundle.

export type PageRef = { fileId: string; pageIndex: number };

export async function renderThumbnails(
  bytes: ArrayBuffer,
  width = 240,
): Promise<string[]> {
  const pdfjs = await import("pdfjs-dist");
  // Copied from node_modules/pdfjs-dist/build so it works with both webpack and
  // Turbopack. Keep it in sync with the pinned pdfjs-dist version.
  pdfjs.GlobalWorkerOptions.workerSrc = "/pdfjs/pdf.worker.min.mjs";

  // pdf.js takes ownership of the buffer it is given, so pass a copy.
  const pdf = await pdfjs.getDocument({ data: bytes.slice(0) }).promise;
  const thumbnails: string[] = [];
  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const base = page.getViewport({ scale: 1 });
    const viewport = page.getViewport({ scale: width / base.width });
    const canvas = document.createElement("canvas");
    canvas.width = Math.ceil(viewport.width);
    canvas.height = Math.ceil(viewport.height);
    const context = canvas.getContext("2d");
    if (!context) throw new Error("Canvas 2D context is not available.");
    await page.render({ canvasContext: context, viewport }).promise;
    thumbnails.push(canvas.toDataURL("image/jpeg", 0.8));
    page.cleanup();
  }
  await pdf.destroy();
  return thumbnails;
}

export async function countPages(bytes: ArrayBuffer): Promise<number> {
  const { PDFDocument } = await import("pdf-lib");
  const doc = await PDFDocument.load(bytes, { ignoreEncryption: true });
  return doc.getPageCount();
}

export async function buildPdf(
  files: Map<string, ArrayBuffer>,
  pages: PageRef[],
): Promise<Uint8Array> {
  const { PDFDocument } = await import("pdf-lib");
  const output = await PDFDocument.create();
  const sources = new Map<
    string,
    Awaited<ReturnType<typeof PDFDocument.load>>
  >();

  for (const { fileId, pageIndex } of pages) {
    let source = sources.get(fileId);
    if (!source) {
      const bytes = files.get(fileId);
      if (!bytes) throw new Error(`Missing file ${fileId}`);
      source = await PDFDocument.load(bytes, { ignoreEncryption: true });
      sources.set(fileId, source);
    }
    const [copied] = await output.copyPages(source, [pageIndex]);
    output.addPage(copied);
  }

  return output.save();
}

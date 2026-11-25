// Adapter between the image editor playground and the HTML→image library.
// The editor only calls `composeToPng`; swap the body for the library under
// development. The current body is a minimal SVG foreignObject baseline.

export type ComposeOptions = {
  width: number;
  height: number;
  pixelRatio?: number;
  /** Elements matching this selector are dropped from the output. */
  ignoreSelector?: string;
};

export type ComposeResult = {
  dataUrl: string;
  durationMs: number;
};

export async function composeToPng(
  node: HTMLElement,
  {
    width,
    height,
    pixelRatio = 2,
    ignoreSelector = "[data-compose-ignore]",
  }: ComposeOptions,
): Promise<ComposeResult> {
  const started = performance.now();

  const clone = node.cloneNode(true) as HTMLElement;
  inlineStyles(node, clone);
  clone.querySelectorAll(ignoreSelector).forEach((el) => el.remove());
  clone.setAttribute("xmlns", "http://www.w3.org/1999/xhtml");
  clone.style.margin = "0";

  const markup = new XMLSerializer().serializeToString(clone);
  const svg =
    `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}">` +
    `<foreignObject x="0" y="0" width="100%" height="100%">${markup}</foreignObject>` +
    `</svg>`;

  const image = await loadImage(
    `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`,
  );

  const canvas = document.createElement("canvas");
  canvas.width = width * pixelRatio;
  canvas.height = height * pixelRatio;
  const context = canvas.getContext("2d");
  if (!context) throw new Error("Canvas 2D context is not available.");
  context.scale(pixelRatio, pixelRatio);
  context.drawImage(image, 0, 0, width, height);

  return {
    dataUrl: canvas.toDataURL("image/png"),
    durationMs: performance.now() - started,
  };
}

function inlineStyles(source: Element, target: Element) {
  const computed = getComputedStyle(source);
  const style = (target as HTMLElement).style;
  if (style) {
    for (let i = 0; i < computed.length; i++) {
      const property = computed[i];
      style.setProperty(
        property,
        computed.getPropertyValue(property),
        computed.getPropertyPriority(property),
      );
    }
  }
  const sourceChildren = source.children;
  const targetChildren = target.children;
  for (let i = 0; i < sourceChildren.length; i++) {
    inlineStyles(sourceChildren[i], targetChildren[i]);
  }
}

function loadImage(src: string) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error("Failed to rasterize the SVG."));
    image.src = src;
  });
}

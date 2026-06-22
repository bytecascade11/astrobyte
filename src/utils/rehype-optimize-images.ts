import { visit } from "unist-util-visit";

const BREAKPOINTS = [400, 640, 750, 828, 1080, 1200, 1920];

const buildUrl = (src: string, w: number): string =>
  `/_vercel/image?url=${encodeURIComponent(src)}&w=${w}&q=75`;

export function rehypeOptimizeImages() {
  return (tree: any) => {
    visit(tree, "element", (node: any) => {
      if (node.tagName !== "img") return;

      const src = node.properties?.src;
      if (!src || typeof src !== "string" || src.startsWith("http")) return;

      node.properties.src = buildUrl(src, 1080);
      node.properties.srcSet = BREAKPOINTS.map(
        (w: number) => `${buildUrl(src, w)} ${w}w`
      ).join(", ");
      node.properties.sizes = "(min-width: 768px) 768px, 100vw";
      node.properties.loading = "lazy";
      node.properties.decoding = "async";
    });
  };
}

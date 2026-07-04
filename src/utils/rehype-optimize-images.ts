import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

// Simple tree walker — avoids needing unist-util-visit as an extra dependency
function visit(node: any, test: (n: any) => boolean, visitor: (n: any) => void) {
  if (test(node)) visitor(node);
  if (node.children) {
    for (const child of node.children) {
      visit(child, test, visitor);
    }
  }
}

export function rehypeOptimizeImages() {
  return async (tree: any) => {
    const imgNodes: any[] = [];
    visit(
      tree,
      (n) => n.type === "element" && n.tagName === "img",
      (n) => imgNodes.push(n)
    );

    for (const node of imgNodes) {
      const props = node.properties || (node.properties = {});
      const src = props.src as string | undefined;
      if (!src) continue;

      // Already has explicit dimensions — skip
      if (props.width && props.height) continue;

      // Skip external/remote images — can't safely read their file dimensions at build time
      if (/^https?:\/\//.test(src)) continue;

      try {
        const cleanSrc = src.split("?")[0].split("#")[0];
        const filePath = path.join(
          process.cwd(),
          "public",
          cleanSrc.replace(/^\//, "")
        );
        if (!fs.existsSync(filePath)) continue;

        const metadata = await sharp(filePath).metadata();
        if (metadata.width && metadata.height) {
          props.width = metadata.width;
          props.height = metadata.height;
        }
      } catch {
        // Never break the build over one bad image — just skip it
        continue;
      }

      props.loading = props.loading || "lazy";
      props.decoding = "async";

      const existingStyle = (props.style as string) || "";
      props.style = `${existingStyle} max-width:100%; height:auto; border-radius:12px;`.trim();
    }
  };
}

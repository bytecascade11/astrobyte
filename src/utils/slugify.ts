import kebabcase from "lodash.kebabcase";

/**
 * Convert a string to kebab-case slug
 * Example: "Hello World" -> "hello-world"
 */
export const slugifyStr = (str: string) => kebabcase(str);

/**
 * Convert an array of strings to kebab-case slugs
 */
export const slugifyAll = (arr: string[]) => arr.map(str => slugifyStr(str));

/**
 * Strip date prefix from filenames like "2026-01-11-my-post.md" -> "my-post"
 */
export const stripDatePrefix = (filename: string) => filename.replace(/^\d{4}-\d{2}-\d{2}-/, "");


import { defineMiddleware } from "astro:middleware";

export const onRequest = defineMiddleware((context, next) => {
  const url = context.url;

  if (url.hostname === "astrobyte.okesunday503.workers.dev") {
    const destination = new URL(url);
    destination.hostname = "www.revibyte.blog";
    destination.protocol = "https:";

    return context.redirect(destination.toString(), 301);
  }

  return next();
});

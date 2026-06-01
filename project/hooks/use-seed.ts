import { useState } from "react";

/**
 * As we currenlty do not have a recomendation algorithm, we use a random seed instead,
 * so that the feed are shuffled differently each time the page is loaded.
 *
 * use this hook to get a random seed for shuffling the feed.
 */
export function useSeed() {
  const [seed] = useState(() => Math.floor(Math.random() * 1_000_000));

  return seed;
}

import { Text } from "@/components/ui/text";
import { normalizeText } from "@/lib/string";

type HighlightedTextProps = {
  query: string;
  word: string;
};

/**
 * Highlights a query match in a string
 * if my query is "foo" and my state is "foobar", this will highlight "foo" in "foobar"
 */
export function HighlightedText({ query, word }: HighlightedTextProps) {
  const normalizedState = normalizeText(word);
  const normalizedQuery = normalizeText(query);
  const matchIndex = normalizedState.indexOf(normalizedQuery);

  if (matchIndex === -1) {
    return <Text>{word}</Text>;
  }

  const before = word.slice(0, matchIndex);
  const match = word.slice(matchIndex, matchIndex + query.length);
  const after = word.slice(matchIndex + query.length);

  return (
    <Text>
      {before}
      <Text color="title" fontWeight="600">
        {match}
      </Text>
      {after}
    </Text>
  );
}

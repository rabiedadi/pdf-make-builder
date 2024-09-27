export function uuid() {
  return Math.random()
    .toString(36)
    .replace(/[^a-z]+/g, '');
}

type TextElement = string | { text: string; bold?: boolean };

export function parseBoldText(input: string): TextElement[] | string {
  const boldRegex = /\*\*(.*?)\*\*/;

  // Split the input text by the bold pattern
  const parts = input.split(boldRegex);

  // If there are no bold parts, return the plain text
  if (parts.length === 1) {
    return input;
  }

  let result: TextElement[] = [];

  parts.forEach((part, index) => {
    // If the index is odd, it's a bold text, otherwise plain text
    if (index % 2 === 1) {
      result.push({ text: part, bold: true });
    } else if (part) {
      result.push(part);
    }
  });

  return result.filter((r) => !!r);
}

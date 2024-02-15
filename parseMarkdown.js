function parseMarkdown(markdownText) {
  let inCodeBlock = false;
  let htmlText = "";

  markdownText.split("\n").forEach((line) => {
    if (line.startsWith("```")) {
      inCodeBlock = !inCodeBlock;
      htmlText += inCodeBlock ? "<pre><code>" : "</code></pre>\n";
      return;
    }

    if (inCodeBlock) {
      htmlText += line + "\n";
      return;
    }

    // Process markdown outside of code blocks
    if (line.startsWith("# ")) {
      htmlText += `<h1>${line.substring(2)}</h1>\n`;
    } else if (line.startsWith("## ")) {
      htmlText += `<h2>${line.substring(3)}</h2>\n`;
    } else if (line.startsWith("### ")) {
      htmlText += `<h2>${line.substring(4)}</h3>\n`;
    } else {
      // Apply markdown transformations for bold, italic, and links
      line = line
        .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
        .replace(/\*(.*?)\*/g, "<em>$1</em>")
        .replace(
          /\[([^\]]+)\]\(([^)]+)\)/g,
          '<a href="$2" target="_blank" rel="noreferrer noopener">$1</a>'
        );

      if (line) {
        htmlText += `<p>${line}</p>\n`;
      }
    }
  });

  return htmlText;
}

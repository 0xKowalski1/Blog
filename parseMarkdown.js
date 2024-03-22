const parseMarkdown = (markdownText) => {
  let inCodeBlock = false;
  let listType = null; // 'ul' for unordered, 'ol' for ordered, null when not in a list
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

    // Handle ordered list items
    if (/^\d+\. /.test(line)) {
      if (listType !== 'ol') {
        if (listType === 'ul') {
          htmlText += "</ul>\n"; // Close previous unordered list
        }
        htmlText += "<ol>\n";
        listType = 'ol';
      }
      htmlText += `<li>${line.substring(line.indexOf(' ') + 1)}</li>\n`;
    } else if (line.startsWith("- ")) {
      if (listType !== 'ul') {
        if (listType === 'ol') {
          htmlText += "</ol>\n"; // Close previous ordered list
        }
        htmlText += "<ul>\n";
        listType = 'ul';
      }
      htmlText += `<li>${line.substring(2)}</li>\n`;
    } else {
      if (listType) {
        // We were in a list but this line is not a list item, so close the list
        htmlText += listType === 'ol' ? "</ol>\n" : "</ul>\n";
        listType = null;
      }

      // Process markdown outside of code blocks and lists
      if (line.startsWith("# ")) {
        htmlText += `<h1>${line.substring(2)}</h1>\n`;
      } else if (line.startsWith("## ")) {
        htmlText += `<h2>${line.substring(3)}</h2>\n`;
      } else if (line.startsWith("### ")) {
        htmlText += `<h3>${line.substring(4)}</h3>\n`;
      } else {
        // Apply markdown transformations for bold, italic, and links
        line = line
          .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
          .replace(/\*(.*?)\*/g, "<em>$1</em>")
          .replace(
            /\[([^\]]+)\]\(([^)]+)\)/g,
            '<a href="$2" target="_blank" rel="noreferrer noopener">$1</a>'
          );

        if (line.trim() === '') {
          // This line is empty, add a new line
          htmlText += '<p>&nbsp;</p>\n';
        } else {
          htmlText += `<p>${line}</p>\n`;
        }
      }
    }
  });

  // Close the list if the text ends while still in a list
  if (listType) {
    htmlText += listType === 'ol' ? "</ol>\n" : "</ul>\n";
  }

  return htmlText;
};


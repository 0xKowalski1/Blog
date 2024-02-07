# Lean Blog

## Build
```
docker build -t blog .
```

## Run
```
docker run -d -p 8080:80 blog
```

## Dev
```
docker run -d -p 8080:80 --name dev-blog -v $(pwd)/src:/usr/share/nginx/html -v $(pwd)/blogs:/usr/share/nginx/html/blogs nginx:alpine
```

## Markdown Style Guide

### Headings

- Use `#` for main headings.
- Use `##` for subheadings.
- Use `###` for even smaller subheadings.

### Paragraphs

- Write paragraphs as plain text. Separate paragraphs with a blank line.

### Bold and Italic Text

- Use `**text**` for **bold** text.
- Use `*text*` for *italic* text.

### Links

- Format links as `[link text](URL)`. Links will open in a new tab.

### Code Blocks

- Enclose code blocks with triple backticks (```).

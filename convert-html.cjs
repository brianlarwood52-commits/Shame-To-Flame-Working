const fs = require('fs');
const { convert } = require('html-to-markdown');

const inputFile = 'C:/Users/miami/Downloads/new-mainxx/html_input/about.html';  // ← change to your real input HTML file
const outputFile = 'C:/Users/miami/Downloads/new-mainxx/content/pages/about.mdx';  // ← change to where you want the MDX saved
const html = fs.readFileSync(inputFile, 'utf8');
const markdown = convert(html);

// Add basic frontmatter (customize as needed)
const mdxContent = `---
title: About Page
slug: about
---

${markdown}`;

fs.writeFileSync(outputFile, mdxContent, 'utf8');
console.log('Conversion complete! File saved to:', outputFile);
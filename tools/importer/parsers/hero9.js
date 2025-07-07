/* global WebImporter */
export default function parse(element, { document }) {
  // 1. Header row: block name exactly
  const headerRow = ['Hero (hero9)'];

  // 2. Image row: any <picture> or <img> under the element
  let imageCell = '';
  const picture = element.querySelector('picture');
  if (picture) {
    imageCell = picture;
  } else {
    const img = element.querySelector('img');
    if (img) imageCell = img;
  }

  // 3. Text row: gather all hero text and visible headings in order
  // Collect all .blte-hero__text and .blte-title__wrapper in document order
  const textContent = [];
  const walker = document.createTreeWalker(element, NodeFilter.SHOW_ELEMENT, null);
  let currentNode = walker.currentNode;
  while(currentNode) {
    if (
      currentNode.classList &&
      (currentNode.classList.contains('blte-hero__text') ||
       currentNode.classList.contains('blte-title__wrapper'))
    ) {
      textContent.push(currentNode);
    }
    currentNode = walker.nextNode();
  }
  // If no text content found, fallback to any h1/h2/h3/h4/h5/h6/p in order
  if (textContent.length === 0) {
    element.querySelectorAll('h1,h2,h3,h4,h5,h6,p').forEach(e => textContent.push(e));
  }

  // Final fallback: if still nothing, use all divs (should never happen, but just in case)
  if (textContent.length === 0) {
    element.querySelectorAll('div').forEach(e => textContent.push(e));
  }

  // Assemble table structure
  const cells = [
    headerRow,
    [imageCell],
    [textContent]
  ];

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}

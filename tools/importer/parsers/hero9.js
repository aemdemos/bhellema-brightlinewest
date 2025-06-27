/* global WebImporter */
export default function parse(element, { document }) {
  // Header row: must match exactly
  const headerRow = ['Hero (hero9)'];

  // 1. IMAGE ROW
  // Look for hero block with an image or picture
  let imageCell = '';
  const hero = element.querySelector('.blte-hero');
  if (hero) {
    // Try to find picture (with sources and img) for full image semantics
    const pic = hero.querySelector('.blte-hero__image picture');
    if (pic) {
      imageCell = pic;
    } else {
      // fallback: just img
      const img = hero.querySelector('.blte-hero__image img');
      if (img) imageCell = img;
    }
  }
  // Additional fallback: picture/img anywhere
  if (!imageCell) {
    const pic = element.querySelector('picture');
    if (pic) imageCell = pic;
    else {
      const img = element.querySelector('img');
      if (img) imageCell = img;
    }
  }
  const imageRow = [imageCell];

  // 2. CONTENT ROW
  // We want to capture all headings, subheadings, and styled text in the hero area and the .blte-title
  // We'll build an array of elements, referencing originals only
  const contentParts = [];

  // a. Get any badge/subheading from the hero text
  if (hero) {
    // Grab the entire text block for flexibility
    const heroText = hero.querySelector('.blte-hero__text');
    if (heroText) {
      // Get all children that are elements or text nodes with content
      Array.from(heroText.childNodes).forEach(node => {
        if (node.nodeType === Node.ELEMENT_NODE) {
          contentParts.push(node);
        } else if (node.nodeType === Node.TEXT_NODE && node.textContent.trim()) {
          // Wrap text node in a span to preserve structure
          const span = document.createElement('span');
          span.textContent = node.textContent;
          contentParts.push(span);
        }
      });
    }
  }

  // b. Get the .blte-title (usually a heading below the image)
  const title = element.querySelector('.blte-title');
  if (title) {
    contentParts.push(title);
  }

  // c. Edge case: if nothing captured, try to get all headings and paragraphs inside element
  if (contentParts.length === 0) {
    const fallbackElems = element.querySelectorAll('h1, h2, h3, h4, h5, h6, p, b, strong');
    if (fallbackElems.length > 0) {
      fallbackElems.forEach(e => contentParts.push(e));
    }
  }

  // d. Ensure we have at least an empty string so the cell exists
  const contentRow = [contentParts.length ? contentParts : ['']];

  // Compose block table
  const cells = [headerRow, imageRow, contentRow];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}

/* global WebImporter */
export default function parse(element, { document }) {
  // 1. Find the .blte-hero section for the image
  let imageEl = null;
  const hero = element.querySelector('.blte-hero');
  if (hero) {
    // Use the <picture> or <img> inside the hero
    imageEl = hero.querySelector('picture') || hero.querySelector('img');
  }
  if (!imageEl) {
    // fallback to empty div if not found
    imageEl = document.createElement('div');
  }

  // 2. Gather the title (first h1 inside hero or its descendants)
  // and all relevant hero text and CTAs below or near the hero
  // We'll find all headings (h1-h6) and any .blte-text, .blte-text__wrapper elements in order
  const contentElements = [];

  // Find all h1-h6 inside the hero area
  if (hero) {
    const headingEls = hero.querySelectorAll('h1, h2, h3, h4, h5, h6');
    headingEls.forEach(h => {
      if (h.textContent.trim().length > 0) {
        contentElements.push(h);
      }
    });
  }

  // Find any text blocks after the hero section
  // Scan for .blte-text__wrapper or .blte-text in the main element, but outside .blte-hero
  // Only add if it has content
  const textBlocks = [];
  element.querySelectorAll('.blte-text__wrapper, .blte-text').forEach(el => {
    // Don't include if it's a descendant of .blte-hero
    if (!hero || !hero.contains(el)) {
      if (el.textContent.trim().length > 0) {
        textBlocks.push(el);
      }
    }
  });
  if (textBlocks.length > 0) {
    contentElements.push(...textBlocks);
  }

  // If nothing found, add a blank div for safety
  if (contentElements.length === 0) {
    contentElements.push(document.createElement('div'));
  }

  // Compose the table: 1 col, 3 rows per requirements
  const cells = [
    ['Hero (hero38)'],
    [imageEl],
    [contentElements]
  ];

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}

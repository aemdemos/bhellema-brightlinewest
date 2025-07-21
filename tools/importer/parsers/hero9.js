/* global WebImporter */
export default function parse(element, { document }) {
  // 1. Extract the hero image element (prefer <picture> img inside .blte-hero)
  let heroImg = null;
  const hero = element.querySelector('.blte-hero');
  if (hero) {
    const picImg = hero.querySelector('picture img');
    if (picImg) heroImg = picImg;
    else {
      const anyImg = hero.querySelector('img');
      if (anyImg) heroImg = anyImg;
    }
  }
  if (!heroImg) {
    // fallback to first img in element
    heroImg = element.querySelector('picture img, img');
  }

  // 2. Extract all text content for the text cell (capture both overlay and below-image titles)
  // Collect potential text blocks in display order
  const textContentBlocks = [];

  // a) Overlay hero text (e.g., the "Press Releases" overlay)
  if (hero) {
    const heroText = hero.querySelector('.blte-hero__text');
    if (heroText) textContentBlocks.push(heroText);
  }

  // b) Title below the hero image (e.g., main <h1> title in .blte-title__wrapper)
  // Find all .blte-title__wrapper inside the element in DOM order (even if outside hero)
  const titleWrappers = element.querySelectorAll('.blte-title__wrapper');
  titleWrappers.forEach((el) => {
    // Avoid duplicates (should never overlap with .blte-hero__text)
    textContentBlocks.push(el);
  });

  // c) If nothing found, fallback to all h1/h2/h3/b/p directly under element
  if (textContentBlocks.length === 0) {
    const basics = element.querySelectorAll('h1, h2, h3, b, p, span');
    if (basics.length > 0) {
      // Add all to a div to keep order
      const div = document.createElement('div');
      basics.forEach((el) => div.appendChild(el));
      textContentBlocks.push(div);
    }
  }

  // If still nothing, fallback to the whole element
  if (textContentBlocks.length === 0) {
    textContentBlocks.push(element);
  }

  // 3. Prepare the table rows as per spec
  const rows = [];
  // Header row
  rows.push(['Hero (hero9)']);
  // Image row (single cell)
  rows.push([heroImg || '']);
  // Text row (all collected blocks in DOM order)
  // Only one cell: if multiple blocks, pass as array for cell content
  rows.push([textContentBlocks.length === 1 ? textContentBlocks[0] : textContentBlocks]);

  // 4. Create and replace
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}

/* global WebImporter */
export default function parse(element, { document }) {
  // Header row as per requirements
  const headerRow = ['Hero (hero36)'];

  // --- Extract the background image element from the hero block ---
  let imageEl = null;
  // Try to find an <img> (the background/hero image)
  const heroImage = element.querySelector('.blte-hero__image img');
  if (heroImage) imageEl = heroImage;

  // --- Extract all text content for the hero block ---
  // 1. All elements inside the .blte-hero__text area
  const textEls = [];
  const heroText = element.querySelector('.blte-hero__text');
  if (heroText) {
    // Only consider direct children with meaningful text (e.g. h1, h2, etc)
    Array.from(heroText.children).forEach(el => {
      if (el.textContent && el.textContent.trim().length > 0) {
        textEls.push(el);
      }
    });
  }
  // 2. Any additional title/heading below the hero (e.g. .blte-title__wrapper)
  const extraTitle = element.querySelector('.blte-title__wrapper');
  if (extraTitle) {
    Array.from(extraTitle.children).forEach(el => {
      if (el.textContent && el.textContent.trim().length > 0) {
        textEls.push(el);
      }
    });
  }

  // --- Compose table rows ---
  // Row 2: hero image (may be null, that's OK)
  const imageRow = [imageEl];
  // Row 3: all text elements, as an array (will be flattened by createTable)
  const textRow = [textEls.length > 0 ? textEls : ''];

  // Create the table
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    imageRow,
    textRow
  ], document);

  // Replace the original element
  element.replaceWith(table);
}

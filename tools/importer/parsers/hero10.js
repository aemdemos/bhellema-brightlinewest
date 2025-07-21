/* global WebImporter */
export default function parse(element, { document }) {
  // Header row: exact name as in the spec
  const headerRow = ['Hero (hero10)'];

  // Row 2: Background image (picture/img)
  // Accept the first <picture> or <img> found within the element
  let backgroundMedia = element.querySelector('picture');
  if (!backgroundMedia) {
    backgroundMedia = element.querySelector('img');
  }
  const row2 = [backgroundMedia ? backgroundMedia : ''];

  // Row 3: All hero and headline text content
  // Collect all possible headline and hero text containers
  const textContent = [];

  // Overlay hero text (e.g., 'Press Releases' in the colored overlay)
  const heroOverlayText = element.querySelector('.blte-hero__text');
  if (heroOverlayText) textContent.push(heroOverlayText);

  // Below-image large headline (e.g., '.blte-title__wrapper')
  const belowImageHeadline = element.querySelector('.blte-title__wrapper');
  if (belowImageHeadline) textContent.push(belowImageHeadline);

  // Fallback: If neither found, look for prominent headings in the structure
  if (textContent.length === 0) {
    // Try to grab h1/h2/h3 directly underneath the main container
    const headings = element.querySelectorAll('h1, h2, h3, h4, p');
    headings.forEach((h) => textContent.push(h));
  }

  const row3 = [textContent.length ? textContent : ''];

  // Compose the table
  const cells = [headerRow, row2, row3];

  // Create and replace the block
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}

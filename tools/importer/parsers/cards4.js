/* global WebImporter */
export default function parse(element, { document }) {
  // Prepare table header exactly as in the example
  const headerRow = ['Cards (cards4)'];
  const rows = [];
  // Each <li> is a card
  element.querySelectorAll(':scope > li').forEach((li) => {
    // --- IMAGE CELL (always present) ---
    let imageCell = '';
    const imageContainer = li.querySelector('.blte-teaser-v2__image');
    if (imageContainer) {
      // Use the <picture> element directly if present, else fallback to <img>
      const picture = imageContainer.querySelector('picture');
      if (picture) {
        imageCell = picture;
      } else {
        const img = imageContainer.querySelector('img');
        if (img) imageCell = img;
      }
    }
    // --- TEXT CELL (should contain all text content: title, date, description, link) ---
    // Reference '.blte-teaser-v2__content' directly to preserve formatting and content structure
    let textCellContent = '';
    const contentContainer = li.querySelector('.blte-teaser-v2__content');
    if (contentContainer) {
      textCellContent = contentContainer;
    } else {
      // Fallback: get all text from the card
      textCellContent = document.createElement('div');
      textCellContent.textContent = li.textContent;
    }
    // Each row is [image, text content]
    rows.push([imageCell, textCellContent]);
  });
  // Assemble the table structure
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    ...rows
  ], document);
  // Replace the original element
  element.replaceWith(table);
}

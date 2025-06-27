/* global WebImporter */
export default function parse(element, { document }) {
  // Get columns (should always be 2 columns for this block)
  const columns = element.querySelectorAll(':scope > div');
  if (columns.length !== 2) return;

  // --- LEFT COLUMN ---
  // This is a div with a background-image, must convert to an <img>
  let imageElem = null;
  const style = columns[0].getAttribute('style') || '';
  const bgMatch = style.match(/background-image:\s*url\(["']?([^"')]+)["']?\)/i);
  if (bgMatch && bgMatch[1]) {
    imageElem = document.createElement('img');
    imageElem.src = bgMatch[1];
    imageElem.alt = '';
  } else {
    // Fallback: If no img found, leave empty cell
    imageElem = '';
  }

  // --- RIGHT COLUMN ---
  // This is the newsletter form and heading etc.
  // Preserve the entire content of the right column
  // Do not clone, just reference the element directly
  let rightContent = columns[1];
  // If there's only one child in rightContent, use it for a cleaner block
  let rightBlock;
  if (rightContent.children.length === 1) {
    rightBlock = rightContent.firstElementChild;
  } else {
    rightBlock = rightContent;
  }

  // Block table: header row, then content row with [image, form content]
  const headerRow = ['Columns (columns18)'];
  const contentRow = [imageElem, rightBlock];
  const cells = [headerRow, contentRow];

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}

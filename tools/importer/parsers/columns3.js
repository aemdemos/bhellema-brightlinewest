/* global WebImporter */
export default function parse(element, { document }) {
  // Find the carousel items list
  const itemsList = element.querySelector('ul.blte-features-grid__items');
  if (!itemsList) return;
  // Find all feature items (columns)
  const items = Array.from(itemsList.querySelectorAll(':scope > li.blte-feature-item'));
  if (items.length === 0) return;

  // Build the header row so it is exactly one cell (spanning all columns)
  // This is achieved by making the header row an array with a single element
  const headerRow = ['Columns (columns3)'];
  // Build the content row: one cell per feature item (column)
  const contentRow = items.map((item) => {
    // Reference the feature content div directly
    const content = item.querySelector('.blte-feature-item__content');
    return content || '';
  });

  const rows = [headerRow, contentRow];
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}

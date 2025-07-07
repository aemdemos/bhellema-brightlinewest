/* global WebImporter */
export default function parse(element, { document }) {
  // The header row must be a single cell/column
  const headerRow = ['Columns (columns17)'];

  // The second row must have as many columns as there are features
  const items = Array.from(element.querySelectorAll(':scope > li'));
  const columnsRow = items.map(li => {
    // Prefer the specific content block if present
    const content = li.querySelector('.blte-feature-item__content');
    return content || li;
  });

  // Only proceed if there are columns
  if (columnsRow.length === 0) return;

  // Build block table: first row is single header, second is N columns
  const rows = [headerRow, columnsRow];
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}

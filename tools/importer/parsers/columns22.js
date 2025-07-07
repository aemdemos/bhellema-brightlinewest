/* global WebImporter */
export default function parse(element, { document }) {
  // Find the grid containing the columns
  const grid = element.querySelector('.aem-Grid');
  if (!grid) return;

  // Extract each column wrapper
  const columnWrappers = Array.from(grid.children).filter(child => child.classList.contains('blte-teaser__wrapper'));

  // Build the table rows: single header cell, then one row with all columns
  const headerRow = ['Columns (columns22)'];
  const columnsRow = columnWrappers; // each column gets a cell

  const table = WebImporter.DOMUtils.createTable([headerRow, columnsRow], document);
  element.replaceWith(table);
}

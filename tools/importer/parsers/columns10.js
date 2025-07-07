/* global WebImporter */
export default function parse(element, { document }) {
  // Find the left and right column containers
  const left = element.querySelector('.blte-footer__first-row-left');
  const right = element.querySelector('.blte-footer__first-row-right');

  // Get all left columns
  let leftColumns = [];
  if (left) {
    leftColumns = Array.from(left.querySelectorAll(':scope > .blte-footer__first-row-left-column'));
  }

  // The right side is a single column (if present)
  let rightColumn = null;
  if (right) {
    rightColumn = right;
  }

  // Compose the second row: each column's root element as a cell
  const secondRow = [];
  leftColumns.forEach(col => secondRow.push(col));
  if (rightColumn) {
    secondRow.push(rightColumn);
  }

  // The header row must contain exactly one cell
  const headerRow = ['Columns (columns10)'];

  // Only create the table if there's at least one column for the second row
  if (secondRow.length > 0) {
    const table = WebImporter.DOMUtils.createTable([
      headerRow, // single cell header row
      secondRow  // as many cells as needed
    ], document);
    element.replaceWith(table);
  }
}
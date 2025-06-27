/* global WebImporter */
export default function parse(element, { document }) {
  // Find the grid that contains the columns
  const grid = element.querySelector('.aem-Grid');
  if (!grid) return;
  // Select direct children columns
  const columns = Array.from(grid.children).filter((el) => el.classList.contains('aem-GridColumn'));

  // Prepare column cell contents
  let colCells = [];
  if (columns.length > 0) {
    // Left column: text content
    const col1 = columns[0];
    const col1Content = col1.querySelector('.blte-text-and-media__content') || col1;
    colCells.push(col1Content);
  }
  if (columns.length > 1) {
    // Right column: media
    const col2 = columns[1];
    const col2Content = col2.querySelector('.blte-text-and-media__media__attachment') || col2;
    colCells.push(col2Content);
  }

  // Ensure at least two columns for a columns2 block
  while (colCells.length < 2) {
    colCells.push('');
  }

  // Build table with a single-cell header row
  const cells = [
    ['Columns (columns2)'],
    colCells
  ];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}

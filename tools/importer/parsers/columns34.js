/* global WebImporter */
export default function parse(element, { document }) {
  // Header row matches EXACTLY
  const headerRow = ['Columns (columns34)'];

  // Find the deepest .aem-Grid that contains the .blte-teaser__wrapper children
  let teaserGrid = null;
  const grids = element.querySelectorAll('.aem-Grid');
  for (const grid of grids) {
    const wrappers = grid.querySelectorAll(':scope > .blte-teaser__wrapper');
    if (wrappers.length === 3) {
      teaserGrid = grid;
      break;
    }
  }
  // Fallback: find a grid with >1 wrappers
  if (!teaserGrid) {
    for (const grid of grids) {
      const wrappers = grid.querySelectorAll(':scope > .blte-teaser__wrapper');
      if (wrappers.length > 1) {
        teaserGrid = grid;
        break;
      }
    }
  }
  
  let rowCells = [];
  if (teaserGrid) {
    // Take all immediate children that are .blte-teaser__wrapper
    rowCells = Array.from(teaserGrid.querySelectorAll(':scope > .blte-teaser__wrapper'));
  }
  // Fallback: If not found, get all .blte-teaser__wrapper anywhere
  if (rowCells.length < 2) {
    rowCells = Array.from(element.querySelectorAll('.blte-teaser__wrapper'));
  }
  // Fallback: If not found, try .blte-teaser
  if (rowCells.length < 2) {
    rowCells = Array.from(element.querySelectorAll('.blte-teaser'));
  }
  // Fallback: if nothing, use whole element as one cell
  if (!rowCells.length) {
    rowCells = [element];
  }
  
  // Table must have a single header row, then a single content row with 3 columns
  const tableRows = [headerRow, rowCells];

  const table = WebImporter.DOMUtils.createTable(tableRows, document);
  element.replaceWith(table);
}

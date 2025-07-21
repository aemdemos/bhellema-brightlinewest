/* global WebImporter */
export default function parse(element, { document }) {
  // Defensive: Find the section's main two columns
  // Find the innermost .aem-Grid that contains two columns
  let grid;
  const allGrids = element.querySelectorAll('.aem-Grid');
  for (const g of allGrids) {
    // Look for a grid that has two .aem-GridColumn children
    const cols = g.querySelectorAll(':scope > .aem-GridColumn');
    if (cols.length === 2) {
      grid = g;
      break;
    }
  }
  if (!grid) return;
  const columns = grid.querySelectorAll(':scope > .aem-GridColumn');
  if (columns.length !== 2) return;

  // First column: look for .blte-text-and-media__media__attachment (may contain a <picture>)
  let leftContent = columns[0].querySelector('.blte-text-and-media__media__attachment');
  // Defensive: fallback to whole column if not found
  if (!leftContent) leftContent = columns[0];

  // Second column: look for .blte-text-and-media__content (contains eyebrow, title, desc, button)
  let rightContent = columns[1].querySelector('.blte-text-and-media__content');
  if (!rightContent) rightContent = columns[1];

  // Table structure: header row, then one row with 2 columns (as in example)
  const header = ['Columns (columns24)'];
  const row = [leftContent, rightContent];
  const cells = [header, row];

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}

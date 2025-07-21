/* global WebImporter */
export default function parse(element, { document }) {
  // Get the inner content main wrapper
  const inner = element.querySelector('.blte-text-and-media');
  if (!inner) return;
  // Find the grid containing columns
  const grid = inner.querySelector('.aem-Grid');
  if (!grid) return;
  // Find the two column children
  const columns = Array.from(grid.children).filter(child => child.matches('.aem-GridColumn'));
  if (columns.length < 2) return;

  // Media column
  let mediaCell = null;
  const mediaAttachment = columns[0].querySelector('.blte-text-and-media__media__attachment');
  if (mediaAttachment) {
    mediaCell = mediaAttachment;
  } else {
    mediaCell = columns[0];
  }

  // Content column
  let contentCell = null;
  const contentWrap = columns[1].querySelector('.blte-text-and-media__content');
  if (contentWrap) {
    contentCell = contentWrap;
  } else {
    contentCell = columns[1];
  }

  // Header row must be ONE cell/column only
  const headerRow = ['Columns (columns7)'];
  // Content row: one cell per column (here two columns)
  const contentRow = [mediaCell, contentCell];
  const cells = [headerRow, contentRow];

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}

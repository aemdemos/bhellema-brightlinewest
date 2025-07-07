/* global WebImporter */
export default function parse(element, { document }) {
  // Find the inner columns block
  const columnsWrapper = element.querySelector('.blte-text-and-media__wrapper');
  if (!columnsWrapper) return;

  // Find all direct column elements inside the inner grid
  const grids = columnsWrapper.querySelectorAll('.aem-Grid');
  if (!grids.length) return;
  const columnsGrid = grids[grids.length - 1];
  const gridColumns = columnsGrid.querySelectorAll(':scope > .aem-GridColumn');
  if (gridColumns.length < 2) return;

  // Get the content for each column
  // First: image/media
  let mediaBlock = gridColumns[0].querySelector('.blte-text-and-media__media__attachment');
  if (!mediaBlock) mediaBlock = gridColumns[0];
  // Second: text/content
  let textBlock = gridColumns[1].querySelector('.blte-text-and-media__content');
  if (!textBlock) textBlock = gridColumns[1];

  // Header row must be a single cell spanning all columns
  const headerRow = ['Columns (columns15)'];
  // Content row has as many columns as needed
  const contentRow = [mediaBlock, textBlock];

  const cells = [headerRow, contentRow];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}

/* global WebImporter */
export default function parse(element, { document }) {
  // 1. Find the main text-and-media block
  const textAndMedia = element.querySelector('.blte-text-and-media');
  if (!textAndMedia) return;

  // 2. Find the inner two columns inside the grid
  const grid = textAndMedia.querySelector('.aem-Grid');
  if (!grid) return;
  const gridColumns = grid.querySelectorAll(':scope > .aem-GridColumn');
  if (gridColumns.length < 2) return;

  // 3. Column 1: text content
  const textCol = gridColumns[0].querySelector('.blte-text-and-media__content');

  // 4. Column 2: media (image)
  const mediaCol = gridColumns[1].querySelector('.blte-text-and-media__media__attachment');

  // 5. Fallbacks for robustness (empty cells if not present)
  const leftCell = textCol ? textCol : document.createElement('div');
  const rightCell = mediaCol ? mediaCol : document.createElement('div');

  // 6. Build the table cells array as per specification
  const cells = [
    ['Columns (columns12)'], // header row: block name and variant
    [leftCell, rightCell],   // content row: two columns
  ];

  // 7. Create the block table and replace the original element
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}

/* global WebImporter */
export default function parse(element, { document }) {
  // Find the columns within the grid
  const grid = element.querySelector('.aem-Grid');
  if (!grid) return;
  const columns = grid.querySelectorAll(':scope > .aem-GridColumn');
  if (columns.length < 2) return;

  // Left column: expect headline, description, and possibly list and button
  const leftCol = columns[0];
  const contentDiv = leftCol.querySelector('.blte-text-and-media__content');
  let leftCellContent = [];
  if (contentDiv) {
    // Add heading
    const heading = contentDiv.querySelector('h2');
    if (heading) leftCellContent.push(heading);
    // Add description
    const desc = contentDiv.querySelector('.blte-text-and-media__content__description');
    if (desc) leftCellContent.push(desc);
    // Try to find a list (ul/ol)
    const list = contentDiv.querySelector('ul,ol');
    if (list) leftCellContent.push(list);
    // Try to find a button (a or button)
    const btn = contentDiv.querySelector('a,button');
    if (btn) leftCellContent.push(btn);
  }
  // If nothing found, fallback to leftCol
  if (leftCellContent.length === 0) leftCellContent = [leftCol];

  // Right column: expect image/media block
  const rightCol = columns[1];
  let rightCellContent = [];
  const mediaAttachment = rightCol.querySelector('.blte-text-and-media__media__attachment');
  if (mediaAttachment) {
    const picture = mediaAttachment.querySelector('picture');
    if (picture) rightCellContent.push(picture);
    // Add any image content overlays
    const imageContent = mediaAttachment.querySelector('.blte-text-and-media__media__imageContent');
    if (imageContent) rightCellContent.push(imageContent);
  }
  // Fallback
  if (rightCellContent.length === 0) rightCellContent = [rightCol];

  // Table header: single cell spanning columns
  const headerRow = ['Columns (columns2)'];
  const cells = [
    headerRow,
    [leftCellContent, rightCellContent]
  ];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}

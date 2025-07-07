/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main grid container
  const grid = element.querySelector('.aem-Grid');
  if (!grid) return;

  const gridChildren = Array.from(grid.children);

  // Left cell: Get the main .blte-text element only (text content only)
  let leftCell = null;
  for (const col of gridChildren) {
    const text = col.querySelector(':scope > .blte-text');
    if (text) {
      leftCell = text;
      break;
    }
  }
  if (!leftCell) leftCell = document.createElement('div');

  // Right cell: Only the media/image and any icon/caption that are direct siblings of the attachment
  let rightCell = null;
  for (const col of gridChildren) {
    const attachment = col.querySelector('.blte-text-and-media__media__attachment');
    if (attachment) {
      const wrapper = document.createElement('div');
      wrapper.appendChild(attachment);
      // Also add any icon/caption that is a direct sibling after the attachment
      let sib = attachment.nextElementSibling;
      while (sib && sib.classList.contains('blte-text-and-media__media__imageContent')) {
        wrapper.appendChild(sib);
        sib = sib.nextElementSibling;
      }
      rightCell = wrapper;
      break;
    }
  }
  if (!rightCell) rightCell = document.createElement('div');

  const headerRow = ['Columns (columns19)'];
  const contentRow = [leftCell, rightCell];
  const cells = [headerRow, contentRow];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}

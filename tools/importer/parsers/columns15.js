/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main inner grid (should be the column layout container)
  const grid = element.querySelector('.blte-text-and-media .aem-Grid');
  if (!grid) return;

  // Find the two side-by-side columns
  const columns = grid.querySelectorAll(':scope > .aem-GridColumn');
  if (columns.length < 2) return;

  // First column: Media (image)
  const mediaCol = columns[0];
  let mediaEl = null;
  const mediaWrapper = mediaCol.querySelector('.blte-text-and-media__media__attachment');
  if (mediaWrapper) {
    const picture = mediaWrapper.querySelector('picture');
    if (picture) {
      mediaEl = picture;
    } else {
      const img = mediaWrapper.querySelector('img');
      if (img) mediaEl = img;
    }
  }

  // Second column: Content
  const contentCol = columns[1];
  const contentWrapper = contentCol.querySelector('.blte-text-and-media__content');
  let contentEls = [];
  if (contentWrapper) {
    // Get the heading
    const heading = contentWrapper.querySelector('h1, h2, h3, h4, h5, h6');
    if (heading) contentEls.push(heading);
    // Get the description, preserve all children
    const desc = contentWrapper.querySelector('.blte-text-and-media__content__description');
    if (desc) {
      Array.from(desc.childNodes).forEach(node => {
        if (node.nodeType === Node.ELEMENT_NODE || node.nodeType === Node.TEXT_NODE) {
          contentEls.push(node);
        }
      });
    }
  }

  // If no elements found, ensure there is something in the cell (avoid empty cell)
  if (contentEls.length === 0) contentEls = [''];
  if (!mediaEl) mediaEl = '';

  // Construct the table as per block convention
  const cells = [
    ['Columns (columns15)'],
    [mediaEl, contentEls]
  ];

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}

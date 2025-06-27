/* global WebImporter */
export default function parse(element, { document }) {
  // Find column wrappers. These are the immediate children of the deepest aem-Grid.
  let grid = element.querySelector(':scope > .blte-sectioncontainer > .aem-Grid');
  if (!grid) grid = element.querySelector('.aem-Grid');
  let wrappers = [];
  if (grid) {
    wrappers = Array.from(grid.querySelectorAll(':scope > .blte-sectioncontainer__wrapper'));
    // Fallback: for some structures wrappers may be nested
    if (wrappers.length < 2) {
      wrappers = Array.from(grid.children).filter(el => el.classList.contains('blte-sectioncontainer__wrapper'));
    }
  }
  if (wrappers.length < 2) {
    // Fallback: get all wrappers in the element
    wrappers = Array.from(element.querySelectorAll('.blte-sectioncontainer__wrapper'));
  }

  // Heuristics: One wrapper contains .cmp-image (image(s)), one contains .blte-text (text)
  let imageWrapper = wrappers.find(wrap => wrap.querySelector('.cmp-image'));
  let textWrapper = wrappers.find(wrap => wrap.querySelector('.blte-text'));

  // Image cell: collect all cmp-image blocks
  let imageCell = '';
  if (imageWrapper) {
    const images = Array.from(imageWrapper.querySelectorAll('.cmp-image'));
    if (images.length === 1) imageCell = images[0];
    else if (images.length > 1) imageCell = images;
  }
  // Text cell: get main .blte-text element
  let textCell = '';
  if (textWrapper) {
    const text = textWrapper.querySelector('.blte-text');
    textCell = text ? text : textWrapper;
  }

  // Compose the table
  // HEADER: one cell, just as in the markdown example
  // CONTENT: two cells (columns)
  const cells = [
    ['Columns (columns13)'],
    [imageCell, textCell],
  ];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}

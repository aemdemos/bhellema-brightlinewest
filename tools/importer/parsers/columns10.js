/* global WebImporter */
export default function parse(element, { document }) {
  // Find left block columns (the 3 button list columns)
  const left = element.querySelector('.blte-footer__first-row-left');
  let leftCols = [];
  if (left) {
    leftCols = Array.from(left.querySelectorAll(':scope > .blte-footer__first-row-left-column'));
  }
  // Find the right block (social icons)
  const right = element.querySelector('.blte-footer__first-row-right');
  const cols = [...leftCols, ...(right ? [right] : [])];
  if (cols.length === 0) return;
  // Header row should be a single cell only
  const cells = [
    ['Columns (columns10)'],
    cols
  ];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}

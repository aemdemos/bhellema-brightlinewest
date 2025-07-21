/* global WebImporter */
export default function parse(element, { document }) {
  // The header row must be exactly one column: 'Columns (columns2)'
  const headerRow = ['Columns (columns2)'];

  // Find left columns (About, Media, Contact Us)
  const left = element.querySelector('.blte-footer__first-row-left');
  let leftCols = [];
  if (left) {
    leftCols = Array.from(left.children).filter((col) => col.classList.contains('blte-footer__first-row-left-column'));
  }
  let leftContent = '';
  if (leftCols.length > 0) {
    const frag = document.createDocumentFragment();
    leftCols.forEach((col, idx) => {
      if (idx > 0) frag.append(document.createElement('br'));
      frag.append(col);
    });
    leftContent = frag;
  }

  // Find right column (socials)
  const right = element.querySelector('.blte-footer__first-row-right');
  const rightContent = right || '';

  // Create row: as many columns as needed for the layout
  const contentRow = [leftContent, rightContent];

  // The first row in the table is always a single cell header row
  // The second row contains as many cells as needed to match the columns
  const cells = [headerRow, contentRow];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}

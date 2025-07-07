/* global WebImporter */
export default function parse(element, { document }) {
  // Get all columns (should be 2)
  const columns = element.querySelectorAll(':scope > div');
  if (columns.length !== 2) return;

  // LEFT COLUMN: background image as <img>
  const leftCol = columns[0];
  let imgEl = null;
  const bgImg = leftCol.style.backgroundImage;
  if (bgImg) {
    const urlMatch = bgImg.match(/url\(["']?([^"')]+)["']?\)/);
    if (urlMatch && urlMatch[1]) {
      imgEl = document.createElement('img');
      imgEl.src = urlMatch[1];
      imgEl.alt = '';
      imgEl.style.width = '100%';
      if (leftCol.style.borderRadius) {
        imgEl.style.borderRadius = leftCol.style.borderRadius;
      }
    }
  }
  const leftCell = imgEl || '';

  // RIGHT COLUMN: all content
  const rightCol = columns[1];
  const rightCellContent = Array.from(rightCol.childNodes);

  // Header row must have two columns: text and empty string
  const headerRow = [
    'Columns (columns18)',
    ''
  ];
  const contentRow = [leftCell, rightCellContent];
  const cells = [headerRow, contentRow];

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}

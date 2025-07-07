/* global WebImporter */
export default function parse(element, { document }) {
  // Find the teasers-list block (deeply nested)
  const teasersList = element.querySelector('.blte-teasers-list');
  if (!teasersList) return;

  // Find the list of teaser items (ul)
  const teasersUl = teasersList.querySelector('.blte-teasers-list__items');
  if (!teasersUl) return;

  // Get all teaser list items (li)
  const teaserLis = Array.from(teasersUl.children);

  // For each teaser, extract the relevant content (image, title, description, cta)
  const columnCells = teaserLis.map((li) => {
    // Compose teaser cell contents in the correct order and reference existing DOM nodes
    const items = [];
    const imageWrap = li.querySelector('.blte-teaser-v2__image');
    if (imageWrap) items.push(imageWrap);
    const titleWrap = li.querySelector('.blte-teaser-v2__content .blte-teaser-v2__title');
    if (titleWrap) items.push(titleWrap);
    const desc = li.querySelector('.blte-teaser-v2__content .blte-teaser-v2__description');
    if (desc) items.push(desc);
    const cta = li.querySelector('.blte-teaser-v2__content .blte-teaser-v2__cta');
    if (cta) items.push(cta);
    return items;
  });

  // Header row must match example: a single-cell row
  const headerRow = ['Columns (columns31)'];

  // Compose table cells. First row: header (one cell). Second row: one cell per column
  const cells = [
    headerRow,
    columnCells
  ];

  const block = WebImporter.DOMUtils.createTable(cells, document);

  // The default createTable will create as many header cells as the second row's length.
  // We need to merge the header row to a single cell that spans all columns.

  // Find the <table> and <tr> elements
  const trHeader = block.querySelector('tr');
  if (trHeader) {
    const ths = trHeader.querySelectorAll('th');
    if (ths.length > 1) {
      // Keep only the first th and remove others
      for (let i = 1; i < ths.length; i++) {
        ths[i].remove();
      }
      // Set colspan on the only header cell
      ths[0].setAttribute('colspan', columnCells.length);
    }
  }

  element.replaceWith(block);
}

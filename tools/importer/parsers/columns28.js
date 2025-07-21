/* global WebImporter */
export default function parse(element, { document }) {
  // Find the <ul> that contains the columns (feature items)
  const itemsWrapper = element.querySelector('.blte-features-grid__items');
  if (!itemsWrapper) return;
  const featureItems = Array.from(itemsWrapper.querySelectorAll(':scope > li'));
  if (!featureItems.length) return;

  // Gather the content for each column
  const columns = featureItems.map((li) => {
    const content = li.querySelector('.blte-feature-item__content');
    return content ? content : li;
  });

  // The first row must be a single cell: [ 'Columns (columns28)' ]
  const headerRow = ['Columns (columns28)'];
  // The second row must have as many columns as needed
  const columnsRow = columns;
  // Compose the table so that the header row is a single cell,
  // and the next row has one cell per column (as in the example)
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    columnsRow
  ], document);
  element.replaceWith(table);
}

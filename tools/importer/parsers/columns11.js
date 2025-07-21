/* global WebImporter */
export default function parse(element, { document }) {
  // Find the UL containing the feature columns
  const ul = element.querySelector('ul.blte-features-grid__items');
  if (!ul) return;
  const lis = ul.querySelectorAll(':scope > li');

  // Each LI becomes a cell in the columns row
  const columnsRow = [];
  lis.forEach((li) => {
    const content = li.querySelector('.blte-feature-item__content') || li;
    columnsRow.push(content);
  });

  // The header row must have only ONE cell, matching the example
  const cells = [
    ['Columns (columns11)'],
    columnsRow
  ];

  // Create the table and set the header cell to have correct colspan
  const table = WebImporter.DOMUtils.createTable(cells, document);

  // Fix the header row colspan to match the number of columns
  const headerRow = table.querySelector('tr:first-child');
  if (headerRow && columnsRow.length > 1) {
    const th = headerRow.querySelector('th');
    if (th) {
      th.setAttribute('colspan', columnsRow.length);
    }
  }

  element.replaceWith(table);
}

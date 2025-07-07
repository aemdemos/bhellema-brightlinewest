/* global WebImporter */
export default function parse(element, { document }) {
  // Find the <ul> that contains the columns
  const ul = element.querySelector('.blte-features-grid__items');
  if (!ul) return;

  // Get all <li> elements for the columns
  const lis = Array.from(ul.querySelectorAll(':scope > li.blte-feature-item'));
  if (!lis.length) return;

  // For each column, get its main content element
  const columnCells = lis.map(li => {
    const content = li.querySelector('.blte-feature-item__content');
    return content || li;
  });

  // Construct the correct table structure: header is single cell, second row contains all columns
  const rows = [
    ['Columns (columns3)'], // header: always ONE cell
    columnCells             // second row: one cell per column
  ];
  
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}

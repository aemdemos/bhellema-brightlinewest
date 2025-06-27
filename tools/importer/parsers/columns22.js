/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main grid that contains the columns
  const grid = element.querySelector('.blte-sectioncontainer > .aem-Grid');
  if (!grid) return;

  // Select all immediate children which are the column wrappers
  const columnWrappers = Array.from(grid.children).filter(child => child.classList.contains('blte-teaser__wrapper'));

  // For each column, extract the main content (image + title)
  const columns = columnWrappers.map(wrapper => {
    const teaser = wrapper.querySelector('.blte-teaser');
    return teaser || wrapper;
  });

  const tableRows = [];
  // Header row as a single cell (not one per column)
  tableRows.push(['Columns (columns22)']);
  // Content row: as many columns as found
  tableRows.push(columns);

  const table = WebImporter.DOMUtils.createTable(tableRows, document);
  element.replaceWith(table);
}

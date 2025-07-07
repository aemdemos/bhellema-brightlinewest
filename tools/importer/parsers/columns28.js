/* global WebImporter */
export default function parse(element, { document }) {
  // Find the section container (the main grid)
  const section = element.querySelector(':scope > .blte-sectioncontainer > .aem-Grid');
  if (!section) return;

  // Extract main column content
  const columns = Array.from(section.querySelectorAll(':scope > div'));
  const contentCells = [];
  columns.forEach(col => {
    let content = null;
    // Prefer major block wrappers
    content = col.querySelector(':scope > .blte-newsletter-formV2__wrapper')
      || col.querySelector(':scope > .blte-text-and-media')
      || col.querySelector(':scope > .blte-text');
    // If not found, use the column if it has content
    if (!content && (col.textContent.trim() || col.querySelector('img,picture,form,a,h1,h2,h3,h4,h5,h6'))) {
      content = col;
    }
    if (content) {
      contentCells.push(content);
    }
  });
  if (!contentCells.length) return;

  // Header row: exactly one column, as required
  const headerRow = ['Columns (columns28)'];
  // Second row: as many columns as needed, each with its content (not nested in another array)
  const tableData = [headerRow, contentCells];
  const table = WebImporter.DOMUtils.createTable(tableData, document);
  element.replaceWith(table);
}

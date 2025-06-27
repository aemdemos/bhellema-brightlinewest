/* global WebImporter */
export default function parse(element, { document }) {
  // Get all immediate <li> children representing columns
  const columns = Array.from(element.querySelectorAll(':scope > li'));
  // For each column, gather all content (preserving structure)
  const contentCells = columns.map((li) => {
    // Gather all node children, skipping empty text nodes
    const nodes = Array.from(li.childNodes).filter(node => {
      return !(node.nodeType === Node.TEXT_NODE && !node.textContent.trim());
    });
    if (nodes.length === 1) return nodes[0];
    if (nodes.length > 1) return nodes;
    return '';
  });
  // Compose table: header row is a single cell, then content row is n columns
  const tableRows = [
    ['Columns (columns5)'],
    contentCells
  ];
  const table = WebImporter.DOMUtils.createTable(tableRows, document);
  element.replaceWith(table);
}

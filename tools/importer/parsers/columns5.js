/* global WebImporter */
export default function parse(element, { document }) {
  // Get all direct li children (each is a column)
  const columns = Array.from(element.querySelectorAll(':scope > li'));

  // For each column, gather all content as a fragment
  const contentRow = columns.map(li => {
    const fragment = document.createDocumentFragment();
    // Use the first <div> inside <li> for all block content
    const topDiv = li.querySelector(':scope > div');
    if (topDiv) {
      // Append all children, preserving structure
      Array.from(topDiv.children).forEach(child => {
        fragment.appendChild(child);
      });
    } else {
      Array.from(li.childNodes).forEach(child => {
        fragment.appendChild(child);
      });
    }
    // Fallback for empty columns
    if (!fragment.hasChildNodes()) {
      fragment.appendChild(document.createTextNode(''));
    }
    return fragment;
  });

  // Compose the rows as per the markdown example:
  // 1. Header row: one cell only! (not an array with as many columns as columns)
  // 2. Content row: N cells (one for each li/column)
  const rows = [
    ['Columns (columns5)'],
    contentRow
  ];

  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}

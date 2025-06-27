/* global WebImporter */
export default function parse(element, { document }) {
  // Header as a SINGLE column (matching the markdown example)
  const headerRow = ['Columns (columns17)'];

  // Get all direct li children (columns for the second row)
  const lis = Array.from(element.querySelectorAll(':scope > li'));

  // For each li, gather its content as a column (keep original elements, do not clone)
  const columns = lis.map((li) => {
    const fragment = document.createDocumentFragment();
    // Title
    const title = li.querySelector('.blte-feature-item__title');
    if (title) fragment.appendChild(title);
    // Description
    const desc = li.querySelector('.blte-feature-item__description');
    if (desc) fragment.appendChild(desc);
    return fragment;
  });

  // Compose cells: header as 1 column, then content row with N columns
  const cells = [
    headerRow,
    columns
  ];

  // Replace the element with the composed table
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}

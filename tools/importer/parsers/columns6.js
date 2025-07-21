/* global WebImporter */
export default function parse(element, { document }) {
  // Find the grid of teasers within the block
  const grid = element.querySelector('.blte-sectioncontainer .aem-Grid');
  if (!grid) return;

  // Get all direct teaser wrappers (columns)
  const teasers = Array.from(grid.children).filter(child => child.classList.contains('blte-teaser__wrapper'));

  // For each teaser/column, build one column cell referencing the existing content
  const columns = teasers.map(teaserWrapper => {
    // We take the .blte-teaser inside the wrapper, falling back to the wrapper itself if needed
    const teaser = teaserWrapper.querySelector('.blte-teaser');
    return teaser || teaserWrapper;
  });

  // Compose the block table: header row must be a single cell, even if columns follow
  const cells = [
    ['Columns (columns6)'], // header row: block name in a single cell
    columns                 // second row: one cell per column, referencing existing elements
  ];

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}

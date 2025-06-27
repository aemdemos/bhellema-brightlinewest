/* global WebImporter */
export default function parse(element, { document }) {
  // Find all relevant column blocks in the main aem-Grid only
  // This block has a grid structure; columns are major child wrappers
  // that contain actual content blocks.
  const grid = element.querySelector('.aem-Grid');
  if (!grid) return;

  // Gather all direct child wrappers that represent columns
  // These wrappers are immediate .aem-GridColumn children
  const columnWrappers = Array.from(grid.querySelectorAll(':scope > div'))
    // Filter out empty or invisible columns
    .filter(col => {
      // Only keep columns that have content blocks inside
      return col.querySelector('h2, h3, form, picture, img, a, p, .blte-text, .blte-newsletter-v2__row, .blte-text-and-media, .blte-text-and-media__media__attachment');
    });

  // For columns with newsletter block, we want to create two columns (image, form)
  // Find the newsletter column and extract its two children
  let newsletterRow = null;
  let newsletterIndex = -1;
  columnWrappers.forEach((col, idx) => {
    const row = col.querySelector('.blte-newsletter-v2__row');
    if (row) {
      newsletterRow = row;
      newsletterIndex = idx;
    }
  });
  let processedColumns = columnWrappers.slice();
  if (newsletterRow) {
    // newsletterRow has two real columns (image + form)
    const newsletterCols = Array.from(newsletterRow.querySelectorAll(':scope > .blte-newsletter-v2__column'));
    processedColumns.splice(newsletterIndex, 1, ...newsletterCols);
  }

  // For columns with text-and-media, we want to reference the two content/attachment columns
  processedColumns = processedColumns.flatMap(col => {
    const tam = col.querySelector('.blte-text-and-media');
    if (tam) {
      // Inside is a .aem-Grid with two column children (content and image)
      const innerGrid = col.querySelector('.aem-Grid');
      if (innerGrid) {
        const cols = Array.from(innerGrid.querySelectorAll(':scope > .aem-GridColumn'))
          .filter(gc => gc.querySelector('.blte-text-and-media__content, .blte-text-and-media__media__attachment'));
        if (cols.length === 2) return cols;
      }
    }
    return col;
  });

  // Group into rows of N columns each (always 2 for this block based on HTML)
  const rows = [];
  rows.push(['Columns (columns28)']);
  for (let i = 0; i < processedColumns.length; i += 2) {
    // If the last row has fewer than 2 columns, just fill what exists
    rows.push([
      processedColumns[i],
      processedColumns[i + 1] || ''
    ]);
  }

  // Create and replace table
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}

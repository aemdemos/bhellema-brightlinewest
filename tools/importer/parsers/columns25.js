/* global WebImporter */
export default function parse(element, { document }) {
  // Find the innermost teaser wrappers for the columns
  const teasers = Array.from(
    element.querySelectorAll('.blte-teaser__wrapper')
  );
  if (teasers.length === 0) return;

  // Build a cell for each teaser: combine the image and the title in one fragment (preserving markup)
  const cellsRow = teasers.map(teaserWrapper => {
    const teaser = teaserWrapper.querySelector('.blte-teaser');
    if (!teaser) return document.createTextNode('');
    // Reference existing elements: image and title wrappers (not inner h4)
    const imgWrapper = teaser.querySelector('.blte-teaser__image');
    const titleWrapper = teaser.querySelector('.blte-teaser__title');
    const frag = document.createElement('div');
    if (imgWrapper) frag.appendChild(imgWrapper);
    if (titleWrapper) frag.appendChild(titleWrapper);
    return frag;
  });

  // Header row per requirements
  const headerRow = ['Columns (columns25)'];
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    cellsRow
  ], document);
  element.replaceWith(table);
}

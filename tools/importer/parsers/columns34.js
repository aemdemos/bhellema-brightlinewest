/* global WebImporter */
export default function parse(element, { document }) {
  // Find the innermost grid that contains .blte-teaser__wrapper as direct children
  let grid = element.querySelector('.aem-Grid--12 .aem-Grid--12 .aem-Grid--12');
  if (!grid) {
    grid = element.querySelector('.aem-Grid');
  }
  const teaserWrappers = grid ? Array.from(grid.querySelectorAll(':scope > .blte-teaser__wrapper')) : [];
  if (!teaserWrappers.length) return;
  // Each column's content: icon/image and title (as single elements per column)
  const columns = teaserWrappers.map(wrapper => {
    const teaser = wrapper.querySelector('.blte-teaser');
    if (!teaser) return wrapper;
    const contentFragment = document.createElement('div');
    const imgDiv = teaser.querySelector('.blte-teaser__image');
    const titleDiv = teaser.querySelector('.blte-teaser__title');
    if (imgDiv) contentFragment.appendChild(imgDiv);
    if (titleDiv) contentFragment.appendChild(titleDiv);
    return contentFragment;
  });
  // Structure: header row should be a single cell; second row should have as many columns as needed
  const cells = [
    ['Columns (columns34)'],
    columns
  ];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}

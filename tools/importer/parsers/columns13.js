/* global WebImporter */
export default function parse(element, { document }) {
  // Find the inner aem-Grid with two columns
  const innerGrid = element.querySelector('.blte-sectioncontainer > .aem-Grid');
  if (!innerGrid) return;
  // Find the two column wrappers (each has another .blte-sectioncontainer inside)
  const colWrappers = Array.from(innerGrid.children).filter(c => c.classList.contains('blte-sectioncontainer__wrapper'));
  if (colWrappers.length < 2) return;

  // LEFT COLUMN: image(s)
  // Get innermost .blte-sectioncontainer > .aem-Grid in left col
  let leftColGrid = colWrappers[0].querySelector('.blte-sectioncontainer > .aem-Grid');
  if (!leftColGrid) leftColGrid = colWrappers[0];
  // Gather all images (prefer .cmp-image, fallback to <img>), take all relevant image containers to preserve structure
  const imageContainers = Array.from(leftColGrid.querySelectorAll(':scope > .image'));
  let leftColContent;
  if (imageContainers.length) {
    leftColContent = imageContainers.length === 1 ? imageContainers[0] : imageContainers;
  } else {
    // fallback: all images
    const imgs = Array.from(leftColGrid.querySelectorAll('img'));
    leftColContent = imgs.length === 1 ? imgs[0] : imgs;
  }

  // RIGHT COLUMN: text content
  let rightColSection = colWrappers[1].querySelector('.blte-sectioncontainer');
  if (!rightColSection) rightColSection = colWrappers[1];
  // Find text wrapper
  let textWrapper = rightColSection.querySelector('.blte-text__wrapper .blte-text');
  if (!textWrapper) textWrapper = rightColSection;

  // Prepare table header (block name in the first cell, empty second cell!)
  const headerRow = ['Columns (columns13)', ''];
  // Second row: [LEFT, RIGHT]
  const contentRow = [leftColContent, textWrapper];
  const cells = [headerRow, contentRow];

  // Create and replace
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}

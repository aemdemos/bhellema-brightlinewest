/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main grid containing the columns
  const mainSection = element.querySelector('.blte-sectioncontainer > .aem-Grid');
  if (!mainSection) return;
  const columnWrappers = Array.from(mainSection.children).filter(el => el.classList.contains('blte-sectioncontainer__wrapper'));
  if (columnWrappers.length < 2) return;

  // LEFT COLUMN (image)
  let leftContent = null;
  const leftSectionContainer = columnWrappers[0].querySelector('.blte-sectioncontainer');
  if (leftSectionContainer) {
    leftContent = leftSectionContainer.querySelector('.cmp-image');
    if (!leftContent) leftContent = leftSectionContainer;
  } else {
    leftContent = columnWrappers[0];
  }

  // RIGHT COLUMN (text + button)
  const rightSectionContainer = columnWrappers[1].querySelector('.blte-sectioncontainer');
  let rightContent = [];
  if (rightSectionContainer) {
    const texts = Array.from(rightSectionContainer.querySelectorAll('.blte-text'));
    const btns = Array.from(rightSectionContainer.querySelectorAll('.blte-btn'));
    rightContent = [...texts, ...btns];
    if (rightContent.length === 0) rightContent = [rightSectionContainer];
  } else {
    rightContent = [columnWrappers[1]];
  }

  // Enforce header row is a single cell regardless of number of columns
  const cells = [
    ['Columns (columns35)'],
    [leftContent, rightContent]
  ];

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}

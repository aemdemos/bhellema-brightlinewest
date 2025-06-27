/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main grid containing the columns
  const grid = element.querySelector('.aem-Grid');
  let columnElements = [];

  // Try to find the main content columns
  if (grid) {
    columnElements = Array.from(grid.children).filter(
      (el) => el.classList && el.className.includes('aem-GridColumn')
    );
  } else {
    columnElements = Array.from(element.children);
  }

  // For this layout, there are two main columns: text (left), image (right)
  // Find the column with the most text and the one with an image
  let leftContent = null;
  let rightContent = null;

  if (columnElements.length === 2) {
    // Assume left is text, right is image
    leftContent = columnElements[0];
    rightContent = columnElements[1];
  } else {
    // Heuristic: find the one with the most text for left, image for right
    leftContent = columnElements
      .slice()
      .sort((a, b) => (b.innerText || '').length - (a.innerText || '').length)[0];
    rightContent = columnElements.find(col => col.querySelector('picture, img'));
    if (!rightContent && columnElements.length > 1) {
      rightContent = columnElements.find(col => col !== leftContent);
    }
  }

  // For leftContent: get the actual content wrapper if present
  let leftBlock = leftContent.querySelector('.blte-text, .blte-text-and-media__content, .blte-text-and-media__content__description');
  if (!leftBlock) leftBlock = leftContent;

  // For rightContent: get the image/picture only
  let rightBlock = '';
  if (rightContent) {
    rightBlock = rightContent.querySelector('picture, img');
    if (!rightBlock) {
      // Sometimes the image is directly in the wrapper
      rightBlock = rightContent;
    }
  }

  // Build table: header row, then one row with two columns (text, image)
  const cells = [
    ['Columns (columns19)'],
    [leftBlock, rightBlock]
  ];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}

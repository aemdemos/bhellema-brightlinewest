/* global WebImporter */
export default function parse(element, { document }) {
  // Header row must match exactly
  const headerRow = ['Columns (columns35)'];

  // Find the two top-level grid columns (left: image, right: text+button)
  // Find the first child .aem-Grid
  const mainGrid = element.querySelector(':scope > .blte-sectioncontainer > .aem-Grid');
  let leftCol, rightCol;
  if (mainGrid) {
    // Get the two immediate children that are wrappers
    const wrappers = Array.from(mainGrid.children).filter(
      (el) => el.className && el.className.includes('blte-sectioncontainer__wrapper')
    );
    leftCol = wrappers[0];
    rightCol = wrappers[1];
  }
  // Fallback: try top-level wrappers
  if (!leftCol || !rightCol) {
    const wrappers = Array.from(element.querySelectorAll(':scope > div'));
    leftCol = wrappers[0];
    rightCol = wrappers[1];
  }

  // LEFT COLUMN: Grab everything inside the left sectioncontainer
  let leftCellContent = [];
  if (leftCol) {
    // Try to get just the .cmp-image (the visual content)
    const cmpImage = leftCol.querySelector('.cmp-image');
    if (cmpImage) {
      leftCellContent.push(cmpImage);
    } else {
      // Fallback: all children
      leftCellContent = Array.from(leftCol.children);
    }
  }
  if (leftCellContent.length === 0) leftCellContent = [document.createTextNode('')];

  // RIGHT COLUMN: Collect all meaningful content in DOM order (including all text, buttons, etc)
  let rightCellContent = [];
  if (rightCol) {
    // Get all .blte-text (text blocks)
    const textBlocks = Array.from(rightCol.querySelectorAll('.blte-text'));
    // Get all a.blte-btn (buttons)
    const btns = Array.from(rightCol.querySelectorAll('a.blte-btn'));
    // Put all content in document order by walking direct children
    const blocks = [];
    Array.from(rightCol.children).forEach(child => {
      // Add .blte-text if present
      const text = child.querySelector('.blte-text');
      if (text && !blocks.includes(text)) blocks.push(text);
      // Add a.blte-btn if present
      const btn = child.querySelector('a.blte-btn');
      if (btn && !blocks.includes(btn)) blocks.push(btn);
    });
    // If nothing found, fallback
    if (blocks.length) {
      rightCellContent = blocks;
    } else {
      rightCellContent = [...textBlocks, ...btns];
    }
  }
  if (rightCellContent.length === 0) rightCellContent = [document.createTextNode('')];

  // Compose cells array as per block spec
  const cells = [
    headerRow,
    [leftCellContent, rightCellContent]
  ];

  // Create table and replace
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}

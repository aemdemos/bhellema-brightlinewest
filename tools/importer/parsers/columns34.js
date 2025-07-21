/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main aem-Grid (contains two columns)
  const grid = element.querySelector('.blte-sectioncontainer > .aem-Grid');
  if (!grid) return;

  // Get top-level wrappers for columns
  const wrappers = Array.from(grid.children).filter(child => child.classList.contains('blte-sectioncontainer__wrapper'));
  if (wrappers.length < 2) return;

  // Helper: Extract relevant content from a column wrapper
  function extractColumnContent(wrapper, isRight) {
    // Get inner .blte-sectioncontainer > .aem-Grid
    const section = wrapper.querySelector('.blte-sectioncontainer');
    if (!section) return '';
    const colGrid = section.querySelector('.aem-Grid');
    if (!colGrid) return '';
    const blocks = Array.from(colGrid.children).filter(node => {
      // Only non-empty, visible blocks
      if (node.tagName) {
        if (node.textContent.trim()) return true;
        if (node.querySelector('img')) return true;
      }
      return false;
    });
    // Only include the visible text/button block from the right column
    if (isRight) {
      // Find the text wrapper with actual heading text (not .hide or mobile-only)
      const textBlocks = blocks.filter(b => b.classList.contains('blte-text__wrapper'));
      // Heuristic: prefer text block with no '--hide' or '--none'
      let mainText = textBlocks.find(b => !/-hide|-none/.test(b.className));
      if (!mainText) mainText = textBlocks[0];
      const btnBlock = blocks.find(b => b.classList.contains('blte-btn__wrapper'));
      const colDiv = document.createElement('div');
      if (mainText) colDiv.appendChild(mainText);
      if (btnBlock) colDiv.appendChild(btnBlock);
      return colDiv.childElementCount ? colDiv : '';
    } else {
      // For left: include the first image block only
      const imgBlock = blocks.find(b => b.querySelector('img'));
      return imgBlock || '';
    }
  }

  const leftCol = extractColumnContent(wrappers[0], false);
  const rightCol = extractColumnContent(wrappers[1], true);

  // Table structure: first row single header cell, second row with both columns
  const cells = [
    ['Columns (columns34)'],
    [leftCol || '', rightCol || '']
  ];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}

/* global WebImporter */
export default function parse(element, { document }) {
  // Table header must be a single-cell array
  const headerRow = ['Columns (columns14)'];

  // Extract main grid
  const mainGrid = element.querySelector(':scope > .blte-sectioncontainer > .aem-Grid');

  let col1 = null, col2 = null, col3 = null;
  if (mainGrid) {
    const gridChildren = mainGrid.querySelectorAll(':scope > .blte-sectioncontainer__wrapper');
    if (gridChildren.length >= 3) {
      // Column 1
      const col1Grid = gridChildren[0].querySelector('.blte-sectioncontainer > .aem-Grid');
      if (col1Grid) {
        const wrappers = col1Grid.querySelectorAll(':scope > .blte-text__wrapper');
        col1 = document.createElement('div');
        wrappers.forEach(w => {
          const txt = w.querySelector('.blte-text');
          if (txt) col1.appendChild(txt);
        });
      }
      // Column 2
      const col2Grid = gridChildren[1].querySelector('.blte-sectioncontainer > .aem-Grid');
      if (col2Grid) {
        const txtWrap = col2Grid.querySelector('.blte-text__wrapper');
        if (txtWrap) {
          const txt = txtWrap.querySelector('.blte-text');
          if (txt) {
            col2 = document.createElement('div');
            col2.appendChild(txt);
          }
        }
      }
      // Column 3
      const col3Grid = gridChildren[2].querySelector('.blte-sectioncontainer > .aem-Grid');
      if (col3Grid) {
        const txtWrap = col3Grid.querySelector('.blte-text__wrapper');
        if (txtWrap) {
          const txt = txtWrap.querySelector('.blte-text');
          if (txt) {
            col3 = document.createElement('div');
            col3.appendChild(txt);
          }
        }
      }
    }
  }
  if (!col1) col1 = document.createElement('div');
  if (!col2) col2 = document.createElement('div');
  if (!col3) col3 = document.createElement('div');

  // Fix: The header row must be a single-cell array, the second row is the columns array
  const cells = [
    headerRow,
    [col1, col2, col3],
  ];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}

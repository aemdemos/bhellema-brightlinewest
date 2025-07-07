/* global WebImporter */
export default function parse(element, { document }) {
  // Get the main column wrappers
  const wrappers = element.querySelectorAll(':scope > .blte-sectioncontainer > .aem-Grid > .blte-sectioncontainer__wrapper');

  // LEFT COLUMN
  const leftColContent = [];
  if (wrappers[0]) {
    const textWrappers = wrappers[0].querySelectorAll(':scope > .blte-sectioncontainer > .aem-Grid > .blte-text__wrapper');
    textWrappers.forEach(el => leftColContent.push(el));
  }

  // RIGHT COLUMN
  const rightColContentArr = [];
  [wrappers[1], wrappers[2]].forEach(w => {
    if (w) {
      const textWrapper = w.querySelector(':scope > .blte-sectioncontainer > .aem-Grid > .blte-text__wrapper');
      if (textWrapper) rightColContentArr.push(textWrapper);
    }
  });
  let rightColContent = '';
  if (rightColContentArr.length > 0) {
    const flexDiv = document.createElement('div');
    flexDiv.style.display = 'flex';
    flexDiv.style.gap = '2rem';
    flexDiv.style.justifyContent = 'flex-start';
    rightColContentArr.forEach(child => {
      const childDiv = document.createElement('div');
      childDiv.appendChild(child);
      flexDiv.appendChild(childDiv);
    });
    rightColContent = flexDiv;
  }

  // --- FIX: Ensure the header row has two columns to match the content row ---
  const headerRow = ['Columns (columns14)', ''];
  const contentRow = [leftColContent, rightColContent];
  const rows = [headerRow, contentRow];

  // Custom table creation to guarantee two <th>s in the header row
  const table = document.createElement('table');

  rows.forEach((row, rowIndex) => {
    const tr = document.createElement('tr');
    row.forEach((cell, colIndex) => {
      const cellTag = rowIndex === 0 ? 'th' : 'td';
      const cellEl = document.createElement(cellTag);
      if (Array.isArray(cell)) {
        cell.forEach(item => cellEl.append(item));
      } else if (typeof cell === 'string') {
        cellEl.innerHTML = cell;
      } else if (cell) {
        cellEl.append(cell);
      }
      tr.appendChild(cellEl);
    });
    table.appendChild(tr);
  });

  element.replaceWith(table);
}

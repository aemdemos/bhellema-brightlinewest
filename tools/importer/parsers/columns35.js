/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to get one element or null
  const find = (root, sel) => root ? root.querySelector(sel) : null;
  const grid = element.querySelector('.blte-sectioncontainer .aem-Grid');
  if (!grid) return;
  const allCols = Array.from(grid.children);

  // --- Newsletter Row ---
  let newsletterImage = null, newsletterForm = null;
  for (const col of allCols) {
    const newsletterRoot = find(col, '.blte-newsletter-v2');
    if (newsletterRoot) {
      const newsletterRow = find(newsletterRoot, '.blte-newsletter-v2__row');
      if (newsletterRow) {
        const rowChildren = Array.from(newsletterRow.children);
        if (rowChildren.length >= 2) {
          newsletterImage = rowChildren[0];
          newsletterForm = rowChildren[1];
        }
      }
      break;
    }
  }

  // --- Text and Media Row ---
  let textCell = null, imageCell = null;
  for (const col of allCols) {
    const textAndMediaRoot = find(col, '.blte-text-and-media');
    if (textAndMediaRoot) {
      const tmGrid = find(textAndMediaRoot, '.aem-Grid');
      if (tmGrid) {
        const tmCols = Array.from(tmGrid.children);
        if (tmCols.length >= 2) {
          textCell = find(tmCols[0], '.blte-text-and-media__content') || tmCols[0];
          imageCell = find(tmCols[1], '.blte-text-and-media__media__attachment') || tmCols[1];
        }
      }
      break;
    }
  }

  // --- Speaking Request Row ---
  let speakingText = null;
  for (const col of allCols) {
    const txt = find(col, '.blte-text');
    if (txt && /speaking request/i.test(txt.textContent)) {
      speakingText = txt;
      break;
    }
  }

  // Compose table rows as two columns for each content row
  const rows = [
    ['Columns (columns35)'],
    [newsletterImage || '', newsletterForm || ''],
    [textCell || '', imageCell || ''],
    [speakingText || '', '']
  ];

  const block = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(block);
}

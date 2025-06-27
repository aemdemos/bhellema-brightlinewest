/* global WebImporter */
export default function parse(element, { document }) {
  // Find teasers list content
  const teasersContent = element.querySelector('.blte-teasers-list__content');
  if (!teasersContent) return;

  // Find the UL (list of teasers)
  const teasersList = teasersContent.querySelector('.blte-teasers-list__items');
  if (!teasersList) return;

  const teasers = Array.from(teasersList.children);
  if (teasers.length === 0) return;

  // --- Fix: Make header row have only one cell regardless of column count ---
  // This ensures the header will visually span all columns
  const headerRow = ['Columns (columns31)'];

  // Build the row of columns for the block
  const dataRow = teasers.map((teaserLi) => {
    // The main teaser container
    const teaserContent = document.createElement('div');
    
    // IMAGE
    const image = teaserLi.querySelector('.blte-teaser-v2__image img');
    if (image) {
      teaserContent.appendChild(image);
    }

    // TITLE
    const titleGroup = teaserLi.querySelector('.blte-teaser-v2__title h4');
    if (titleGroup) {
      const h4 = titleGroup.cloneNode(true);
      teaserContent.appendChild(h4);
    }

    // DESCRIPTION
    const descGroup = teaserLi.querySelector('.blte-teaser-v2__description .blte-text');
    if (descGroup) {
      Array.from(descGroup.childNodes).forEach((node) => {
        teaserContent.appendChild(node);
      });
    }

    // CTA/LINK
    const cta = teaserLi.querySelector('.blte-teaser-v2__cta a');
    if (cta) {
      teaserContent.appendChild(cta);
    }

    return teaserContent;
  });

  // Compose the final table:
  // First row: header (single cell)
  // Second row: as many columns as teasers
  const cells = [headerRow, dataRow];
  const table = WebImporter.DOMUtils.createTable(cells, document);

  // Post-process: set colspan on the header cell if more than one column in the data row
  if (dataRow.length > 1) {
    const th = table.querySelector('tr:first-child th');
    if (th) th.setAttribute('colspan', dataRow.length);
  }

  element.replaceWith(table);
}

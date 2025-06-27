/* global WebImporter */
export default function parse(element, { document }) {
  // Block header row as in the markdown example (single column)
  const headerRow = ['Cards (cards27)'];

  // Prepare card rows
  const cardRows = [];
  const itemsWrapper = element.querySelector('.blte-teasers-list__items-wrapper');
  const ul = itemsWrapper && itemsWrapper.querySelector('ul');
  if (ul) {
    ul.querySelectorAll(':scope > li').forEach((li) => {
      // IMAGE: .blte-teaser-v2__image picture img
      let img = null;
      const picture = li.querySelector('.blte-teaser-v2__image picture');
      if (picture) {
        img = picture.querySelector('img');
      }

      // TEXT CELL: include any heading, description, CTA (Download Image)
      const textCellContent = [];
      // There is no heading or description in this HTML, only a CTA link
      // But code is resilient if those are added in future
      // Try to extract title/heading if present (none in this markup)
      // Try description (none in this markup)
      // Get CTA link
      const cta = li.querySelector('.blte-teaser-v2__description a');
      if (cta) {
        textCellContent.push(cta);
      }
      // Always provide at least the CTA, or empty string if none
      cardRows.push([
        img,
        textCellContent.length ? textCellContent : ''
      ]);
    });
  }

  // Table: header row (one column), then each card row (two columns)
  const cells = [headerRow, ...cardRows];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}

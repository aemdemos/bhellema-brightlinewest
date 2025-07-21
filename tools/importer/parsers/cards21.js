/* global WebImporter */
export default function parse(element, { document }) {
  // Find the teasers list block containing the cards
  const teasersList = element.querySelector('.blte-teasers-list');
  if (!teasersList) return;

  // Find the <ul> with all the <li> teaser cards
  const ul = teasersList.querySelector('ul.blte-teasers-list__items');
  if (!ul) return;
  const lis = ul.querySelectorAll(':scope > li');

  // Build table rows: first header, then each card (2 columns)
  const rows = [];
  rows.push(['Cards (cards21)']);
  lis.forEach(li => {
    // First column: the <img> element (not a clone, but the actual node)
    let imageCell = '';
    const img = li.querySelector('.blte-teaser-v2__image img');
    if (img) {
      imageCell = img;
    }
    // Second column: text content (title, date, description)
    // Instead of cloning, move elements where possible
    const contentColParts = [];

    // Title: h4 with link
    const titleDiv = li.querySelector('.blte-teaser-v2__title');
    if (titleDiv) {
      // Move its firstElementChild (h4)
      const h4 = titleDiv.querySelector('h4');
      if (h4) contentColParts.push(h4);
    }
    // Description: .blte-teaser-v2__description .blte-text
    const desc = li.querySelector('.blte-teaser-v2__description .blte-text');
    if (desc) {
      // Move all direct children (preserving <p> and structure)
      Array.from(desc.children).forEach(el => {
        contentColParts.push(el);
      });
    }
    rows.push([imageCell, contentColParts]);
  });

  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}

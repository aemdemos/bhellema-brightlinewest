/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to compose the text cell: preserves heading and description structure
  function composeTextCell(titleEl, descEl) {
    const frag = document.createDocumentFragment();
    if (titleEl) {
      frag.appendChild(titleEl);
    }
    if (descEl) {
      // Append all children (for date, paragraphs, etc)
      Array.from(descEl.childNodes).forEach((node) => {
        frag.appendChild(node);
      });
    }
    return frag;
  }

  // Get all direct card <li> items
  const cards = Array.from(element.querySelectorAll(':scope > li'));

  const rows = [];
  // Table header as required by spec
  rows.push(['Cards (cards4)']);

  cards.forEach((li) => {
    // Get card image
    let imgEl = null;
    const imageWrapper = li.querySelector('.blte-teaser-v2__image');
    if (imageWrapper) {
      // Use the <img> element as is
      imgEl = imageWrapper.querySelector('img');
    }
    // Get card text: title (h4.blte-title) and description (.blte-teaser-v2__description > .blte-text)
    let titleEl = null;
    let descEl = null;
    const content = li.querySelector('.blte-teaser-v2__content');
    if (content) {
      const h4 = content.querySelector('h4.blte-title');
      if (h4) titleEl = h4;
      const descWrap = content.querySelector('.blte-teaser-v2__description .blte-text');
      if (descWrap) descEl = descWrap;
    }
    // Compose text cell, referencing DOM nodes directly
    const textCell = composeTextCell(titleEl, descEl);
    rows.push([
      imgEl,
      textCell
    ]);
  });

  // Create table and replace original element
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}

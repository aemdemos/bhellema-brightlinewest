/* global WebImporter */
export default function parse(element, { document }) {
  // Header row for block
  const headerRow = ['Cards (cards20)'];
  const rows = [headerRow];

  // Each <li> is a card
  const cards = Array.from(element.querySelectorAll(':scope > li'));
  cards.forEach((card) => {
    // IMAGE CELL: find the first <img> in the card, reference it directly
    let imageCell = null;
    // Prefer picture > img
    const img = card.querySelector('picture img');
    if (img) {
      imageCell = img;
    } else {
      const fallbackImg = card.querySelector('img');
      if (fallbackImg) imageCell = fallbackImg;
    }

    // TEXT CELL: Should include all text content and CTA below the image, in one cell
    // In this HTML, all text and the CTA are inside .blte-teaser-v2__content
    let textCell = null;
    const content = card.querySelector('.blte-teaser-v2__content');
    if (content) {
      textCell = content;
    } else {
      // fallback: just include all <a> for CTA if present, else empty string
      const links = Array.from(card.querySelectorAll('a'));
      if (links.length > 0) {
        textCell = links.length === 1 ? links[0] : links;
      } else {
        textCell = document.createTextNode('');
      }
    }
    rows.push([imageCell, textCell]);
  });

  // Create and replace
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}

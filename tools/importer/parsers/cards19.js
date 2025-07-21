/* global WebImporter */
export default function parse(element, { document }) {
  // Header row must match example exactly
  const headerRow = ['Cards (cards19)'];
  const rows = [];
  // Find all top-level li elements (each card)
  const cardLis = element.querySelectorAll('ul > li');
  cardLis.forEach((li) => {
    // IMAGE CELL
    let imageCell = '';
    const pic = li.querySelector('.blte-teaser-v2__image picture');
    if (pic) imageCell = pic;

    // TEXT CELL
    const textCellParts = [];
    // Title: Get h4 from .blte-teaser-v2__title (may contain a link)
    const titleDiv = li.querySelector('.blte-teaser-v2__title');
    if (titleDiv) {
      const h4 = titleDiv.querySelector('h4');
      if (h4) textCellParts.push(h4);
    }
    // CTA link: .blte-teaser-v2__description > .blte-text > a (Download Image)
    const descDiv = li.querySelector('.blte-teaser-v2__description');
    if (descDiv) {
      const cta = descDiv.querySelector('a');
      if (cta) {
        // Insert <br> if there is also a title
        if (textCellParts.length > 0) textCellParts.push(document.createElement('br'));
        textCellParts.push(cta);
      }
    }
    rows.push([imageCell, textCellParts]);
  });
  const table = WebImporter.DOMUtils.createTable([headerRow, ...rows], document);
  element.replaceWith(table);
}

/* global WebImporter */
export default function parse(element, { document }) {
  // Header row as specified in the example
  const rows = [['Cards (cards26)']];

  // Select all direct li children, each is a card
  const cardEls = element.querySelectorAll(':scope ul.blte-teasers-list__items > li');

  cardEls.forEach((li) => {
    // --- IMAGE CELL ---
    let imgCell = null;
    // Find the first <picture> inside .blte-teaser-v2__image
    const imgPicture = li.querySelector('.blte-teaser-v2__image picture');
    if (imgPicture) {
      imgCell = imgPicture;
    }

    // --- TEXT CELL ---
    const textCellParts = [];
    // Title
    const titleDiv = li.querySelector('.blte-teaser-v2__title');
    if (titleDiv) {
      // Use the existing heading structure (h4 > a)
      const h4 = titleDiv.querySelector('h4');
      if (h4) {
        textCellParts.push(h4);
      }
    }
    // Description & Call to Action
    const descDiv = li.querySelector('.blte-teaser-v2__description');
    if (descDiv) {
      // .blte-text usually contains the Download button
      const textDiv = descDiv.querySelector('.blte-text');
      if (textDiv) {
        textCellParts.push(textDiv);
      } else {
        textCellParts.push(descDiv);
      }
    }

    rows.push([
      imgCell,
      textCellParts
    ]);
  });

  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}

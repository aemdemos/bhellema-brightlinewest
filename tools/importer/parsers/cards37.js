/* global WebImporter */
export default function parse(element, { document }) {
  // Locate the carousel teasers list
  const teasersList = element.querySelector('.blte-teasers-list__items');
  if (!teasersList) return;

  const rows = [
    ['Cards (cards37)']
  ];

  teasersList.querySelectorAll(':scope > li').forEach((li) => {
    // 1. IMAGE: get the image element inside the picture
    let imgCell = null;
    const picture = li.querySelector('picture');
    if (picture) {
      const img = picture.querySelector('img');
      if (img) imgCell = img;
    }

    // 2. TEXT CELL: collect heading and all description paragraphs
    const textCellContent = [];
    // Heading (with link)
    const titleDiv = li.querySelector('.blte-teaser-v2__title');
    if (titleDiv) {
      const h4 = titleDiv.querySelector('h4');
      if (h4) textCellContent.push(h4);
    }
    // Description (may include date and description)
    const descDiv = li.querySelector('.blte-teaser-v2__description');
    if (descDiv) {
      const blteText = descDiv.querySelector('.blte-text');
      if (blteText) {
        // Add each <p> as its own element, preserve order/formatting
        blteText.childNodes.forEach((node) => {
          if (node.nodeType === Node.ELEMENT_NODE && node.tagName === 'P') {
            textCellContent.push(node);
          }
        });
      }
    }

    // Add row only if at least image or text present
    if (imgCell || textCellContent.length) {
      rows.push([
        imgCell,
        textCellContent
      ]);
    }
  });

  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}

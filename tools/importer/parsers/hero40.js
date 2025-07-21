/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main hero block
  const hero = element.querySelector('.blte-hero');
  if (!hero) return;

  // Find the hero image (prefer <picture>, fallback to <img>)
  let imageCellContent = '';
  const imgWrapper = hero.querySelector('.blte-hero__image');
  if (imgWrapper) {
    const picture = imgWrapper.querySelector('picture');
    if (picture) {
      imageCellContent = picture;
    } else {
      // fallback to img
      const img = imgWrapper.querySelector('img');
      if (img) {
        imageCellContent = img;
      }
    }
  }

  // Find the hero text content
  let textCellContent = '';
  const textWrapper = hero.querySelector('.blte-hero__text');
  if (textWrapper) {
    textCellContent = textWrapper;
  }

  // Table header must match example precisely
  const cells = [
    ['Hero (hero40)'],
    [imageCellContent],
    [textCellContent],
  ];

  // Create table and replace the element
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}

/* global WebImporter */
export default function parse(element, { document }) {
  // Find the .blte-hero element, which contains all relevant content
  const hero = element.querySelector('.blte-hero');
  if (!hero) return;

  // Header row: must be exactly 'Hero (hero17)'
  const cells = [
    ['Hero (hero17)']
  ];

  // 2nd row: the background image (as a <picture> or <img> block)
  const heroImgDiv = hero.querySelector('.blte-hero__image');
  if (heroImgDiv) {
    // Use the entire picture if it exists, else the image
    const pic = heroImgDiv.querySelector('picture');
    if (pic) {
      cells.push([pic]);
    } else {
      const img = heroImgDiv.querySelector('img');
      if (img) cells.push([img]);
    }
  }

  // 3rd row: all hero text content
  const heroText = hero.querySelector('.blte-hero__text');
  if (heroText) {
    // Use the entire .blte-hero__text block. This ensures all headings and paragraphs are included.
    cells.push([heroText]);
  }

  // Create the table and replace the original element
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}

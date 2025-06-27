/* global WebImporter */
export default function parse(element, { document }) {
  // Block table header as specified exactly in the sample
  const headerRow = ['Hero (hero1)'];

  // Extract the hero image (use <picture> if available, fallback to <img>)
  let heroImage = '';
  const heroImageContainer = element.querySelector('.blte-hero__image');
  if (heroImageContainer) {
    const pic = heroImageContainer.querySelector('picture');
    if (pic) {
      heroImage = pic;
    } else {
      const img = heroImageContainer.querySelector('img');
      if (img) heroImage = img;
    }
  }

  // Extract the hero text content block (heading, subheading, etc.)
  let textContent = '';
  const textContainer = element.querySelector('.blte-hero__text');
  if (textContainer) {
    textContent = textContainer;
  }

  // Build the table as per requirements: 1 column, 3 rows
  const rows = [
    headerRow,
    [heroImage],
    [textContent],
  ];

  // Create table and replace the original element
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}

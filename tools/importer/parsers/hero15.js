/* global WebImporter */
export default function parse(element, { document }) {
  // Prepare header row - must match the example exactly
  const headerRow = ['Hero (hero15)'];

  // Robustly find the hero block content
  // 1. Extract the hero image (picture tag)
  let heroPicture = element.querySelector('.blte-hero__image picture');
  if (!heroPicture) {
    heroPicture = element.querySelector('picture');
  }

  // 2. Extract the hero text (typically contains headings, subheading, CTA)
  // The .blte-hero__text contains the wrapper for all hero text
  let heroText = element.querySelector('.blte-hero__text');
  if (!heroText) {
    // Fallback for variations: grab the first h1-h6 or a hero text wrapper
    heroText = element.querySelector('h1, h2, h3, h4, h5, h6, .blte-hero__text-wrapper');
  }

  // Defensive: If image/text not found, use empty string so row is rendered but empty
  const imageRow = [heroPicture || ''];
  const textRow = [heroText || ''];

  // Compose table structure, matching the example: 1 column, 3 rows (header, image, text)
  const cells = [
    headerRow,
    imageRow,
    textRow
  ];

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the original element with the block table
  element.replaceWith(block);
}

/* global WebImporter */
export default function parse(element, { document }) {
  // Table header must exactly match the example
  const headerRow = ['Hero (hero37)'];

  // --- Extract background image (row 2) ---
  // Search for the hero image area in the source
  let heroImage = null;
  // Look for picture/img in .blte-hero__image within the element
  const heroImageWrap = element.querySelector('.blte-hero__image');
  if (heroImageWrap) {
    heroImage = heroImageWrap.querySelector('picture') || heroImageWrap.querySelector('img');
  }

  // --- Extract text content (row 3) ---
  // Get all relevant text content: hero headline, and text block below image
  const contentRowContent = [];

  // 1. Get the hero text (headline)
  const heroText = element.querySelector('.blte-hero__text');
  if (heroText) {
    contentRowContent.push(heroText);
  }

  // 2. Get the secondary block of content under the hero (subheading, cta, etc)
  // This is usually in .blte-text__wrapper
  const textWrapper = element.querySelector('.blte-text__wrapper');
  if (textWrapper) {
    contentRowContent.push(textWrapper);
  }

  // Fallback: If neither block is found, add a blank cell for content
  if (contentRowContent.length === 0) {
    contentRowContent.push('');
  }

  // Build the full table
  const cells = [
    headerRow,
    [heroImage ? heroImage : ''],
    [contentRowContent]
  ];

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}

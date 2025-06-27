/* global WebImporter */
export default function parse(element, { document }) {
  // 1. Header Row (must match example exactly)
  const headerRow = ['Hero (hero24)'];

  // 2. Image Row: Try to find the first <img> that is clearly a hero image
  let heroImg = null;
  // Prefer blte-hero__image > img, but fallback to first significant img
  const heroImgEl = element.querySelector('.blte-hero__image img');
  if (heroImgEl) {
    heroImg = heroImgEl;
  } else {
    // fallback: first image inside .carousel or .blte-hero or just any image
    const possibleImgs = element.querySelectorAll('img');
    if (possibleImgs.length > 0) {
      heroImg = possibleImgs[0];
    }
  }

  // 3. Text Row: Collect all main hero text including heading, subheading, cta, etc
  // We want all significant text blocks as a single cell, in order
  const textContent = [];
  // a) .blte-hero__text (Main headline)
  const heroText = element.querySelector('.blte-hero__text');
  if (heroText) textContent.push(heroText);
  // b) .blte-text__wrapper (centered message & CTA link below image)
  const belowText = element.querySelector('.blte-text__wrapper');
  if (belowText) textContent.push(belowText);
  // c) If none found, fallback: collect all headings, paragraphs, and links in DOM order (but only if nothing was found above)
  if (textContent.length === 0) {
    const fallbackText = Array.from(element.querySelectorAll('h1, h2, h3, h4, h5, h6, p, a'));
    if (fallbackText.length > 0) {
      textContent.push(...fallbackText);
    } else {
      textContent.push(''); // Edge case: no text at all
    }
  }

  // Compose the block table: 1 column, 3 rows
  const cells = [
    headerRow,
    [heroImg ? heroImg : ''],
    [textContent],
  ];

  // Create table block using WebImporter helper
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}

/* global WebImporter */
export default function parse(element, { document }) {
  // 1. Table header must match the example exactly
  const headerRow = ['Hero (hero6)'];

  // 2. Find the hero image - robustly search for <picture> or <img>
  let heroImg = null;
  // Prefer <picture> inside any element with class *hero*
  heroImg = element.querySelector('.blte-hero__image picture');
  if (!heroImg) {
    // fallback: any <picture> inside element
    heroImg = element.querySelector('picture');
  }
  if (!heroImg) {
    // fallback: <img> inside .blte-hero__image
    const img = element.querySelector('.blte-hero__image img');
    if (img) heroImg = img;
  }
  if (!heroImg) {
    // fallback: any <img> inside element
    heroImg = element.querySelector('img');
  }

  // 3. Find the hero text box content (headings, etc.)
  // Prefer the full hero text wrapper block
  let heroTextContent = null;
  const heroTextWrapper = element.querySelector('.blte-hero__text-wrapper');
  if (heroTextWrapper) {
    heroTextContent = heroTextWrapper;
  } else {
    // fallback: .blte-hero__text
    const heroText = element.querySelector('.blte-hero__text');
    if (heroText) {
      heroTextContent = heroText;
    } else {
      // fallback: collect all h1, h2, h3, and p (in order of appearance)
      const nodes = Array.from(element.querySelectorAll('h1, h2, h3, p')).filter(el => el.textContent && el.textContent.trim().length > 0);
      if (nodes.length === 1) heroTextContent = nodes[0];
      else if (nodes.length > 1) heroTextContent = nodes;
      else heroTextContent = '';
    }
  }

  // 4. Compose the table cells
  const cells = [
    headerRow, // always a single string array
    [heroImg ? heroImg : ''],
    [heroTextContent ? heroTextContent : ''],
  ];

  // 5. Create the block table and replace the original element
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}

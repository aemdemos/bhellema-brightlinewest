/* global WebImporter */
export default function parse(element, { document }) {
  // --- 1. Find the Hero image (picture or img) ---
  let heroImg = null;
  // Look for picture (preferred) or fall back to img
  const picture = element.querySelector('picture');
  if (picture && picture.querySelector('img')) {
    heroImg = picture.querySelector('img');
  } else {
    heroImg = element.querySelector('img');
  }

  // --- 2. Gather all relevant text content, preserving original elements ---
  const textContent = [];
  // a) All .blte-hero__text (overlay heading area)
  const heroTextContainers = element.querySelectorAll('.blte-hero__text');
  heroTextContainers.forEach(ct => {
    // Instead of cloning, reference children directly for DOMUtils.createTable
    // Prefer all direct children (could contain wrappers like .blte-hero__text-wrapper, or just headings)
    Array.from(ct.children).forEach(child => {
      textContent.push(child);
    });
  });
  // b) All .blte-text blocks not inside .blte-hero (for subheading and CTA)
  const textBlocks = element.querySelectorAll('.blte-text');
  textBlocks.forEach(tb => {
    if (!tb.closest('.blte-hero')) {
      Array.from(tb.children).forEach(child => {
        // Only include elements with visible content
        if (child.textContent && child.textContent.trim()) {
          textContent.push(child);
        }
      });
    }
  });
  // Fallback: If no text found, include all heading/paragraphs in block (shouldn't be needed but ensures nothing is missed)
  if (textContent.length === 0) {
    const fallbacks = element.querySelectorAll('h1, h2, h3, h4, h5, p, a');
    fallbacks.forEach(el => {
      if (el.textContent && el.textContent.trim()) {
        textContent.push(el);
      }
    });
  }

  // --- 3. Compose the table ---
  // Row 1: Header
  const headerRow = ['Hero (hero24)'];
  // Row 2: Image
  const imageRow = [heroImg ? heroImg : ''];
  // Row 3: All text content as a single cell (existing elements, not clones)
  const textRow = [textContent.length > 0 ? textContent : ''];
  const cells = [headerRow, imageRow, textRow];
  const table = WebImporter.DOMUtils.createTable(cells, document);

  // --- 4. Replace original element with block table ---
  element.replaceWith(table);
}

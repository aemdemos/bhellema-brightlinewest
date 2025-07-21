/* global WebImporter */
export default function parse(element, { document }) {
  // Find the .blte-hero element (the visual hero/banner block)
  const hero = element.querySelector('.blte-hero');
  if (!hero) return;

  // --- Background Image Row ---
  let imgEl = null;
  const imageContainer = hero.querySelector('.blte-hero__image');
  if (imageContainer) {
    // Just use the <img> as-is
    imgEl = imageContainer.querySelector('img');
  }

  // --- Text Content Row ---
  // Gather all elements inside hero that are NOT the image
  // If there is a single .blte-hero__text element, use it directly
  let textContent = null;
  const textBlock = hero.querySelector('.blte-hero__text');
  if (textBlock) {
    textContent = textBlock;
  } else {
    // Fallback: collect all children except blte-hero__image
    const textEls = Array.from(hero.children).filter(
      el => !el.classList.contains('blte-hero__image')
    );
    if (textEls.length === 1) {
      textContent = textEls[0];
    } else if (textEls.length > 1) {
      const wrapper = document.createElement('div');
      textEls.forEach(el => wrapper.appendChild(el));
      textContent = wrapper;
    }
  }

  // Prepare table rows as per block definition (Header, Image, Text)
  const rows = [];
  rows.push(['Hero (hero22)']);
  rows.push([imgEl || '']);
  rows.push([textContent || '']);

  // Create table and replace the original element
  const block = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(block);
}

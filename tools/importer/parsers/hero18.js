/* global WebImporter */
export default function parse(element, { document }) {
  // Header row: block name as in the example
  const headerRow = ['Hero (hero18)'];

  // Row 2: background image (picture)
  // Find only the first <picture> inside the hero section
  let picture = null;
  const heroImageSection = element.querySelector('.blte-hero__image');
  if (heroImageSection) {
    picture = heroImageSection.querySelector('picture');
  }
  // Fallback: first picture anywhere in element
  if (!picture) {
    picture = element.querySelector('picture');
  }
  const imageRow = [picture ? picture : ''];

  // Row 3: All relevant text content (headline, subheading, etc.)
  // This includes hero overlay text and main title block below the image
  const textContent = [];
  // 1. Hero overlay text (e.g., "Press Releases")
  const heroText = element.querySelector('.blte-hero__text');
  if (heroText) textContent.push(heroText);
  // 2. Main title below image (e.g., "BRIGHTLINE ACQUIRES SITE ...")
  // It is inside .blte-title__wrapper, but we want its full content
  const titleWrapper = element.querySelector('.blte-title__wrapper');
  if (titleWrapper) {
    Array.from(titleWrapper.childNodes).forEach(node => {
      // Only push element or non-empty text nodes
      if (node.nodeType === 1 || (node.nodeType === 3 && node.textContent.trim())) {
        textContent.push(node);
      }
    });
  }

  // If no text found, fallback to all h1/h2/h3/p found that are not inside picture
  if (textContent.length === 0) {
    element.querySelectorAll('h1, h2, h3, h4, h5, h6, p').forEach(el => {
      textContent.push(el);
    });
  }

  const textRow = [textContent.length ? textContent : ''];

  const cells = [
    headerRow,
    imageRow,
    textRow
  ];

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}

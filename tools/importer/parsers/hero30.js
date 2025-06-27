/* global WebImporter */
export default function parse(element, { document }) {
  // 1. Find the hero section
  const hero = element.querySelector('.blte-hero');
  if (!hero) return;

  // 2. Find the picture (background image)
  let picture = null;
  const imageContainer = hero.querySelector('.blte-hero__image');
  if (imageContainer) {
    picture = imageContainer.querySelector('picture') || imageContainer;
  }

  // 3. Collect all text content from hero text area
  let textContent = [];
  const textContainer = hero.querySelector('.blte-hero__text');
  if (textContainer) {
    // We want to collect headings, paragraphs, and other visible text elements in correct order
    // We'll include any direct children of the text wrapper that are elements
    let wrapper = textContainer.querySelector('.blte-hero__text-wrapper') || textContainer;
    // Use childNodes so we preserve order and all relevant nodes
    textContent = Array.from(wrapper.childNodes).filter((node) => {
      return (
        node.nodeType === 1 && // element
        (node.tagName.match(/^H[1-6]$/) || node.tagName === 'P' || node.classList.contains('blte-text') || node.classList.contains('blte-hero__text-value-span'))
      ) || (
        node.nodeType === 3 && node.textContent.trim().length > 0 // text node
      );
    });
    // Fallback: If nothing found, use the textContainer
    if (textContent.length === 0) textContent = [textContainer];
  }

  // 4. Build block table
  const rows = [];
  rows.push(['Hero (hero30)']);
  rows.push([picture || '']);
  rows.push([textContent.length > 1 ? textContent : textContent[0] || '']);

  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}

/* global WebImporter */
export default function parse(element, { document }) {
  // Find the .blte-hero (contains both image and text)
  const blteHero = element.querySelector('.blte-hero');
  if (!blteHero) return;

  // --- Extract background image block (picture or fallback to whole image div) ---
  let bgContent = '';
  const imageDiv = blteHero.querySelector('.blte-hero__image');
  if (imageDiv) {
    // Prefer picture if present
    const picture = imageDiv.querySelector('picture');
    bgContent = picture ? picture : imageDiv;
  }

  // --- Extract text block (headings etc.) ---
  let textContent = '';
  const textDiv = blteHero.querySelector('.blte-hero__text');
  if (textDiv) {
    // If it has a wrapper, use its children, else use all children
    const wrapper = textDiv.querySelector('.blte-hero__text-wrapper');
    if (wrapper) {
      // Get all nodes inside wrapper
      textContent = Array.from(wrapper.childNodes);
    } else {
      textContent = Array.from(textDiv.childNodes);
    }
    // Remove empty text nodes
    textContent = textContent.filter(node => {
      // Keep elements, and text nodes with content
      return node.nodeType !== Node.TEXT_NODE || node.textContent.trim().length > 0;
    });
    // If only one node, don't use an array
    if (textContent.length === 1) textContent = textContent[0];
  }

  // --- Table structure: header, image row, text row ---
  const cells = [
    ['Hero (hero30)'],
    [bgContent],
    [textContent]
  ];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}

/* global WebImporter */
export default function parse(element, { document }) {
  // Table header
  const rows = [['Cards (cards20)']];
  // Each li is a card
  const cards = element.querySelectorAll(':scope > li');
  cards.forEach((card) => {
    // IMAGE CELL: first <img> inside the card
    let imageCell = null;
    const img = card.querySelector('img');
    if (img) imageCell = img;
    // TEXT CELL: collect all text, links, and content that would be part of the card's right side
    const textCellContent = [];
    // 1. Look for description blocks, which often contain text and CTA
    // These may be in .blte-teaser-v2__content or .blte-teaser-v2__description, sometimes in .blte-text
    const contentDiv = card.querySelector('.blte-teaser-v2__content, .blte-teaser-v2__description, .blte-text');
    if (contentDiv) {
      Array.from(contentDiv.childNodes).forEach((node) => {
        // Element nodes or text nodes with content
        if (node.nodeType === Node.ELEMENT_NODE || (node.nodeType === Node.TEXT_NODE && node.textContent.trim())) {
          textCellContent.push(node);
        }
      });
    }
    // 2. If nothing found above, as a fallback, include all <a> (for CTA) and all non-empty text nodes in card
    if (textCellContent.length === 0) {
      // All <a> elements (CTAs)
      card.querySelectorAll('a').forEach(a => textCellContent.push(a));
      // All text nodes directly under card
      Array.from(card.childNodes).forEach((node) => {
        if (node.nodeType === Node.TEXT_NODE && node.textContent.trim()) {
          textCellContent.push(document.createTextNode(node.textContent));
        }
      });
    }
    // If still empty, push an empty string as fallback
    if (textCellContent.length === 0) textCellContent.push('');
    // Compose the row
    rows.push([
      imageCell,
      textCellContent.length === 1 ? textCellContent[0] : textCellContent
    ]);
  });
  // Create and replace
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}

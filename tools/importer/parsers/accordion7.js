/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main accordion block
  const accordion = element.querySelector('.blte-accordion');
  if (!accordion) return;

  // Get all accordion items
  const items = accordion.querySelectorAll('.blte-accordion-item');
  const rows = [];

  // Header row as specified in the markdown example
  rows.push(['Accordion (accordion7)']);

  // For each accordion item, extract title and content
  items.forEach((item) => {
    // Title cell: get the .blte-title element (preserve HTML formatting)
    let titleCell = '';
    const titleEl = item.querySelector('.blte-title');
    if (titleEl) {
      titleCell = titleEl;
    } else {
      // Fallback: try button text
      const btn = item.querySelector('button');
      if (btn) {
        titleCell = btn.textContent.trim();
      } else {
        titleCell = '';
      }
    }

    // Content cell: use the .blte-accordion-item__content element, reference directly
    let contentCell = '';
    const contentEl = item.querySelector('.blte-accordion-item__content');
    if (contentEl) {
      contentCell = contentEl;
    } else {
      contentCell = '';
    }

    rows.push([titleCell, contentCell]);
  });

  // Create and replace with block table
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}

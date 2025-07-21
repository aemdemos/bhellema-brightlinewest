/* global WebImporter */
export default function parse(element, { document }) {
  // Find the accordion root (.blte-accordion)
  let accordion = element.querySelector('.blte-accordion');
  if (!accordion && element.classList.contains('blte-accordion')) {
    accordion = element;
  }
  if (!accordion) return;

  // Get all accordion items
  const items = accordion.querySelectorAll('.blte-accordion-item');
  const rows = [];
  // Header row, matching example exactly
  rows.push(['Accordion (accordion43)']);

  // For each accordion item, extract the title and content
  items.forEach((item) => {
    // Title cell: use <h3 class="blte-title"> if available (preserves heading semantics)
    let titleEl = item.querySelector('button .blte-title');
    if (!titleEl) {
      // Fallback: use button's text content wrapped in a <span>
      const button = item.querySelector('button');
      if (button) {
        const span = document.createElement('span');
        span.textContent = button.textContent.trim();
        titleEl = span;
      } else {
        // Fallback: empty cell
        titleEl = document.createElement('span');
      }
    }

    // Content cell: the .blte-accordion-item__content section (reference the container)
    let contentCell;
    const contentEl = item.querySelector('.blte-accordion-item__content');
    if (contentEl) {
      // Reference the .blte-accordion-item__content directly as cell (retains all formatting/structure)
      contentCell = contentEl;
    } else {
      // Fallback: empty div
      contentCell = document.createElement('div');
    }

    rows.push([titleEl, contentCell]);
  });

  // Create and replace with the block table
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}

/* global WebImporter */
export default function parse(element, { document }) {
  // Find the accordion block
  let accordion = element.querySelector('.blte-accordion');
  if (!accordion) {
    accordion = element;
  }

  // Find all accordion items
  const items = accordion.querySelectorAll('.blte-accordion-item');
  
  // The table rows
  const rows = [];
  // Header row as specified in requirements
  rows.push(['Accordion (accordion32)']);

  items.forEach((item) => {
    // Title extraction
    let title = '';
    const button = item.querySelector('button.blte-accordion-item__title');
    if (button) {
      // Find the h3.blte-title inside the button, else fallback to button text
      const h3 = button.querySelector('h3.blte-title');
      if (h3) {
        title = h3.textContent.trim();
      } else {
        title = button.textContent.trim();
      }
    }

    // Content extraction - reference the real content element
    const content = item.querySelector('.blte-accordion-item__content');
    let contentCell;
    if (content) {
      contentCell = content;
    } else {
      // If missing, insert empty div to keep table shape
      contentCell = document.createElement('div');
    }

    rows.push([title, contentCell]);
  });

  // Create the new block table
  const table = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the original element
  element.replaceWith(table);
}

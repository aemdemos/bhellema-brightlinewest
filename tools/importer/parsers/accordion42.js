/* global WebImporter */
export default function parse(element, { document }) {
  // Create the header row as specified
  const table = [
    ['Accordion (accordion42)']
  ];

  // Find the core accordion container
  const accordion = element.querySelector('.blte-accordion');
  if (!accordion) return;

  // Find all accordion items
  const items = accordion.querySelectorAll('.blte-accordion-item');
  items.forEach((item) => {
    // TITLE CELL
    // Look for .blte-title which should be the visible heading
    let titleEl = item.querySelector('.blte-title');
    // Fallback: try the button text if .blte-title is missing
    if (!titleEl) {
      const btn = item.querySelector('.blte-accordion-item__title');
      if (btn) {
        titleEl = document.createElement('span');
        titleEl.textContent = btn.textContent.trim();
      }
    }

    // CONTENT CELL
    let contentEl = item.querySelector('.blte-accordion-item__content');
    let contentCell;
    if (contentEl) {
      // Try to extract the most relevant content inside nested wrappers
      // Many times, there is a .blte-sectioncontainer > .aem-Grid > ...
      const section = contentEl.querySelector('.blte-sectioncontainer');
      if (section) {
        // Look for all .blte-text elements inside this section
        // (could be multiple paragraphs or blocks)
        const texts = section.querySelectorAll('.blte-text');
        if (texts.length > 0) {
          contentCell = Array.from(texts);
        } else {
          // Fallback: use the section itself
          contentCell = [section];
        }
      } else {
        // Fallback: use all children of contentEl
        contentCell = Array.from(contentEl.childNodes).filter(n => {
          // Only keep non-empty text nodes or elements
          return n.nodeType !== 3 || n.textContent.trim();
        });
      }
    } else {
      // If nothing found, create an empty text node
      contentCell = document.createTextNode('');
    }

    table.push([
      titleEl,
      contentCell
    ]);
  });

  // Create the table block and replace in the DOM
  const block = WebImporter.DOMUtils.createTable(table, document);
  element.replaceWith(block);
}

/* global WebImporter */
export default function parse(element, { document }) {
  // 1. Table header row must match example
  const headerRow = ['Accordion (accordion36)'];
  const rows = [headerRow];

  // 2. Locate main accordion container
  // The accordion block may be nested
  let accordionRoot = element.querySelector('.blte-accordion');
  if (!accordionRoot) accordionRoot = element;

  // 3. Select all accordion items
  const itemEls = accordionRoot.querySelectorAll('.blte-accordion-item');
  itemEls.forEach((itemEl) => {
    // a. Title cell
    // - The question button contains the title, and inside there's a .blte-title h3
    let titleNode = null;
    const btn = itemEl.querySelector('.blte-accordion-item__title');
    if (btn) {
      const h3 = btn.querySelector('.blte-title');
      // Use h3 element directly if present to retain heading level
      if (h3) {
        titleNode = h3;
      } else {
        // fallback: use button textContent as a <span>
        const span = document.createElement('span');
        span.textContent = btn.textContent.trim();
        titleNode = span;
      }
    } else {
      // fallback: use .blte-accordion-item__title__element or item text
      const fallbackTitle = itemEl.querySelector('.blte-accordion-item__title__element');
      if (fallbackTitle) {
        titleNode = fallbackTitle;
      } else {
        const span = document.createElement('span');
        span.textContent = '';
        titleNode = span;
      }
    }

    // b. Content cell
    let contentNode = itemEl.querySelector('.blte-accordion-item__content');
    if (contentNode) {
      // The content node contains all answer content and is hidden by default
      // Reference existing node: do NOT clone, so it is moved into block
      contentNode.removeAttribute('hidden');
    } else {
      // fallback: empty
      contentNode = document.createTextNode('');
    }
    // 4. Push row: [title, content]
    rows.push([titleNode, contentNode]);
  });

  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}

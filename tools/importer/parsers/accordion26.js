/* global WebImporter */
export default function parse(element, { document }) {
  // Find the accordion container
  const accordionEl = element.querySelector('.blte-accordion');
  if (!accordionEl) return;

  // Find all immediate children that are .blte-accordion-item (skip possible nested or unrelated divs)
  const itemEls = accordionEl.querySelectorAll(':scope > div > .blte-accordion-item, :scope > .blte-accordion-item');

  const rows = [];
  // Header row should exactly match the block name
  rows.push(['Accordion (accordion26)']);

  itemEls.forEach((itemEl) => {
    // Title: inside a button with class 'blte-accordion-item__title'
    let titleBtn = itemEl.querySelector('.blte-accordion-item__title');
    let titleContent = null;
    if (titleBtn) {
      // Find the most direct title element; prefer the .blte-title h3 if present
      const titleElement = titleBtn.querySelector('.blte-accordion-item__title__element');
      if (titleElement) {
        titleContent = titleElement;
      } else {
        // fallback: use the button's text content
        titleContent = document.createElement('div');
        titleContent.textContent = titleBtn.textContent;
      }
    } else {
      // fallback: search for an h3 directly inside item
      const h3 = itemEl.querySelector('h3');
      if (h3) {
        titleContent = h3;
      } else {
        titleContent = document.createElement('div');
        titleContent.textContent = itemEl.textContent;
      }
    }

    // Content: blte-accordion-item__content
    let contentDiv = itemEl.querySelector('.blte-accordion-item__content');
    let contentContent = null;
    if (contentDiv) {
      // If contentDiv is hidden, that's fine -- we want the content
      contentContent = contentDiv;
    } else {
      contentContent = document.createElement('div');
    }

    rows.push([titleContent, contentContent]);
  });

  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}

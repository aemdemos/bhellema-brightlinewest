/* global WebImporter */
export default function parse(element, { document }) {
  // Prepare block table header
  const headerRow = ['Accordion (accordion23)'];
  const rows = [headerRow];

  // Find the accordion root (should contain all items)
  let accordionRoot = element.querySelector('.blte-accordion');
  if (!accordionRoot) {
    // fallback: maybe the current element *is* the accordion
    accordionRoot = element;
  }

  // Select all accordion items
  const items = accordionRoot.querySelectorAll('.blte-accordion-item');
  items.forEach((item) => {
    // Title cell: prefer referencing the actual heading node
    let titleCell = null;
    const button = item.querySelector('.blte-accordion-item__title');
    if (button) {
      const titleDiv = button.querySelector('.blte-accordion-item__title__element');
      const h3 = titleDiv ? titleDiv.querySelector('h3') : null;
      if (h3) {
        titleCell = h3;
      } else if (titleDiv) {
        titleCell = titleDiv;
      } else {
        titleCell = button;
      }
    }
    // Content cell: preserve all DOM under .blte-accordion-item__content
    let contentCell = null;
    const content = item.querySelector('.blte-accordion-item__content');
    if (content) {
      contentCell = content;
    }
    // Only add row if both cells exist
    if (titleCell && contentCell) {
      rows.push([titleCell, contentCell]);
    }
  });

  // Only replace if at least header is present
  if (rows.length > 1) {
    const table = WebImporter.DOMUtils.createTable(rows, document);
    element.replaceWith(table);
  }
}

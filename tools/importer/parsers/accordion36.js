/* global WebImporter */
export default function parse(element, { document }) {
  // Find the accordion block root
  const accordionRoot = element.querySelector('.blte-accordion');
  if (!accordionRoot) return;

  // Get all the accordion items in order
  const items = Array.from(accordionRoot.querySelectorAll(':scope > div .blte-accordion-item'));
  const accordionItems = items.length > 0 ? items : Array.from(accordionRoot.querySelectorAll('.blte-accordion-item'));

  // Prepare the table rows
  const rows = [];
  rows.push(['Accordion (accordion36)']); // Exact header as required

  accordionItems.forEach(item => {
    // Title cell: Use the most meaningful heading element inside the button
    let titleEl = item.querySelector('.blte-accordion-item__title .blte-title');
    if (!titleEl) {
      // Fallback to button itself if heading missing
      const btn = item.querySelector('.blte-accordion-item__title');
      titleEl = btn ? btn : document.createElement('div');
    }

    // Content cell: The entire content block (not its textContent, but the actual node)
    let contentPanel = item.querySelector('.blte-accordion-item__content');
    // If the content is deeply wrapped, reference the full contentPanel as is (the block table will flatten it)
    rows.push([titleEl, contentPanel]);
  });

  const block = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(block);
}

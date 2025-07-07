/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main accordion container
  let accordionRoot = element.querySelector('.blte-accordion');
  if (!accordionRoot) {
    // fallback: treat element as root
    accordionRoot = element;
  }

  // Find all accordion items (each one is a row)
  const itemNodes = accordionRoot.querySelectorAll('.blte-accordion-item');

  // Build the table rows, starting with the header
  const rows = [
    ['Accordion (accordion29)'],
  ];

  itemNodes.forEach((item) => {
    // Title cell: Find the .blte-accordion-item__title button
    let titleButton = item.querySelector('.blte-accordion-item__title');
    let titleContent = null;
    if (titleButton) {
      // Prefer to extract the h3.blte-title within the button if present
      const h3 = titleButton.querySelector('h3.blte-title');
      if (h3) {
        titleContent = h3;
      } else {
        // fallback: use button contents (without trailing icon)
        // Clone the button, remove icon, use children except trailing icon
        let btnClone = titleButton.cloneNode(true);
        let icon = btnClone.querySelector('.blte-accordion-item__trailing-icon');
        if (icon) icon.remove();
        titleContent = btnClone.childNodes.length === 1 ? btnClone.childNodes[0] : btnClone;
      }
    } else {
      // fallback: use item's text
      titleContent = document.createTextNode(item.textContent.trim());
    }
    // Content cell: the content region for this accordion item
    let contentRegion = item.querySelector('.blte-accordion-item__content');
    let contentContent = contentRegion ? contentRegion : document.createTextNode('');
    rows.push([titleContent, contentContent]);
  });

  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}

/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main accordion block
  const accordion = element.querySelector('.blte-accordion');
  if (!accordion) return;
  
  // Get all accordion items
  const items = Array.from(accordion.querySelectorAll(':scope > div .blte-accordion-item'));

  // Set table header row exactly as required
  const rows = [['Accordion (accordion7)']];

  items.forEach(item => {
    // Title cell: the actual h3 as per semantic meaning
    let titleCell = null;
    const button = item.querySelector('.blte-accordion-item__title');
    if (button) {
      // Use the first h3 inside the button if available, else fallback to button
      const h3 = button.querySelector('h3');
      titleCell = h3 || button;
    }
    // If neither h3 nor button found, fallback to item heading
    if (!titleCell) {
      const h3 = item.querySelector('h3');
      if (h3) titleCell = h3;
    }
    // Content cell: the entire accordion-content region, preserving structure
    const contentCell = item.querySelector('.blte-accordion-item__content');
    // Only add row if both title and content exist
    if (titleCell && contentCell) {
      rows.push([titleCell, contentCell]);
    }
  });

  // Only replace with block if there's at least one item
  if (rows.length > 1) {
    const block = WebImporter.DOMUtils.createTable(rows, document);
    element.replaceWith(block);
  }
}

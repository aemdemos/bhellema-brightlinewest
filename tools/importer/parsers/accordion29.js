/* global WebImporter */
export default function parse(element, { document }) {
  // Block header as per spec
  const headerRow = ['Accordion (accordion29)'];
  const rows = [headerRow];

  // Find the main accordion container
  let accordionRoot = element.querySelector('.blte-accordion');
  if (!accordionRoot) accordionRoot = element;

  // The accordion items are generally found under direct children of accordionRoot
  const accordionItemNodes = Array.from(accordionRoot.querySelectorAll(':scope > div'))
    .map(div => div.querySelector('.blte-accordion-item') || (div.classList && div.classList.contains('blte-accordion-item') ? div : null))
    .filter(Boolean);

  // For each accordion item, pull the title and content
  accordionItemNodes.forEach(item => {
    // Title extraction: find .blte-title inside the .blte-accordion-item__title button
    const titleButton = item.querySelector('.blte-accordion-item__title');
    let titleContent = null;
    if (titleButton) {
      const blteTitle = titleButton.querySelector('.blte-title');
      if (blteTitle) {
        titleContent = blteTitle;
      } else {
        // fallback: use the button's text if .blte-title missing
        titleContent = document.createElement('span');
        titleContent.textContent = titleButton.textContent.trim();
      }
    } else {
      // fallback: look for a heading inside the item
      const fallbackHeading = item.querySelector('h3, h2, h4, h5, h6');
      if (fallbackHeading) {
        titleContent = fallbackHeading;
      }
    }
    // Content extraction: .blte-accordion-item__content (contains all HTML, not just text)
    const content = item.querySelector('.blte-accordion-item__content');
    if (titleContent && content) {
      rows.push([titleContent, content]);
    }
  });

  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}

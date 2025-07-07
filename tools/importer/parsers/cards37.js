/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to extract the <img> element from teaser
  function getImage(teaser) {
    // Find the first <img> inside the teaser image area
    const img = teaser.querySelector('.blte-teaser-v2__image img');
    return img || '';
  }

  // Helper to extract structured text content (title, date, description)
  function getTextCell(teaser) {
    // Create a fragment to collect nodes
    const frag = document.createDocumentFragment();

    // Title (should be heading style, preserve <a> link if present)
    const titleContainer = teaser.querySelector('.blte-teaser-v2__title');
    if (titleContainer) {
      // Copy the existing heading (h4 with a child <a>)
      const h4 = titleContainer.querySelector('h4');
      if (h4) {
        frag.appendChild(h4);
      }
    }

    // Description: date (optional) and main text
    const desc = teaser.querySelector('.blte-teaser-v2__description .blte-text');
    if (desc) {
      // Add each paragraph, separated by <br> for clarity, preserving structure
      Array.from(desc.children).forEach(child => {
        if (child.tagName === 'P' && child.textContent.trim()) {
          frag.appendChild(child);
        }
      });
    }
    return frag;
  }

  // Find the container <ul> for the cards
  const teasersList = element.querySelector('ul.blte-teasers-list__items');
  const cards = teasersList ? Array.from(teasersList.children) : [];

  // Build the table rows
  const cells = [
    ['Cards (cards37)'] // Header row, matching the example block name
  ];

  cards.forEach(card => {
    const image = getImage(card);
    const text = getTextCell(card);
    cells.push([
      image ? image : '',
      text
    ]);
  });

  // Create the table using the provided utility
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}

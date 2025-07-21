/* global WebImporter */
export default function parse(element, { document }) {
  // Create the header row exactly as needed
  const cells = [['Cards (cards41)']];

  // Find the main list of cards/teasers
  const ul = element.querySelector('.blte-teasers-list__items');
  if (ul) {
    ul.querySelectorAll(':scope > li').forEach((li) => {
      // Get image (first <img> inside picture)
      let imageEl = null;
      const picture = li.querySelector('.blte-teaser-v2__image picture');
      if (picture) {
        imageEl = picture.querySelector('img');
      }

      // Prepare text column content (title, description, CTA if present)
      // In this HTML, the only text is the CTA (Download Image)
      // But code in a way to collect all text content if present in future variants

      // Find title or heading (if exists)
      let titleEl = null;
      const possibleTitles = li.querySelectorAll('h1, h2, h3, h4, h5, h6');
      if (possibleTitles.length > 0) {
        titleEl = possibleTitles[0];
      }

      // Find description/paragraph (if exists)
      let descriptionEl = null;
      // Look for first <p> or any div/blte-text with text
      const description = li.querySelector('p, .blte-teaser-v2__description, .blte-text:not(:has(a))');
      if (description) {
        // Only use if it has textContent
        if (description.textContent.trim().length > 0) {
          descriptionEl = description;
        }
      }

      // Find CTA (Download Image link)
      const cta = li.querySelector('.blte-teaser-v2__content a, .blte-text a');

      // Construct content cell, respecting order: title, description, CTA
      const textCell = [];
      if (titleEl) textCell.push(titleEl);
      if (descriptionEl && (!titleEl || descriptionEl !== titleEl)) textCell.push(descriptionEl);
      if (cta) textCell.push(cta);

      // If none present, use '' so the table cell is not empty
      cells.push([
        imageEl || '',
        textCell.length ? textCell : ''
      ]);
    });
  }

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}

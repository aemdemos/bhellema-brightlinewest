/* global WebImporter */
export default function parse(element, { document }) {
  // Table header as specified
  const headerRow = ['Cards (cards21)'];
  const rows = [headerRow];

  // Find the main content area
  const listContent = element.querySelector('.blte-teasers-list__content');
  if (!listContent) return;

  // Find all card lists
  const cardUlLists = listContent.querySelectorAll('.blte-teasers-list__items');
  cardUlLists.forEach((ul) => {
    ul.querySelectorAll(':scope > li').forEach((li) => {
      // --- Image cell ---
      let imgCell = '';
      const imgWrapper = li.querySelector('.blte-teaser-v2__image picture');
      if (imgWrapper) {
        const img = imgWrapper.querySelector('img');
        if (img) {
          imgCell = img;
        } else {
          imgCell = imgWrapper;
        }
      }
      // --- Text cell: Gather heading, description, CTA if present ---
      let textParts = [];
      // Title (look for heading tags inside text area)
      const textArea = li.querySelector('.blte-teaser-v2__text-wrapper') || li;
      // Headings (h1-h6)
      const heading = textArea.querySelector('h1, h2, h3, h4, h5, h6');
      if (heading) {
        textParts.push(heading);
      }
      // Description (look for a paragraph or non-heading text in text area, or .blte-text that is not a link)
      let descriptionAdded = false;
      // Try to find paragraphs
      const paragraphs = textArea.querySelectorAll('p');
      paragraphs.forEach((p) => {
        if (p.textContent.trim()) {
          textParts.push(p);
          descriptionAdded = true;
        }
      });
      // Otherwise, if no <p>, try to find .blte-text nodes with text
      if (!descriptionAdded) {
        const descNodes = textArea.querySelectorAll('.blte-text');
        descNodes.forEach((d) => {
          // Avoid the CTA link
          if (!d.querySelector('a') && d.textContent.trim()) {
            textParts.push(d);
          }
        });
      }
      // Call to Action (link)
      const ctaWrapper = li.querySelector('.blte-teaser-v2__description .blte-text a, .blte-teaser-v2__content a');
      if (ctaWrapper) {
        textParts.push(ctaWrapper);
      }
      // If nothing found, fallback to any text nodes in text area
      if (textParts.length === 0 && textArea && textArea.textContent.trim()) {
        const div = document.createElement('div');
        div.textContent = textArea.textContent.trim();
        textParts.push(div);
      }
      // If still nothing, fallback to empty string
      let textCell = textParts.length ? textParts : '';
      rows.push([imgCell, textCell]);
    });
  });

  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}

/* global WebImporter */
export default function parse(element, { document }) {
  // Block header
  const headerRow = ['Cards (cards4)'];
  const rows = [headerRow];

  // For each card (li)
  element.querySelectorAll(':scope > li').forEach(card => {
    // Image cell: get <picture> (with <img>) if available
    const picture = card.querySelector('.blte-teaser-v2__image picture');
    const imageCell = picture || '';

    // Text cell: should include all available text and links
    const textCell = document.createElement('div');
    // Try for heading/label - prefer <img alt> if present
    let headingAdded = false;
    if (picture) {
      const img = picture.querySelector('img');
      if (img && img.alt && img.alt.trim()) {
        const strong = document.createElement('strong');
        strong.textContent = img.alt.trim();
        textCell.appendChild(strong);
        headingAdded = true;
      }
    }
    // If there is a text container, append all text (if any)
    const textGroups = Array.from(card.querySelectorAll('.blte-teaser-v2__text-group'));
    let foundText = false;
    textGroups.forEach(group => {
      const groupText = group.textContent.trim();
      // Avoid adding duplicate text (such as the alt text if already added)
      if (groupText && (!headingAdded || groupText !== textCell.textContent)) {
        const p = document.createElement('p');
        p.textContent = groupText;
        textCell.appendChild(p);
        foundText = true;
      }
    });
    // Add CTA if present
    const cta = card.querySelector('.blte-teaser-v2__content a');
    if (cta) textCell.appendChild(cta);
    // Fallback: if no text and no alt, add blank
    if (!textCell.childNodes.length) {
      textCell.textContent = '';
    }
    rows.push([
      imageCell,
      textCell
    ]);
  });
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}

/* global WebImporter */
export default function parse(element, { document }) {
  // Cards21 block: 2 columns, first row is block name, each subsequent row is a card (image/icon, text content)
  // The example: header is exactly 'Cards (cards21)'
  const rows = [['Cards (cards21)']];
  const contentRoot = element.querySelector('.blte-teasers-list__content');
  if (!contentRoot) return;
  // All ULs with cards
  const itemsWrappers = contentRoot.querySelectorAll('.blte-teasers-list__items');
  itemsWrappers.forEach((ul) => {
    ul.querySelectorAll('li').forEach((li) => {
      // First cell: image/icon (mandatory). Should be the <img> inside .blte-teaser-v2__image
      let imageCell = '';
      const imgWrap = li.querySelector('.blte-teaser-v2__image');
      if (imgWrap) {
        const img = imgWrap.querySelector('img');
        if (img) imageCell = img;
      }
      // Second cell: text content (may be only link in this variant)
      // Use the link inside .blte-teaser-v2__description > .blte-text > a, if exists
      let textContent = [];
      const desc = li.querySelector('.blte-teaser-v2__description');
      if (desc) {
        // We want the link (Download Image) as in original card
        const link = desc.querySelector('a');
        if (link) textContent.push(link);
      }
      // Defensive: if no image or link, use blank string for cell
      rows.push([
        imageCell || '',
        textContent.length > 0 ? textContent : ''
      ]);
    });
  });
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}

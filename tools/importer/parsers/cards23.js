/* global WebImporter */
export default function parse(element, { document }) {
  // Helper: Get the first image or icon in a feature item (may be absent)
  function getCardImage(item) {
    const iconImg = item.querySelector('.blte-feature-item__icon img');
    if (iconImg) return iconImg;
    const descImg = item.querySelector('.blte-feature-item__description img');
    if (descImg) return descImg;
    return '';
  }

  // Helper: Get the text content (title, desc, cta)
  function getCardTextContent(item) {
    const title = item.querySelector('.blte-feature-item__title h4');
    const desc = item.querySelector('.blte-feature-item__description');
    const cta = item.querySelector('.blte-feature-item__cta');
    const nodes = [];
    if (title) nodes.push(title);
    if (desc) nodes.push(desc);
    if (cta) nodes.push(cta);
    if (nodes.length === 1) return nodes[0];
    if (nodes.length > 1) {
      const wrapper = document.createElement('div');
      nodes.forEach(n => wrapper.appendChild(n));
      return wrapper;
    }
    return '';
  }

  const cardLists = element.querySelectorAll('ul.blte-features-grid__items');
  const cards = [];
  cardLists.forEach(ul => {
    ul.querySelectorAll(':scope > li.blte-feature-item').forEach(li => {
      cards.push(li);
    });
  });

  // Corrected: header is a single column, each row after is two columns
  const rows = [];
  rows.push(['Cards (cards23)']);
  cards.forEach(card => {
    const left = getCardImage(card);
    const right = getCardTextContent(card);
    rows.push([left, right]);
  });

  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}

/* global WebImporter */
export default function parse(element, { document }) {
  // Header: must be an array with a single cell
  const cells = [
    ['Cards (cards27)']
  ];

  // Find the UL containing the list of cards
  const ul = element.querySelector('ul.blte-teasers-list__items');
  if (ul) {
    ul.querySelectorAll(':scope > li').forEach((li) => {
      // Image (picture > img)
      let img = null;
      const pic = li.querySelector('picture');
      if (pic) {
        const image = pic.querySelector('img');
        if (image) img = image;
      }
      // Text cell: just CTA (Download Image link) for this content
      // If there is additional text in other variants, it would go here
      const textFrag = document.createDocumentFragment();
      const cta = li.querySelector('a[href]');
      if (cta) textFrag.appendChild(cta);
      cells.push([img, textFrag]);
    });
  }
  // Replace element with block table
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}

/* global WebImporter */
export default function parse(element, { document }) {
  // Table header matches example
  const headerRow = ['Cards (cards5)'];
  const cells = [headerRow];

  // Get all immediate li children (cards)
  const cards = element.querySelectorAll(':scope > li');
  cards.forEach((li) => {
    // 1. Find the first <img> in the card (always inside <picture>)
    const img = li.querySelector('picture img');

    // 2. Find the title. Use the <div> that contains the <h4> with <a>, for full structure
    let titleDiv = li.querySelector('.blte-teaser-v2__title');
    // fallback: just the h4 if needed
    if (!titleDiv) titleDiv = li.querySelector('h4');

    // 3. Find the description/call to action: the <div class="blte-teaser-v2__description">
    let descDiv = li.querySelector('.blte-teaser-v2__description');

    // Compose the text cell preserving all content/links
    const textCellContent = [];
    if (titleDiv) textCellContent.push(titleDiv);
    if (descDiv) textCellContent.push(descDiv);

    cells.push([
      img,
      textCellContent
    ]);
  });

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}

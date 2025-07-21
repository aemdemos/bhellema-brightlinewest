/* global WebImporter */
export default function parse(element, { document }) {
  // Define the header row per block guidelines
  const rows = [['Cards (cards20)']];

  // Select all top-level <li> items (each is a card)
  const cards = element.querySelectorAll(':scope > li');

  cards.forEach((li) => {
    // Card image: get the <img> inside card
    const img = li.querySelector('img');

    // Card call-to-action: get the download link
    // Some cards may not have a link, so fallback to blank if missing
    let link = li.querySelector('a');

    // The second cell must be an element or string, but if no link exists, use an empty string
    let textCell = link || '';

    // First cell: image; fallback to empty string if missing (defensive)
    let imageCell = img || '';

    rows.push([imageCell, textCell]);
  });

  // Create the table and replace the original block
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}

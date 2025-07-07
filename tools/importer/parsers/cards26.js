/* global WebImporter */
export default function parse(element, { document }) {
  // Header row as in the example
  const headerRow = ['Cards (cards26)'];
  const cells = [headerRow];

  // The cards are <li> inside the <ul>
  const ul = element.querySelector('ul');
  if (!ul) return;
  const lis = ul.querySelectorAll(':scope > li');

  lis.forEach(li => {
    // --- Image cell ---
    // Image is inside: .blte-teaser-v2__image picture > img
    let img = null;
    const imgPic = li.querySelector('.blte-teaser-v2__image picture');
    if (imgPic) {
      img = imgPic.querySelector('img');
    }

    // --- Text cell ---
    // Title is in .blte-teaser-v2__title h4 (with <a> inside)
    const textCell = document.createElement('div');
    let titleEl = li.querySelector('.blte-teaser-v2__title h4');
    if (titleEl) {
      // If it contains <a>, use that, else use <h4>
      const a = titleEl.querySelector('a');
      if (a) {
        // Use <strong> as in the markdown example, but reference <a> directly
        const strong = document.createElement('strong');
        strong.textContent = a.textContent.trim();
        textCell.appendChild(strong);
      } else {
        const strong = document.createElement('strong');
        strong.textContent = titleEl.textContent.trim();
        textCell.appendChild(strong);
      }
    }

    // 'Download Image' link is in .blte-teaser-v2__description a
    let downloadLink = null;
    const descLink = li.querySelector('.blte-teaser-v2__description a');
    if (descLink) {
      // Add <br> between title and link, as per visual structure
      if (textCell.childNodes.length > 0) {
        textCell.appendChild(document.createElement('br'));
      }
      textCell.appendChild(descLink);
    }

    // If both image and text content exist, add the row
    if (img && textCell.childNodes.length > 0) {
      cells.push([img, textCell]);
    }
  });

  // Only create and replace if we have at least one card row
  if (cells.length > 1) {
    const table = WebImporter.DOMUtils.createTable(cells, document);
    element.replaceWith(table);
  }
}

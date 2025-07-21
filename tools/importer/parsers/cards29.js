/* global WebImporter */
export default function parse(element, { document }) {
  // Compose rows for table data
  const rows = [];
  const cards = Array.from(element.querySelectorAll(':scope > li'));
  cards.forEach((li) => {
    // Get the image (prefer <picture> for responsive images)
    let imgEl = null;
    const picture = li.querySelector('picture');
    if (picture) {
      imgEl = picture;
    } else {
      const img = li.querySelector('img');
      imgEl = img || '';
    }
    // Get text/CTA content (CTA link is present)
    const cta = li.querySelector('a');
    const textContent = cta ? [cta] : '';
    rows.push([imgEl, textContent]);
  });

  // Manually construct the table to ensure header <th> has colspan=2
  const table = document.createElement('table');
  // Header row
  const trHeader = document.createElement('tr');
  const th = document.createElement('th');
  th.setAttribute('colspan', '2');
  th.textContent = 'Cards (cards29)';
  trHeader.appendChild(th);
  table.appendChild(trHeader);
  // Data rows
  rows.forEach((row) => {
    const tr = document.createElement('tr');
    row.forEach((cell) => {
      const td = document.createElement('td');
      if (typeof cell === 'string') {
        td.textContent = cell;
      } else if (Array.isArray(cell)) {
        cell.forEach((item) => td.append(item));
      } else if (cell) {
        td.append(cell);
      }
      tr.appendChild(td);
    });
    table.appendChild(tr);
  });

  element.replaceWith(table);
}

/* global WebImporter */
export default function parse(element, { document }) {
  // Helper: Get all card <li> elements from both <ul>s
  function getCardsList(root) {
    const uls = root.querySelectorAll('ul.blte-features-grid__items');
    const lis = [];
    uls.forEach(ul => {
      ul.querySelectorAll(':scope > li.blte-feature-item').forEach(li => {
        lis.push(li);
      });
    });
    return lis;
  }

  // Helper: Get first cell (image/icon if present)
  function getImageOrIcon(li) {
    // Priority: icon image, then description image, else ''
    const iconImg = li.querySelector('.blte-feature-item__icon img');
    if (iconImg) return iconImg;
    const descImg = li.querySelector('.blte-feature-item__description img');
    if (descImg) return descImg;
    // No image at all
    return '';
  }

  // Fix: For the Social Media card, walk its internal table and ensure all images are kept
  function fixSocialMediaTable(desc) {
    const table = desc.querySelector('table');
    if (!table) return desc;
    // For each row, make sure that if there's an <a> without an <img> but the cell originally contained an img, that img is kept
    // This only occurs on the Instagram row in the sample
    const trs = table.querySelectorAll('tr');
    trs.forEach(tr => {
      const tds = tr.querySelectorAll('td');
      tds.forEach(td => {
        // If this cell originally had an <img> but now only has an <a> (and that <a> is empty), move the <img> into the <a>
        const img = td.querySelector('img');
        const a = td.querySelector('a');
        if (a && img && !a.querySelector('img')) {
          // Move the img into the a
          a.appendChild(img);
        }
      });
    });
    return table;
  }

  // Helper: Get second cell: title, description, cta (all as DOM elements)
  function getTextCellContent(li) {
    const cell = [];
    // Title (keep heading tag)
    const title = li.querySelector('.blte-feature-item__title h1, .blte-feature-item__title h2, .blte-feature-item__title h3, .blte-feature-item__title h4, .blte-feature-item__title h5, .blte-feature-item__title h6');
    if (title) cell.push(title);

    // Description (handle tables and paragraphs/spans)
    const desc = li.querySelector('.blte-feature-item__description');
    if (desc) {
      // If there's a table in the description, fix it (for Social Media)
      const table = desc.querySelector('table');
      if (table) {
        cell.push(fixSocialMediaTable(desc));
      } else {
        // Add paragraphs and spans (but skip empty paragraphs)
        const blteText = desc.querySelector('.blte-text');
        if (blteText) {
          [...blteText.childNodes].forEach(node => {
            if (
              node.nodeType === 1 &&
              node.tagName === 'P' &&
              node.textContent.trim() === ''
            ) return;
            cell.push(node);
          });
        } else {
          // fallback: push what we have
          cell.push(desc);
        }
      }
    }

    // CTA (call-to-action button or link)
    const cta = li.querySelector('.blte-feature-item__cta a');
    if (cta) cell.push(cta);

    return cell.length === 1 ? cell[0] : cell;
  }

  // Compose the table rows
  const rows = [['Cards (cards23)']];
  const cards = getCardsList(element);
  cards.forEach(li => {
    const cell1 = getImageOrIcon(li);
    const cell2 = getTextCellContent(li);
    rows.push([cell1, cell2]);
  });

  // Output
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}

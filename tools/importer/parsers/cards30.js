/* global WebImporter */
export default function parse(element, { document }) {
  // Table header as in the example
  const rows = [['Cards (cards30)']];

  // Each <li> is a card
  const items = element.querySelectorAll(':scope > li');
  items.forEach((li) => {
    // --------- IMAGE COLUMN (always present) ----------
    let imageEl = null;
    const imageDiv = li.querySelector('.blte-teaser-v2__image');
    if (imageDiv) {
      // Use <picture> if available for semantic, else fallback to <img>
      const picture = imageDiv.querySelector('picture');
      if (picture) {
        imageEl = picture;
      } else {
        const img = imageDiv.querySelector('img');
        if (img) imageEl = img;
      }
    }

    // --------- TEXT COLUMN: Title, Description, CTA -----------
    const textNodes = [];
    // Title (as heading)
    let heading = null;
    const titleDiv = li.querySelector('.blte-teaser-v2__title');
    if (titleDiv) {
      // Use the existing heading element (e.g. h4) if present
      heading = titleDiv.querySelector('h1, h2, h3, h4, h5, h6');
      if (heading) textNodes.push(heading);
    }
    // Description (optional)
    const descDiv = li.querySelector('.blte-teaser-v2__description');
    if (descDiv) {
      // Only include blocks that aren't CTA
      Array.from(descDiv.childNodes).forEach((n) => {
        if (n.nodeType === 1) {
          // Only push if it's not a CTA
          if (!n.querySelector('a')) {
            textNodes.push(n);
          }
        } else if (n.nodeType === 3 && n.textContent.trim()) {
          // Text node
          const span = document.createElement('span');
          span.textContent = n.textContent.trim();
          textNodes.push(span);
        }
      });
    }
    // CTA (if present)
    let cta = null;
    if (descDiv) {
      cta = descDiv.querySelector('a');
      if (cta) textNodes.push(cta);
    }

    // Fallback: If no description or CTA, check for stray content
    if (!descDiv || (!descDiv.textContent.trim() && !cta)) {
      const textContentDiv = li.querySelector('.blte-teaser-v2__text');
      if (textContentDiv && textContentDiv.textContent.trim()) {
        const p = document.createElement('p');
        p.textContent = textContentDiv.textContent.trim();
        textNodes.push(p);
      }
    }

    // Only include non-empty elements
    const textCell = textNodes.filter((item) => {
      if (!item) return false;
      if (typeof item === 'string') return item.trim().length > 0;
      if (item.nodeType === 1) return item.textContent.trim().length > 0;
      return false;
    });

    rows.push([
      imageEl,
      textCell.length === 1 ? textCell[0] : textCell
    ]);
  });

  // Build the block table and replace
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}

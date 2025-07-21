/* global WebImporter */
export default function parse(element, { document }) {
  // 1. Header row EXACTLY matching the example
  const headerRow = ['Hero (hero39)'];

  // 2. Find the first <picture> element for the image row
  // This should robustly get the background image, as required
  let picture = element.querySelector('picture');
  const imageRow = [picture || ''];

  // 3. Robustly get the block of text content
  // The hero text is within .blte-hero__text or, as fallback, the next best text block
  let textBlock = element.querySelector('.blte-hero__text');

  // If not found, attempt to find a suitable text block (looking for divs with text, not image wrappers)
  if (!textBlock) {
    // Find all divs that have some text and not just images
    const divs = Array.from(element.querySelectorAll('div')).filter(div => {
      // Should have some text content
      return div.textContent && div.textContent.trim().length > 0 && !div.querySelector('picture');
    });
    // Use the largest
    textBlock = divs.sort((a, b) => b.textContent.length - a.textContent.length)[0];
  }

  // Now, get all children (preserves headings, paragraphs, etc.)
  let textCell;
  if (textBlock && textBlock.textContent.trim()) {
    // Prefer to reference all direct children so structure is preserved, but if no children just use itself
    if (textBlock.children && textBlock.children.length > 0) {
      textCell = Array.from(textBlock.children);
    } else {
      textCell = [textBlock];
    }
  } else {
    textCell = [''];
  }
  const textRow = [textCell];

  // Compose the table
  const rows = [headerRow, imageRow, textRow];
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}

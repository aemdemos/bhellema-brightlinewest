/* global WebImporter */
export default function parse(element, { document }) {
  // Build header row exactly as required
  const headerRow = ['Hero (hero33)'];

  // Extract the image (background image for the hero)
  let image = null;
  const mediaAttachment = element.querySelector('.blte-text-and-media__media__attachment');
  if (mediaAttachment) {
    image = mediaAttachment.querySelector('img');
  }

  // Prepare the content cell
  const content = element.querySelector('.blte-text-and-media__content');
  let contentElements = [];
  if (content) {
    // Eyebrow (optional)
    const eyebrow = content.querySelector('.blte-text-and-media__content__eyebrow');
    if (eyebrow) contentElements.push(eyebrow);
    // Title (h2)
    // The h2 may be wrapped in .blte-font--variant-h2 or just have .blte-title
    let title = content.querySelector('.blte-font--variant-h2 h2, .blte-title');
    if (title) contentElements.push(title);
    // Date or subheading (optional, contained in first <p> of description)
    const description = content.querySelector('.blte-text-and-media__content__description .blte-text');
    if (description) {
      // All paragraphs from the description
      const ps = Array.from(description.querySelectorAll('p'));
      contentElements.push(...ps);
    }
    // CTA button (optional)
    const cta = content.querySelector('.blte-text-and-media__content__buttons a, .blte-btn');
    if (cta) contentElements.push(cta);
  }

  // Arrange table rows as per the block spec: header, image, then content
  const rows = [
    headerRow,
    [image ? image : ''],
    [contentElements]
  ];

  // Replace original element with the structured block table
  const block = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(block);
}

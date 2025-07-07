/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main hero block
  const heroBlock = element.querySelector('.blte-text-and-media');

  // Row 2: Image
  let imageElem = null;
  if (heroBlock) {
    const pic = heroBlock.querySelector('picture');
    if (pic) imageElem = pic;
  }

  // Row 3: Content (headline, eyebrow, paragraphs, CTA)
  let contentParts = [];
  if (heroBlock) {
    const content = heroBlock.querySelector('.blte-text-and-media__content');
    if (content) {
      // Eyebrow or subheading
      const eyebrow = content.querySelector('.blte-text-and-media__content__eyebrow');
      if (eyebrow) contentParts.push(eyebrow);
      // Title (should be h2)
      const title = content.querySelector('h2, .blte-title');
      if (title) contentParts.push(title);
      // Description (may contain date and paragraph)
      const description = content.querySelector('.blte-text-and-media__content__description');
      if (description) contentParts.push(description);
      // CTA
      const cta = content.querySelector('.blte-text-and-media__content__buttons');
      if (cta) contentParts.push(cta);
    }
  }

  // If no content found, add placeholder so table remains valid
  if (contentParts.length === 0) contentParts = [''];

  // Assemble table as: header, image row, content row
  const cells = [
    ['Hero (hero33)'],
    [imageElem],
    [contentParts]
  ];

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}

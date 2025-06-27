/* global WebImporter */
export default function parse(element, { document }) {
  // Get the deepest blte-text-and-media block in the structure
  function findTextAndMediaBlock(root) {
    const blocks = root.querySelectorAll('.blte-text-and-media');
    if (blocks.length) {
      return blocks[blocks.length - 1];
    }
    return null;
  }
  const textAndMedia = findTextAndMediaBlock(element);
  if (!textAndMedia) return;

  // Extract the image (which may be inside a <picture> tag)
  let imageElem = null;
  const mediaAttachment = textAndMedia.querySelector('.blte-text-and-media__media__attachment');
  if (mediaAttachment) {
    // If there's a <picture> element, reference it directly
    const picture = mediaAttachment.querySelector('picture');
    if (picture) {
      imageElem = picture;
    } else {
      // fallback to img if picture not present
      const img = mediaAttachment.querySelector('img');
      if (img) {
        imageElem = img;
      }
    }
  }

  // Extract all content: eyebrow (h6), title (h2), description, CTA
  const content = textAndMedia.querySelector('.blte-text-and-media__content');
  let contentNodes = [];
  if (content) {
    // Eyebrow (optional h6)
    const eyebrow = content.querySelector('.blte-text-and-media__content__eyebrow');
    if (eyebrow) contentNodes.push(eyebrow);
    // Title (optional h2)
    const title = content.querySelector('.blte-font--variant-h2');
    if (title) contentNodes.push(title);
    // Description (optional)
    const desc = content.querySelector('.blte-text-and-media__content__description');
    if (desc) contentNodes.push(desc);
    // CTA Button (optional)
    const btns = content.querySelector('.blte-text-and-media__content__buttons');
    if (btns) contentNodes.push(btns);
  }

  // Compose the table as per instructions
  const cells = [
    ['Hero (hero11)'],
    [imageElem ? imageElem : ''],
    [contentNodes.length ? contentNodes : '']
  ];

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}

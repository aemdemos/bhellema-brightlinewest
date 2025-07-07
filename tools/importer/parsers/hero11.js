/* global WebImporter */
export default function parse(element, { document }) {
  // Find the innermost .blte-text-and-media block
  const textAndMedia = element.querySelector('.blte-text-and-media');
  if (!textAndMedia) return;

  // Find the image/media: only the <picture> or <img> in the media column
  let mediaCell = null;
  const media = textAndMedia.querySelector('.blte-text-and-media__media__attachment');
  if (media) {
    const picture = media.querySelector('picture');
    const img = media.querySelector('img');
    // Prefer <picture>, but fallback to <img>
    if (picture) {
      mediaCell = picture;
    } else if (img) {
      mediaCell = img;
    }
  }

  // Find the content column (headings, description, cta)
  const content = textAndMedia.querySelector('.blte-text-and-media__content');
  let contentItems = [];
  if (content) {
    // Eyebrow (optional)
    const eyebrow = content.querySelector('.blte-text-and-media__content__eyebrow');
    if (eyebrow) contentItems.push(eyebrow);
    // Title (h2, optional)
    const title = content.querySelector('.blte-font--variant-h2');
    if (title) contentItems.push(title);
    // Description (optional)
    const desc = content.querySelector('.blte-text-and-media__content__description');
    if (desc) contentItems.push(desc);
    // Button(s) or CTA(s) (optional)
    const buttons = content.querySelectorAll('.blte-text-and-media__content__buttons a');
    if (buttons.length > 0) {
      buttons.forEach(btn => contentItems.push(btn));
    }
  }
  // If contentItems is empty but content exists, add the whole content as fallback
  if (contentItems.length === 0 && content) {
    contentItems.push(content);
  }
  // If no content at all, fallback gracefully
  if (contentItems.length === 0) {
    contentItems = [''];
  }

  // Compose table rows as per block definition: 1 col x 3 rows
  const rows = [
    ['Hero (hero11)'],
    [mediaCell],
    [contentItems.length === 1 ? contentItems[0] : contentItems]
  ];

  // Create and replace
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}

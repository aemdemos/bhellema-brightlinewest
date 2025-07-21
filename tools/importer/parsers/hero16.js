/* global WebImporter */
export default function parse(element, { document }) {
  // Construct header row as in the example
  const headerRow = ['Hero (hero16)'];

  // Find the hero image (picture or img) inside .blte-hero__image
  let imageEl = null;
  const heroImgWrapper = element.querySelector('.blte-hero__image');
  if (heroImgWrapper) {
    imageEl = heroImgWrapper.querySelector('picture, img');
  }

  // Find the hero text block. Use the entire text block for resilience.
  let textEl = null;
  const heroTextWrapper = element.querySelector('.blte-hero__text');
  if (heroTextWrapper) {
    textEl = heroTextWrapper;
  }

  // Compose table rows. Each cell is an array member; filter out missing elements.
  const rows = [
    headerRow,
    [imageEl].filter(Boolean),
    [textEl].filter(Boolean)
  ];

  // Create and replace
  const block = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(block);
}

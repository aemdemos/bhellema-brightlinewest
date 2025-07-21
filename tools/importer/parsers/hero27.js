/* global WebImporter */
export default function parse(element, { document }) {
  // Find the hero wrapper containing the image and text
  const heroWrapper = element.querySelector('.blte-hero__wrapper');
  if (!heroWrapper) return;

  // Find the hero block (contains image and text)
  const heroBlock = heroWrapper.querySelector('.blte-hero');
  if (!heroBlock) return;

  // Find the hero image: prefer the <picture> if present, else fallback to .blte-hero__image img
  let heroImage = '';
  const imageContainer = heroBlock.querySelector('.blte-hero__image');
  if (imageContainer) {
    const picture = imageContainer.querySelector('picture');
    if (picture) {
      heroImage = picture;
    } else {
      const img = imageContainer.querySelector('img');
      if (img) heroImage = img;
    }
  }

  // Find the hero text: heading, subheading, cta (if present)
  const heroTextArea = heroBlock.querySelector('.blte-hero__text');

  const textFragments = [];
  if (heroTextArea) {
    // Go through all direct children of .blte-hero__text, keep their content structure
    // In this case, usually a .blte-hero__text-wrapper with headings
    const textWrapper = heroTextArea.querySelector('.blte-hero__text-wrapper');
    if (textWrapper) {
      // Push all child elements (this preserves heading levels and spans)
      Array.from(textWrapper.childNodes).forEach((node) => {
        if (node.nodeType === Node.ELEMENT_NODE || (node.nodeType === Node.TEXT_NODE && node.textContent.trim())) {
          textFragments.push(node);
        }
      });
    } else {
      // Fallback: use text content if structure is missing
      if (heroTextArea.textContent.trim()) {
        const p = document.createElement('p');
        p.textContent = heroTextArea.textContent.trim();
        textFragments.push(p);
      }
    }
  }

  // Compose the table according to guidelines
  const cells = [
    ['Hero (hero27)'],
    [heroImage ? heroImage : ''],
    [textFragments.length ? textFragments : ''],
  ];

  const table = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the heroWrapper with the table
  heroWrapper.replaceWith(table);
}

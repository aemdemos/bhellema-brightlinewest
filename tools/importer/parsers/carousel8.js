/* global WebImporter */
export default function parse(element, { document }) {
  // Find the carousel section
  const carouselSection = element.querySelector('section.carousel');
  if (!carouselSection) return;

  // Find all slides
  const slideNodes = carouselSection.querySelectorAll('.blte-carousel__slide');

  // Header row for the block table (EXACTLY one cell with 'Carousel')
  const rows = [['Carousel']];

  // For each slide, extract image and text content (always two cells per row)
  slideNodes.forEach((slide) => {
    // 1. Image cell (mandatory, must be the image element, not a link)
    let image = '';
    const imageContainer = slide.querySelector('.blte-hero__image');
    if (imageContainer) {
      const img = imageContainer.querySelector('img');
      if (img) image = img;
    }

    // 2. Text content cell (optional, but must be present as a cell, even if empty)
    let textContent = '';
    const textContainer = slide.querySelector('.blte-hero__text');
    if (textContainer) {
      // If the wrapper has children, use them, otherwise use all children of textContainer
      const wrapper = textContainer.querySelector('.blte-hero__text-wrapper');
      let kids = [];
      if (wrapper && wrapper.childNodes.length > 0) {
        kids = Array.from(wrapper.childNodes).filter(node => {
          // Only keep element nodes or non-empty text nodes
          return (node.nodeType === Node.ELEMENT_NODE && node.textContent.trim().length > 0) ||
                 (node.nodeType === Node.TEXT_NODE && node.textContent.trim().length > 0);
        });
      } else {
        kids = Array.from(textContainer.childNodes).filter(node => {
          return (node.nodeType === Node.ELEMENT_NODE && node.textContent.trim().length > 0) ||
                 (node.nodeType === Node.TEXT_NODE && node.textContent.trim().length > 0);
        });
      }
      if (kids.length === 1) textContent = kids[0];
      else if (kids.length > 1) textContent = kids;
      // If kids is empty, textContent remains ''
    }
    // Always push a two-cell row (image, textContent)
    rows.push([image, textContent]);
  });

  // Create and replace
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}

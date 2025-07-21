/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main section containing the carousel (should always exist)
  const section = element.querySelector('section.carousel') || element;

  // Find the first slide containing the hero (or fallback to section)
  let slide = section.querySelector('.blte-carousel__slide') || section;

  // Find the hero container (if present)
  let hero = slide.querySelector('.blte-hero') || slide;

  // --- IMAGE/BACKGROUND ROW (2nd row) ---
  // Try to find the picture or image for the hero background
  let imageCellContent = [];
  const heroImage = hero.querySelector('.blte-hero__image picture') || hero.querySelector('picture');
  if (heroImage) {
    imageCellContent.push(heroImage);
  } else {
    // fallback to <img> if <picture> is not present
    const heroImgTag = hero.querySelector('.blte-hero__image img') || hero.querySelector('img');
    if (heroImgTag) imageCellContent.push(heroImgTag);
  }

  // --- TEXT ROW (3rd row) ---
  // Try to get all textual content from the hero text area (should include all headings and possible CTAs)
  let textCellContent = [];
  const heroText = hero.querySelector('.blte-hero__text');
  if (heroText) {
    // Collect all direct children with textual meaning (headings, paragraphs, wrappers)
    // This ensures heading levels and structure are maintained
    textCellContent = Array.from(heroText.children).filter(child => {
      // Only meaningful elements, skip empty
      return !!child.textContent.trim();
    });
    // Fallback: If nothing found, use the heroText itself (could be inlined)
    if (textCellContent.length === 0 && heroText.textContent.trim()) {
      textCellContent = [heroText];
    }
  }
  // Fallback: find all headings and paragraphs inside hero
  if (textCellContent.length === 0) {
    const headingsAndPs = hero.querySelectorAll('h1, h2, h3, h4, h5, h6, p');
    if (headingsAndPs.length) {
      textCellContent = Array.from(headingsAndPs).filter(el => el.textContent.trim());
    }
  }
  // Fallback: use section's text content if all else fails
  if (textCellContent.length === 0 && section.textContent.trim()) {
    textCellContent = [section];
  }

  // Compose the block table as per structure: header, image row, text row
  const cells = [
    ['Hero (hero8)'],
    [imageCellContent.length ? imageCellContent : ''],
    [textCellContent.length ? textCellContent : '']
  ];
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}

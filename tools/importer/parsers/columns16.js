/* global WebImporter */
export default function parse(element, { document }) {
  // Get the slider track containing real slides
  const slickSlider = element.querySelector('.slick-slider');
  if (!slickSlider) return;
  const slickTrack = slickSlider.querySelector('.slick-track');
  if (!slickTrack) return;

  // Only slides that are not cloned
  const realSlides = Array.from(slickTrack.children).filter(slide =>
    slide.classList.contains('slick-slide') &&
    !slide.classList.contains('slick-cloned')
  );

  // Helper to extract all content from .blte-carousel__slide for maximal robustness
  function getSlideContent(slide) {
    // Find slide content element
    let slideContent = slide.querySelector('.blte-carousel__slide');
    if (!slideContent) slideContent = slide;
    const nodes = [];
    // Go through all childNodes to get elements and texts, including empty elements
    slideContent.childNodes.forEach(node => {
      if (node.nodeType === Node.ELEMENT_NODE) {
        // If <h3> is present, ensure its textContent is included if empty
        if (
          node.tagName.toLowerCase() === 'h3' &&
          node.textContent.trim() === ''
        ) {
          // If h3 is empty, still include it (as in the source html)
          nodes.push(node);
        } else if (node.textContent.trim() !== '' || node.children.length > 0) {
          // Include the element if it or its children have content
          nodes.push(node);
        } else if (node.innerHTML.trim() !== '') {
          // Defensive: include elements with non-empty HTML
          nodes.push(node);
        }
      } else if (node.nodeType === Node.TEXT_NODE && node.textContent.trim() !== '') {
        nodes.push(document.createTextNode(node.textContent));
      }
    });
    // If nothing, return empty string; if one, return it; else array
    if (nodes.length === 0) return '';
    if (nodes.length === 1) return nodes[0];
    return nodes;
  }

  // Table structure: header, then 2 columns per row
  const cells = [];
  cells.push(['Columns (columns16)']);
  for (let i = 0; i < realSlides.length; i += 2) {
    const row = [];
    row.push(getSlideContent(realSlides[i]));
    if (realSlides[i+1]) row.push(getSlideContent(realSlides[i+1]));
    cells.push(row);
  }

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}

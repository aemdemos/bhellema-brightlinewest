/* global WebImporter */
export default function parse(element, { document }) {
  // The header row must match exactly
  const headerRow = ['Columns (columns16)'];

  // Find the main slider and the slick-track containing the slides
  const slider = element.querySelector('.slick-slider');
  if (!slider) return;
  const slickList = slider.querySelector('.slick-list');
  if (!slickList) return;
  const slickTrack = slickList.querySelector('.slick-track');
  if (!slickTrack) return;

  // Select only the direct .slick-slide children that are not clones (the visible columns)
  const slides = Array.from(slickTrack.querySelectorAll(':scope > .slick-slide'))
    .filter(slide => !slide.classList.contains('slick-cloned'));
  if (!slides.length) return;

  // Each slide contains .blte-carousel__slide, include all its children (picture, text, etc.)
  // Ensure that text nodes (like captions) are included
  const columnCells = slides.map(slide => {
    const slideBlock = slide.querySelector('.blte-carousel__slide');
    if (!slideBlock) return '';
    // Gather all child nodes, including text nodes with visible content
    const contents = [];
    for (const node of slideBlock.childNodes) {
      if (node.nodeType === Node.ELEMENT_NODE) {
        contents.push(node);
      } else if (node.nodeType === Node.TEXT_NODE && node.textContent.trim()) {
        // Wrap stray text in <p> to preserve semantic value
        const p = document.createElement('p');
        p.textContent = node.textContent.trim();
        contents.push(p);
      }
    }
    // If no children, fallback to the slideBlock itself
    return contents.length ? contents : slideBlock;
  });

  // Build the table: header, then one row with a cell for each extracted column
  const cells = [headerRow, columnCells];
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}

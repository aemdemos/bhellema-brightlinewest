/* global WebImporter */
export default function parse(element, { document }) {
  // Find the carousel section within the element
  let carouselSection = element.querySelector('section.carousel');
  if (!carouselSection) {
    carouselSection = element.querySelector('div.carousel');
  }
  if (!carouselSection) {
    if (element.classList.contains('carousel') || element.querySelector('[data-cmp-react="Carousel"]')) {
      carouselSection = element;
    } else {
      return;
    }
  }

  // Find all slides: either .slick-slide in .slick-track or .blte-carousel__slide
  let slides = [];
  const slickTrack = carouselSection.querySelector('.slick-track');
  if (slickTrack) {
    slides = Array.from(slickTrack.querySelectorAll('.slick-slide'));
  }
  if (!slides.length) {
    slides = Array.from(carouselSection.querySelectorAll('.blte-carousel__slide'));
  }
  if (!slides.length) {
    const singleSlide = carouselSection.querySelector('.blte-carousel__slide');
    if (singleSlide) slides = [singleSlide];
  }
  if (!slides.length) return;

  const rows = [['Carousel']];

  slides.forEach((slide) => {
    let slideRoot = slide;
    // .slick-slide may wrap .blte-carousel__slide
    if (slide.classList.contains('slick-slide')) {
      const nested = slide.querySelector('.blte-carousel__slide');
      if (nested) slideRoot = nested;
    }
    // IMAGE: look for .blte-hero__image or <img> or <picture>
    let imageEl = null;
    let heroImgContainer = slideRoot.querySelector('.blte-hero__image');
    if (heroImgContainer) {
      imageEl = heroImgContainer.querySelector('picture') || heroImgContainer.querySelector('img');
    } else {
      imageEl = slideRoot.querySelector('picture') || slideRoot.querySelector('img');
    }
    if (!imageEl) return;

    // TEXT: robustly extract all possible text content for the right cell
    let textCell = '';
    // Prefer all .blte-hero__text descendants (not just direct child)
    let textAreas = Array.from(slideRoot.querySelectorAll('.blte-hero__text, .blte-hero__text-wrapper'));
    // Gather all text nodes, headings, paragraphs, etc. in those text areas
    const contentNodes = [];
    textAreas.forEach(area => {
      // If area itself is empty, skip
      if (!area.textContent.trim()) return;
      // Push all children if any, otherwise the area itself
      if (area.children.length > 0) {
        contentNodes.push(...Array.from(area.children));
      } else {
        contentNodes.push(area);
      }
    });
    // If no .blte-hero__text areas, fallback: get all children not .blte-hero__image
    if (contentNodes.length === 0) {
      let children = Array.from(slideRoot.children).filter(c => !c.classList.contains('blte-hero__image'));
      // Only add those with non-empty text
      children.forEach(child => {
        if (child.textContent.trim()) {
          contentNodes.push(child);
        }
      });
    }
    // If there are text content nodes, use them, else use ''
    if (contentNodes.length > 0) {
      textCell = contentNodes;
    } else {
      textCell = '';
    }
    rows.push([imageEl, textCell]);
  });

  const table = WebImporter.DOMUtils.createTable(rows, document);
  // Set colspan=2 on the header cell (first row's only th element)
  const headerRow = table.querySelector('tr');
  if (headerRow && headerRow.children.length === 1) {
    headerRow.children[0].setAttribute('colspan', '2');
  }

  element.replaceWith(table);
}

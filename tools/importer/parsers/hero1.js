/* global WebImporter */
export default function parse(element, { document }) {
  // 1. Find the actual hero container
  // The hero block is within .blte-hero__wrapper or deeper
  const heroWrapper = element.querySelector('.blte-hero__wrapper, [data-cmp-react="HeroImage"]') || element;
  // Find the main hero container
  const hero = heroWrapper.querySelector('.blte-hero') || heroWrapper.querySelector('[data-cmp-react="HeroImage"]') || heroWrapper;

  // 2. Image row: get the <picture> element (background image)
  let imageCell = '';
  const imageDiv = hero.querySelector('.blte-hero__image');
  if (imageDiv) {
    const pic = imageDiv.querySelector('picture');
    if (pic) {
      imageCell = pic;
    } else {
      imageCell = imageDiv;
    }
  }

  // 3. Text row: get the hero text
  let textCell = '';
  const textDiv = hero.querySelector('.blte-hero__text');
  if (textDiv) {
    textCell = textDiv;
  }

  // 4. Compose the table exactly as the spec (single column, 3 rows)
  const cells = [
    ['Hero (hero1)'],
    [imageCell],
    [textCell],
  ];

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}

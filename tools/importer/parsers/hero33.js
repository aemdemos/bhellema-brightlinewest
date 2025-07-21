/* global WebImporter */
export default function parse(element, { document }) {
  // Find the .blte-hero block inside the element
  const hero = element.querySelector('.blte-hero');
  if (!hero) return;

  // Get the image element (the <picture> from hero image container)
  let imgEl = null;
  const imgContainer = hero.querySelector('.blte-hero__image');
  if (imgContainer) {
    // Reference the picture or img element as-is
    const pic = imgContainer.querySelector('picture');
    if (pic) {
      imgEl = pic;
    } else {
      const img = imgContainer.querySelector('img');
      if (img) imgEl = img;
    }
  }

  // Get the text section (contains all headline/subheadline/call to action)
  let textContent = null;
  const textSection = hero.querySelector('.blte-hero__text');
  if (textSection) {
    // Reference the wrapper directly to preserve all inner structure
    textContent = textSection;
  }

  // Build cells array
  const cells = [
    ['Hero (hero33)'],
    [imgEl],
    [textContent],
  ];

  // Create the block table
  const table = WebImporter.DOMUtils.createTable(cells, document);
  // Replace the original element with the new table
  element.replaceWith(table);
}

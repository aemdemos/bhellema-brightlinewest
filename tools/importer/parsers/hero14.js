/* global WebImporter */
export default function parse(element, { document }) {
  // 1. Find the hero block (the element with class .blte-hero)
  const hero = element.querySelector('.blte-hero');
  if (!hero) return;

  // 2. Extract the hero image: .blte-hero__image contains the <picture> (preferred) or <img>
  let imageEl = null;
  const imageContainer = hero.querySelector('.blte-hero__image');
  if (imageContainer) {
    // Prefer the <picture> if present
    const picture = imageContainer.querySelector('picture');
    if (picture) {
      imageEl = picture;
    } else {
      // fallback to <img> if no <picture>
      const img = imageContainer.querySelector('img');
      if (img) imageEl = img;
    }
  }

  // 3. Extract the text container (headline and any text)
  // This can be the .blte-hero__text element
  let textEl = null;
  const textContainer = hero.querySelector('.blte-hero__text');
  if (textContainer) {
    textEl = textContainer;
  }

  // 4. Build the block table
  // The header row must match: 'Hero (hero14)'
  const rows = [
    ['Hero (hero14)']
  ];

  // 2nd row: image (background image)
  if (imageEl) rows.push([imageEl]);
  else rows.push(['']); // Ensure a row even if missing

  // 3rd row: headline/text (title, subheading, CTA, etc.)
  if (textEl) rows.push([textEl]);
  else rows.push(['']); // Ensure a row even if missing

  // 5. Create the table and replace the original element
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}

/* global WebImporter */
export default function parse(element, { document }) {
  // Find the hero block (blte-hero)
  const hero = element.querySelector('.blte-hero');
  if (!hero) return;

  // IMAGE ROW: Find the hero image (img or picture)
  let heroImg = '';
  const heroImgContainer = hero.querySelector('.blte-hero__image');
  if (heroImgContainer) {
    const img = heroImgContainer.querySelector('img');
    if (img) {
      heroImg = img;
    } else {
      const picture = heroImgContainer.querySelector('picture');
      if (picture) heroImg = picture;
    }
  }

  // TEXT ROW: Gather all text content from the hero text area
  let heroTextContent = [];
  const heroText = hero.querySelector('.blte-hero__text');
  if (heroText) {
    // If there's a wrapper, use its children, else use all heroText children
    const textWrapper = heroText.querySelector('.blte-hero__text-wrapper');
    const container = textWrapper || heroText;
    // Grab all child elements in original order
    heroTextContent = Array.from(container.children).filter(child => child.textContent.trim() || child.querySelector('a'));
    // If nothing found, fall back to the text itself if it's not empty
    if (heroTextContent.length === 0 && heroText.textContent.trim()) {
      heroTextContent = [heroText];
    }
  }

  // Build the table
  const cells = [
    ['Hero (hero6)'],
    [heroImg ? heroImg : ''],
    [heroTextContent.length ? heroTextContent : '']
  ];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}

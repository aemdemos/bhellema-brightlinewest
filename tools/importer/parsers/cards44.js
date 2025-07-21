/* global WebImporter */
export default function parse(element, { document }) {
  // Find the teasers list (cards container)
  const teasersList = element.querySelector('.blte-teasers-list__items');
  if (!teasersList) return;
  const cards = Array.from(teasersList.children);

  const headerRow = ['Cards (cards44)'];
  const rows = cards.map((li) => {
    // Image/Icon cell: use the first <img> inside a .blte-teaser-v2__image (or <picture> as backup)
    let imgCell = null;
    const imgContainer = li.querySelector('.blte-teaser-v2__image');
    if (imgContainer) {
      const img = imgContainer.querySelector('img');
      if (img) {
        imgCell = img;
      } else {
        // fallback: use picture element
        const pic = imgContainer.querySelector('picture');
        if (pic) imgCell = pic;
      }
    }

    // Text content cell: title (h4), description, CTA
    const contentArr = [];
    // Title
    const title = li.querySelector('.blte-teaser-v2__title h4');
    if (title) contentArr.push(title);
    // Description
    const desc = li.querySelector('.blte-teaser-v2__description .blte-text');
    if (desc) {
      // Use the direct <div> child if present (for formatting), else the .blte-text
      const descDiv = desc.querySelector('div') || desc;
      contentArr.push(descDiv);
    }
    // CTA
    const cta = li.querySelector('.blte-teaser-v2__cta a');
    if (cta) contentArr.push(cta);

    return [imgCell, contentArr];
  });

  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    ...rows
  ], document);
  element.replaceWith(table);
}

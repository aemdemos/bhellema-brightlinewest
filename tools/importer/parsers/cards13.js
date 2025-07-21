/* global WebImporter */
export default function parse(element, { document }) {
  const headerRow = ['Cards (cards13)'];
  const cells = [headerRow];

  // Get the teasers-list__content block
  let teasersContent = element.querySelector('.blte-teasers-list__content');
  if (!teasersContent) {
    const teasersList = element.querySelector('.blte-teasers-list');
    if (teasersList) {
      teasersContent = teasersList.querySelector('.blte-teasers-list__content');
    }
  }
  if (!teasersContent) return;

  // Find all <ul> blocks containing cards
  const itemsWrapper = teasersContent.querySelector('.blte-teasers-list__items-wrapper');
  if (!itemsWrapper) return;
  const allUls = itemsWrapper.querySelectorAll('ul');
  if (!allUls.length) return;

  allUls.forEach(ul => {
    ul.querySelectorAll('li').forEach(li => {
      // Image
      let img = null;
      const imageContainer = li.querySelector('.blte-teaser-v2__image');
      if (imageContainer) {
        img = imageContainer.querySelector('img');
      }

      // Card Text Content: Look for heading, description, and CTA
      const textCellContent = [];
      // 1. Heading (look for h1-h6, b, strong inside any text group)
      let heading = null;
      let description = null;
      // Prefer heading tags first
      const possibleHeading = li.querySelector('.blte-teaser-v2__text h1, .blte-teaser-v2__text h2, .blte-teaser-v2__text h3, .blte-teaser-v2__text h4, .blte-teaser-v2__text h5, .blte-teaser-v2__text h6, .blte-teaser-v2__text strong, .blte-teaser-v2__text b');
      if (possibleHeading) {
        heading = possibleHeading;
      }
      // 2. Description (paragraph or text, after heading)
      // Try to find a p or div with text after heading, or within .blte-teaser-v2__text
      const textGroups = li.querySelectorAll('.blte-teaser-v2__text-group, .blte-teaser-v2__text');
      let foundDescription = false;
      textGroups.forEach(group => {
        // Find p or text nodes not in heading
        group.childNodes.forEach(child => {
          if (!foundDescription && child.nodeType === 1 && child.tagName === 'P') {
            description = child;
            foundDescription = true;
          }
        });
        // If not found, fallback to any text node
        if (!foundDescription) {
          const text = group.textContent && group.textContent.trim();
          if (text && (!heading || text !== heading.textContent.trim())) {
            description = document.createElement('div');
            description.textContent = text;
            foundDescription = true;
          }
        }
      });
      if (heading) textCellContent.push(heading);
      if (description) textCellContent.push(description);
      // 3. CTA (link inside .blte-teaser-v2__description .blte-text a)
      const ctaLink = li.querySelector('.blte-teaser-v2__content .blte-teaser-v2__description .blte-text a');
      if (ctaLink) textCellContent.push(ctaLink);
      // If none of the above were found, fallback to just CTA
      if (textCellContent.length === 0 && ctaLink) textCellContent.push(ctaLink);
      // If still nothing, provide empty string
      if (textCellContent.length === 0) textCellContent.push('');

      cells.push([img, textCellContent]);
    });
  });

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}

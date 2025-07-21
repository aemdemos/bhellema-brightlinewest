/* global WebImporter */
export default function parse(element, { document }) {
  // The table must match the example structure and header
  const headerRow = ['Hero (hero3)'];
  const backgroundRow = [''];

  // Find breadcrumbs nav (which should NOT be included in the hero content)
  const breadcrumbNav = element.querySelector('nav.blte-breadcrumbs');

  // To get hero content, gather all elements inside the current block that are NOT breadcrumbs and NOT empty
  // We'll use direct children of 'element' except those that are or contain the breadcrumbs
  let heroContentElements = [];
  // We collect all descendants of 'element', excluding breadcrumbs
  Array.from(element.children).forEach(child => {
    if (breadcrumbNav && (child === breadcrumbNav || child.contains(breadcrumbNav) || breadcrumbNav.contains(child))) {
      // Skip breadcrumbs/nav
      return;
    }
    // If this child contains meaningful content (not just containers), keep it
    // Gather all children that are not empty
    const meaningful = Array.from(child.querySelectorAll('*'))
      .filter(e => e !== breadcrumbNav && (!breadcrumbNav || !breadcrumbNav.contains(e)))
      .filter(e => {
        // Consider an element meaningful if it has visible text content or is an image or button
        if (e.tagName.match(/^H[1-6]$/) || e.tagName === 'P' || e.tagName === 'IMG' || e.tagName === 'BUTTON' || (e.textContent && e.textContent.trim())) return true;
        return false;
      });
    if (meaningful.length > 0) {
      heroContentElements.push(child);
    }
  });

  // If no direct children have content, try to extract lower-level descendants
  if (heroContentElements.length === 0) {
    // Collect all descendants of element (except nav.breadcrumbs)
    heroContentElements = Array.from(element.querySelectorAll(':scope *'))
      .filter(e => e !== breadcrumbNav && (!breadcrumbNav || !breadcrumbNav.contains(e)))
      .filter(e => {
        // Skip empty container elements
        if (e.children.length === 0 && e.textContent && e.textContent.trim()) return true;
        if (e.tagName === 'IMG' || e.tagName === 'PICTURE' || e.tagName === 'BUTTON') return true;
        return false;
      });
  }

  // Remove duplicates and ensure only unique elements
  heroContentElements = Array.from(new Set(heroContentElements));

  // If there's still nothing, just use empty string (matches the example if there's really no content)
  const contentRow = [heroContentElements.length > 0 ? heroContentElements : ''];

  const cells = [
    headerRow,
    backgroundRow,
    contentRow
  ];

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}

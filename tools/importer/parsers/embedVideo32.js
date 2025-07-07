/* global WebImporter */
export default function parse(element, { document }) {
  // Header row exactly matches the block name 'Embed'
  const headerRow = ['Embed'];

  // Collect all direct child nodes (elements and non-empty text nodes)
  const contentNodes = Array.from(element.childNodes).filter(node => {
    if (node.nodeType === Node.ELEMENT_NODE) return true;
    if (node.nodeType === Node.TEXT_NODE && node.textContent.trim().length > 0) return true;
    return false;
  });

  // If there is a <video> tag, also extract its <source> and create a link beneath
  const video = element.querySelector('video');
  let urlLink = null;
  if (video) {
    let src = '';
    const source = video.querySelector('source');
    if (source && source.getAttribute('src')) {
      src = source.getAttribute('src');
    } else if (video.getAttribute('src')) {
      src = video.getAttribute('src');
    }
    if (src) {
      // Convert to absolute URL if needed
      const a = document.createElement('a');
      a.href = src;
      a.textContent = a.href;
      urlLink = a;
    }
  }

  // Prepare the cell: all original content, then (if present) the link
  let cellContent = contentNodes;
  if (urlLink) {
    // Add a line break between video and link if both present
    cellContent = [...contentNodes, document.createElement('br'), urlLink];
  }

  const cells = [
    headerRow,
    [cellContent]
  ];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}

/* global WebImporter */
export default function parse(element, { document }) {
  // Header row, matching the example exactly
  const headerRow = ['Embed'];

  // Collect all content (video, text, etc.) in order, referencing existing nodes
  const cellContent = [];
  // Include all element children as-is
  Array.from(element.childNodes).forEach((node) => {
    if (node.nodeType === Node.ELEMENT_NODE) {
      cellContent.push(node);
    } else if (node.nodeType === Node.TEXT_NODE) {
      const txt = node.textContent.trim();
      if (txt) cellContent.push(txt);
    }
  });

  // Also include a link to the video file source, as per Embed block requirements
  // (the link should go after the video and any text)
  const video = element.querySelector('video');
  let src = '';
  if (video) {
    const source = video.querySelector('source');
    if (source && source.getAttribute('src')) {
      src = source.getAttribute('src');
    } else if (video.getAttribute('src')) {
      src = video.getAttribute('src');
    }
    if (src) {
      const link = document.createElement('a');
      link.href = src;
      link.textContent = src;
      cellContent.push(document.createElement('br'));
      cellContent.push(link);
    }
  }

  // Ensure cellContent is not empty
  if (cellContent.length === 0) cellContent.push('');

  // Compose the cells array
  const cells = [headerRow, [cellContent.length > 1 ? cellContent : cellContent[0]]];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}

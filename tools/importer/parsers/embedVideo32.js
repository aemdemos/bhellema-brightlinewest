/* global WebImporter */
export default function parse(element, { document }) {
  // Compose all relevant content from the source html (video + any text)
  const content = [];
  // Include any text nodes or elements in order
  element.childNodes.forEach((node) => {
    if (node.nodeType === Node.ELEMENT_NODE) {
      content.push(node);
    } else if (node.nodeType === Node.TEXT_NODE) {
      const text = node.textContent.trim();
      if (text) {
        const p = document.createElement('p');
        p.textContent = text;
        content.push(p);
      }
    }
  });
  // If the video contains a video file, add a link to the file below
  const video = element.querySelector('video');
  let videoLink = null;
  if (video) {
    const source = video.querySelector('source');
    if (source && source.getAttribute('src')) {
      // Make an absolute URL
      const a = document.createElement('a');
      const temp = document.createElement('a');
      temp.href = source.getAttribute('src');
      a.href = temp.href;
      a.textContent = temp.href;
      videoLink = a;
    }
  }
  if (videoLink) {
    content.push(document.createElement('br'));
    content.push(videoLink);
  }
  // Build table: header, then single column of all content
  const cells = [
    ['Embed'],
    [content]
  ];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}

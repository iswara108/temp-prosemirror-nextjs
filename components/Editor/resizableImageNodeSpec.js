export const resizableImageNodeSpec = {
  inline: true,
  attrs: {
    src: {},
    width: { default: '5em' },
    alt: { default: null },
    title: { default: null },
    alignment: { default: 'center' }
  },
  group: 'inline',
  draggable: true,
  parseDOM: [
    {
      priority: 51, // must be higher than the default image spec
      tag: 'img[src][width]',
      getAttrs(dom) {
        return {
          src: dom.getAttribute('src'),
          title: dom.getAttribute('title'),
          alt: dom.getAttribute('alt'),
          width: dom.getAttribute('width'),
          alignment:
            dom.getAttribute('class') === 'center'
              ? 'center'
              : dom.getAttribute('class') === 'right'
              ? 'right'
              : 'left'
        }
      }
    }
  ],
  // TODO if we don't define toDom, something weird happens: dragging the image will not move it but clone it. Why?
  toDOM(node) {
    const attrs = { style: `width: ${node.attrs.width}` }
    return ['img', { ...node.attrs, ...attrs }]
  }
}

import { NodeSelection } from 'prosemirror-state'

function getFontSize(element) {
  return parseFloat(getComputedStyle(element).fontSize)
}

export class FootnoteView {
  constructor(node, view, getPos) {
    const outer = document.createElement('div')
    outer.style.position = 'relative'
    outer.style.width = node.attrs.width
    //outer.style.border = "1px solid blue"
    outer.style.display = 'block'
    //outer.style.paddingRight = "0.25em"
    outer.style.lineHeight = '0' // necessary so the bottom right arrow is aligned nicely
    outer.style.marginLeft = 'auto'
    outer.style.marginRight = 'auto'
    const img = document.createElement('img')
    img.setAttribute('src', node.attrs.src)
    img.style.width = '100%'
    //img.style.border = "1px solid red"

    const handle = document.createElement('span')
    handle.style.position = 'absolute'
    handle.style.bottom = '0px'
    handle.style.right = '0px'
    handle.style.width = '10px'
    handle.style.height = '10px'
    handle.style.border = '3px solid black'
    handle.style.borderTop = 'none'
    handle.style.borderLeft = 'none'
    handle.style.display = 'none'
    handle.style.cursor = 'nwse-resize'

    handle.onmousedown = function (e) {
      e.preventDefault()

      const startX = e.pageX

      const fontSize = getFontSize(outer)

      const startWidth = parseFloat(node.attrs.width.match(/(.+)em/)[1])

      const onMouseMove = e => {
        const currentX = e.pageX

        const diffInPx = currentX - startX
        const diffInEm = diffInPx / fontSize

        outer.style.width = `${startWidth + diffInEm}em`
      }

      const onMouseUp = e => {
        e.preventDefault()

        document.removeEventListener('mousemove', onMouseMove)
        document.removeEventListener('mouseup', onMouseUp)
        let saveThisPos = getPos()
        let transaction = view.state.tr.setNodeMarkup(getPos(), null, {
          src: node.attrs.src,
          width: outer.style.width
        })
        let resolvedPos = transaction.doc.resolve(saveThisPos)
        let nodeSelection = new NodeSelection(resolvedPos)
        transaction = transaction.setSelection(nodeSelection)
        view.dispatch(transaction)
      }

      document.addEventListener('mousemove', onMouseMove)
      document.addEventListener('mouseup', onMouseUp)
    }

    outer.appendChild(handle)
    outer.appendChild(img)

    this.dom = outer
    this.img = img
    this.handle = handle
  }

  selectNode() {
    this.img.classList.add('ProseMirror-selectednode')

    this.handle.style.display = ''
  }

  deselectNode() {
    this.img.classList.remove('ProseMirror-selectednode')

    this.handle.style.display = 'none'
  }
}

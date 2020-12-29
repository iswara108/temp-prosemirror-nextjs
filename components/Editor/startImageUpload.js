import { placeholderPlugin } from './placeholderPlugin'
import { mySchema } from './mySchema'

function uploadFile(file) {
  let reader = new FileReader()
  return new Promise((accept, fail) => {
    reader.onload = () => accept(reader.result)
    reader.onerror = () => fail(reader.error)
    // Some extra delay to make the asynchronicity visible
    setTimeout(() => reader.readAsDataURL(file), 1500)
  })
}

function findPlaceholder(state, id) {
  let decos = placeholderPlugin.getState(state)
  let found = decos.find(null, null, spec => spec.id == id)
  return found.length ? found[0].from : null
}

export const startImageUpload = (view, file) => {
  // A fresh object to act as the ID for this upload
  let id = {}

  // Replace the selection with a placeholder
  let tr = view.state.tr

  if (!tr.selection.empty) tr.deleteSelection()
  tr.setMeta(placeholderPlugin, { add: { id, pos: tr.selection.from } })
  view.dispatch(tr)

  uploadFile(file).then(
    () => {
      let pos = findPlaceholder(view.state, id)
      // If the content around the placeholder has been deleted, drop
      // the image
      if (pos == null) return
      // Otherwise, insert it at the placeholder's position, and remove
      // the placeholder
      console.log(mySchema.nodes, 'nodes')
      view.dispatch(
        view.state.tr
          .replaceWith(
            pos,
            pos,
            mySchema.nodes.resizableImage.create({
              src:
                'https://cdn.vox-cdn.com/thumbor/PSLYCBn2BjUj8Zdbf4BD6SMus-0=/0x0:1800x1179/920x613/filters:focal(676x269:964x557):format(webp)/cdn.vox-cdn.com/uploads/chorus_image/image/66741310/3zlqxf_copy.0.jpg'
            })
          )
          .setMeta(placeholderPlugin, { remove: { id } })
      )
    },
    () => {
      // On failure, just clean up the placeholder
      view.dispatch(tr.setMeta(placeholderPlugin, { remove: { id } }))
    }
  )
}

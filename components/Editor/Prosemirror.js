import React, {
  useEffect,
  useRef,
  useImperativeHandle,
  forwardRef
} from 'react'
import { Decoration, DecorationSet } from 'prosemirror-view'
import { Schema, DOMParser, DOMSerializer } from 'prosemirror-model'
import { EditorState, Plugin } from 'prosemirror-state'
import { EditorView } from 'prosemirror-view'
import { schema, nodes } from 'prosemirror-schema-basic'
import { exampleSetup } from 'prosemirror-example-setup'
import applyDevTools from 'prosemirror-dev-tools'
import { contentUpdatePlugin } from './contentUpdatePlugin'
import { resizableImageNodeSpec } from './resizableImageNodeSpec'
import { FootnoteView } from './footnodeView'

let placeholderPlugin = new Plugin({
  state: {
    init() {
      return DecorationSet.empty
    },
    apply(tr, set) {
      // Adjust decoration positions to changes made by the transaction
      set = set.map(tr.mapping, tr.doc)
      // See if the transaction adds or removes any placeholders
      let action = tr.getMeta(this)
      if (action && action.add) {
        let widget = document.createElement('placeholder')
        let deco = Decoration.widget(action.add.pos, widget, {
          id: action.add.id
        })
        set = set.add(tr.doc, [deco])
      } else if (action && action.remove) {
        set = set.remove(
          set.find(null, null, spec => spec.id == action.remove.id)
        )
      }
      return set
    }
  },
  props: {
    decorations(state) {
      return this.getState(state)
    }
  }
})

function findPlaceholder(state, id) {
  let decos = placeholderPlugin.getState(state)
  let found = decos.find(null, null, spec => spec.id == id)
  return found.length ? found[0].from : null
}

const mySchema = new Schema({
  nodes: { ...nodes, resizableImage: resizableImageNodeSpec },
  marks: schema.spec.marks
})

function uploadFile(file) {
  let reader = new FileReader()
  return new Promise((accept, fail) => {
    reader.onload = () => accept(reader.result)
    reader.onerror = () => fail(reader.error)
    // Some extra delay to make the asynchronicity visible
    setTimeout(() => reader.readAsDataURL(file), 1500)
  })
}

/* eslint-disable react/prop-types */
const Prosemirror = forwardRef((props, ref) => {
  const editorRef = useRef()
  const view = useRef(null)
  const contentRef = useRef()
  // const imageUploadRef = useRef()

  const updateObj = {
    update(newState) {
      // const div = document.createElement('div')
      const fragment = DOMSerializer.fromSchema(mySchema).serializeFragment(
        newState.doc.content
      )
      props.setContent(fragment)
      console.log(fragment)

      // div.appendChild(fragment)
      // console.log(div.innerHTML)
    }
  }
  useEffect(() => {
    // const getEditorState = (newState) => {
    // };

    // initial render
    view.current = new EditorView(editorRef.current, {
      state: EditorState.create({
        doc: DOMParser.fromSchema(mySchema).parse(contentRef.current),
        plugins: exampleSetup({ schema: mySchema }).concat([
          placeholderPlugin,
          contentUpdatePlugin(updateObj)
        ])
      }),
      nodeViews: {
        resizableImage(node, view, getPos) {
          return new FootnoteView(node, view, getPos)
        }
      }
    })
    // [placeholderPlugin,reactProps(props)]
    // contentRef.current

    // imageUploadRef.current.addEventListener("change", e => {
    //     console.log("change")
    //     if (view.current.state.selection.$from.parent.inlineContent && e.target.files.length)
    //         startImageUpload(view.current, e.target.files[0])
    //     view.current.focus()
    // })

    // imageUploadRef.current.addEventListener("click", e => e.target.value="")
    applyDevTools(view.current)
    console.log(JSON.stringify(view.current.state.doc.toJSON()))
    // return () => view.current.destroy();
  }, [updateObj])

  useImperativeHandle(ref, () => ({
    imageUploadChange: e => {
      console.log('change')
      if (
        view.current.state.selection.$from.parent.inlineContent &&
        e.target.files.length
      )
        startImageUpload(view.current, e.target.files[0])
      view.current.focus()
    },
    imageUploadClick: e => {
      e.target.value = ''
    }
  }))

  const startImageUpload = (view, file) => {
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

  return (
    <div>
      {/* <button onClick={getEditorState}>GetState</button> */}
      <div ref={editorRef}></div>
      <div ref={contentRef} style={{ display: 'none' }}></div>
    </div>
  )
})
/* eslint-enable react/prop-types */

export default Prosemirror

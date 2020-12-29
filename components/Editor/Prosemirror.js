import React, {
  useEffect,
  useRef,
  useImperativeHandle,
  forwardRef
} from 'react'
import { EditorState } from 'prosemirror-state'
import { EditorView } from 'prosemirror-view'
import { DOMParser, DOMSerializer } from 'prosemirror-model'
import { exampleSetup } from 'prosemirror-example-setup'
import applyDevTools from 'prosemirror-dev-tools'
import { contentUpdatePlugin } from './contentUpdatePlugin'
import { FootnoteView } from './footnodeView'
import { placeholderPlugin } from './placeholderPlugin'
import { startImageUpload } from './startImageUpload'
import { mySchema } from './mySchema'

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

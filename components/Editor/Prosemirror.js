import React, {
  useEffect,
  useRef,
  useImperativeHandle,
  forwardRef
} from 'react'
import { EditorState } from 'prosemirror-state'
import { EditorView } from 'prosemirror-view'
import { DOMParser } from 'prosemirror-model'
import { exampleSetup } from 'prosemirror-example-setup'
import { contentUpdatePlugin } from './contentUpdatePlugin'
import { FootnoteView } from './footnodeView'
import { placeholderPlugin } from './placeholderPlugin'
import { startImageUpload } from './startImageUpload'
import { mySchema } from './mySchema'

/* eslint-disable react/prop-types */
const Prosemirror = forwardRef((props, ref) => {
  const editorRef = useRef()
  const viewRef = useRef(null)
  const contentRef = useRef()

  useEffect(() => {
    // initial render
    viewRef.current = new EditorView(editorRef.current, {
      state: EditorState.create({
        doc: DOMParser.fromSchema(mySchema).parse(contentRef.current),
        plugins: exampleSetup({ schema: mySchema }).concat([
          placeholderPlugin,
          contentUpdatePlugin(props.updateEvent)
        ])
      }),
      nodeViews: {
        resizableImage(node, view, getPos) {
          return new FootnoteView(node, view, getPos)
        }
      }
    })

    console.log(JSON.stringify(viewRef.current.state.doc.toJSON()))
    return () => viewRef.current.destroy()
  }, [])

  useImperativeHandle(ref, () => ({
    imageUploadChange: e => {
      console.log('change')
      if (
        viewRef.current.state.selection.$from.parent.inlineContent &&
        e.target.files.length
      )
        startImageUpload(viewRef.current, e.target.files[0])
      viewRef.current.focus()
    },
    imageUploadClick: e => {
      e.target.value = ''
    },
    view: () => viewRef.current
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

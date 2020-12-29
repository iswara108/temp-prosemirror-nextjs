import { PluginKey, Plugin } from 'prosemirror-state'

export function contentUpdatePlugin(callback) {
  return new Plugin({
    key: new PluginKey('Content Update Hook Plugin'),
    view: () => ({
      update: (view, prevState) => {
        if (!prevState.doc.eq(view.state.doc)) {
          callback()
        }
      }
    })
  })
}

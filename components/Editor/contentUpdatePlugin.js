import { PluginKey, Plugin } from 'prosemirror-state'

export function contentUpdatePlugin(callbackObj) {
  return new Plugin({
    key: new PluginKey('Content Update Hook Plugin'),
    view: () => ({
      update: (view, prevState) => {
        if (!prevState.doc.eq(view.state.doc)) {
          callbackObj.update(view.state)
        }
      }
    })
  })
}

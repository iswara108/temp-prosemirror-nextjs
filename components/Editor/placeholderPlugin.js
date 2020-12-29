import { Decoration, DecorationSet } from 'prosemirror-view'
import { Plugin } from 'prosemirror-state'

export const placeholderPlugin = new Plugin({
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

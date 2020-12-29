import { Schema } from 'prosemirror-model'
import { schema, nodes } from 'prosemirror-schema-basic'
import { resizableImageNodeSpec } from './resizableImageNodeSpec'

export const mySchema = new Schema({
  nodes: { ...nodes, resizableImage: resizableImageNodeSpec },
  marks: schema.spec.marks
})

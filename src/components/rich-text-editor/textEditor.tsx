'use client'

import { EditorContent, useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { Menu } from 'lucide-react'
import MenuBar from './menuBar'
import TextAlign from '@tiptap/extension-text-align'

const RichTextEditor = ({field}: {field : any}) => {
  const editor = useEditor({
    extensions: [StarterKit, TextAlign.configure({
        types: ["heading", "paragraph"]
    })],

    editorProps: {
        attributes: {
            class: "min-h-[300px] p-4 focus:outline-none"
        }
    },

    immediatelyRender: false,

    onUpdate: ({editor}) => {
        field.onChange(JSON.stringify(editor.getJSON()))
    },

    content: field.value ? JSON.parse(field.value): '<p>Write Styled Description</p>'
  })

  return (
    <div className='w-full border border-input rounded-lg overflow-hidden dark:bg-input/30'>
        <MenuBar editor={editor} /> 
        <EditorContent editor={editor} />
    </div>
  )
}

export default RichTextEditor

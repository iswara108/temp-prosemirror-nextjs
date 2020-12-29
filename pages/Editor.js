import React, { useRef } from 'react'
import styled from 'styled-components'
import Prosemirror from '../components/Editor/Prosemirror'
import { ContainerLayout, Header, Content } from '../components/Container'
import applyDevTools from 'prosemirror-dev-tools'

const ImageUploadWrapper = styled.div`
  display: grid;
  grid-template-columns: repeat(3, min-content);
  grid-gap: 2%;
  cursor: pointer;
  margin-bottom: 1vh;
  & > input {
    display: none;
  }
`

const Choice = styled.div`
  display: flex;
  flex-direction: column;

  & > label {
    & > img {
      cursor: pointer;
    }
  }

  & > input {
    display: none;
    width: 0;
  }
`

const HeadingInput = styled.input`
  display: block;
  word-wrap: break-word;
  width: 100%;
  padding: 0.5em 0;
  border: none;
  border-radius: 3px;
  font-size: 2em;
  font-weight: bold;
  &:focus {
    outline: none;
  }
`

/* eslint-disable react/prop-types */
const UploadChoice = ({ name, source, type, handleChange, handleClick }) => {
  return (
    <Choice>
      <label htmlFor={name}>
        <img src={source} style={{ width: '30px' }} />
      </label>
      <input
        id={name}
        type={type}
        onChange={handleChange}
        alt={type}
        onClick={handleClick}
      />
    </Choice>
  )
}
/* eslint-enable react/prop-types */

const EditorPage = () => {
  const prosemirrorRef = useRef()

  const onUpdate = () => console.log('updated')

  React.useEffect(() => {
    if (prosemirrorRef.current?.view()) {
      console.log('applying devtools', prosemirrorRef.current.view())
      applyDevTools(prosemirrorRef.current.view())
    }
  }, [prosemirrorRef.current?.view()])

  return (
    <ContainerLayout>
      <Header>Editor</Header>
      <Content>
        <ImageUploadWrapper>
          <UploadChoice
            name="imageInput"
            source={
              'https://winaero.com/blog/wp-content/uploads/2019/11/Photos-new-icon.png'
            }
            type="file"
            handleChange={e => {
              prosemirrorRef.current.imageUploadChange(e)
            }}
            onClick={() => {
              prosemirrorRef.current.imageUploadClick
            }}
            input
          />
        </ImageUploadWrapper>

        <HeadingInput placeholder="Add a title" type="text" />

        <Prosemirror ref={prosemirrorRef} updateEvent={onUpdate} />
        <button
          onClick={() => {
            window.editorContent = prosemirrorRef.current.view()?.dom
          }}
        >
          Place state in global variable
        </button>
      </Content>
    </ContainerLayout>
  )
}

export default EditorPage

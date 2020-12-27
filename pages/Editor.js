import React, { useRef, useState } from 'react'

import styled from 'styled-components'

import Prosemirror from '../components/Editor/Prosemirror'

import { ContainerLayout, Header, Content } from '../components/Container'

// Thank you @iswara108 ,  There are few set of features that I want to implement.
// 1. Editor has to be a react component
// 2. After every five words, we have to trigger an auto save function.
// 3. Insert an image when clicked on the image icon, and the image to be re-sizable.
// 4.

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

const EditorPage = () => {
  const imageUploadRef = useRef()
  const prosemirrorRef = useRef()

  const [EditorContent, setEditorContent] = useState()
  const [otherState, setOtherState] = useState('hello other state')

  const UploadChoice = ({
    name,
    source,
    type,
    handleChange,
    handleClick,
    input
  }) => {
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
            onClick={e => {
              prosemirrorRef.current.imageUploadClick
            }}
            input
          />
        </ImageUploadWrapper>

        <HeadingInput placeholder="Add a title" type="text" />

        <Prosemirror ref={prosemirrorRef} setContent={setEditorContent} />
      </Content>
    </ContainerLayout>
  )
}

export default EditorPage

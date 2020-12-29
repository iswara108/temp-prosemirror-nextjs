import styled from 'styled-components'

export const ContainerLayout = styled.div`
  display: grid;
  grid-template-rows: 10vh 90vh;
  grid-template-areas:
    'header'
    'content';
  height: 100vh;
  background-image: url(${props => props.theme});
  background-position: center;
  background-size: cover;
`

export const Header = styled.div`
  grid-area: 'header';
  width: 100vw;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0
    ${({ theme }) =>
      theme.screenSize === 'sm'
        ? `${(20 / 375) * 100}%`
        : `${(30 / 1440) * 100}%`};
`

export const Content = styled.div`
  grid-area: 'content';
  display: flex;
  flex-direction: column;
  align-items: ${props => (props.position ? 'center' : 'left')};
  padding: 2vh
    ${({ theme }) => {
      console.log('fromsc', theme.screenSize)
      return theme.screenSize === 'sm'
        ? `${(15 / 375) * 100}vw`
        : `${(220 / 1440) * 100}vw`
    }};
`
export default ContainerLayout

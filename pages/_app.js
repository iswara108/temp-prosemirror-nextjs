import React from 'react'
import '../styles/globals.css'
import App from 'next/app'

class MyApp extends App {
  constructor(props) {
    super(props)
  }

  render() {
    const { Component, pageProps } = this.props

    return <Component {...pageProps} />
  }
}
export default MyApp

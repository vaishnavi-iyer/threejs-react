import React, { Component } from 'react'
import Test from './test.js'
import Simple from './three'

class App extends Component {

  constructor (props) {
    super(props)
  }

  render () {
    return (
      <div className ="main">
        <h1>Welcome to {this.props.name}</h1>
        <Simple wwidth='5' hheight='3' depth='2'/>
        <Test/>
      </div>
      )
  }

}

export default App

import '../assets/css/main.css'
import React, { Component } from 'react'
import Currency from './Currency.js'
import Cutab from './Cutab.js'
import { ipcRenderer } from 'electron'
import HTML5Backend from 'react-dnd-html5-backend'
import { DragDropContextProvider } from 'react-dnd'

class App extends React.Component {
  render() {
    ipcRenderer.on('sortData', function(event, arg) {
      console.dir(arg.status)
    })
    return (
      <DragDropContextProvider backend={HTML5Backend}>
        <div className="pad" >
          <Cutab  />
        </div> 
      </DragDropContextProvider>
    )
  }
}

export default App

import React, { Component } from 'react'
import { DragSource } from 'react-dnd'
import PropTypes from 'prop-types'
import { moveKnight } from './Cutab.js'

const boxSource = {
  beginDrag(props) {
    return {
      name: props.name,
      data: props.data,
   }
  }, 
  endDrag(props, monitor) {
    const item = monitor.getItem()
    const dropResult = monitor.getDropResult()
    
    if (dropResult) props.moveItem([props.data.sector, [dropResult.data.psec, dropResult.data.id], props.data.id])
  }
}

function collect(connect, monitor) {
  return {
    connectDragSource: connect.dragSource(),
    isDragging: monitor.isDragging()
  }
}

class Symbol extends Component {
  render() {
    const { name, data } = this.props
    const { connectDragSource, isDragging } = this.props

    return (
      connectDragSource(
        <div style={{ opacity: isDragging ? 0.7 : 1 }}>
          {name}
        </div>
      )
    )
  }
}
Symbol.propTypes = {
  connectDragSource: PropTypes.func.isRequired,
  isDragging: PropTypes.bool.isRequired,
  
}
export default DragSource('box', boxSource, collect)(Symbol)
import React, { Component } from 'react'
import { DropTarget } from 'react-dnd'
import PropTypes from 'prop-types'
import MDcheck from 'react-icons/lib/md/check-circle';
import MDcancel from 'react-icons/lib/md/cancel';
import MDadd from 'react-icons/lib/md/add-circle';

const boxSource = {
  drop(props) {
    return {
      name: props.name,
      data: props.data
     
    }
  },
  canDrop(props, monitor) {
    if (props.data) return (props.data.psec != null ? true : false)
    return false
  }
}


function collect(connect, monitor) {
  return {
    connectDropTarget: connect.dropTarget(),
    isOver: monitor.isOver()
  }
}

class InputField extends Component {
  constructor(props) {
    super(props)
    this.state = {ok: false, value: null}
    this.checkInput = this.checkInput.bind(this)
    this.inputsec = this.inputsec.bind(this)
    this.delsec = this.delsec.bind(this)
  }

  checkInput (ev) {
    if (ev.target.value.length <2) this.setState({ ok: false })
    else this.setState({ ok: true })
    this.setState({ value: ev.target.value })
  }
  inputsec (ev) {
    this.props.inputsec(this.state.value)
  }
  delsec (ev) {
    this.props.delsec(null)
  }


  render() {
    return (
      <span>
        <input placeholder="New Entry" autoFocus onChange={this.checkInput} />
        {this.state.ok 
          ? <span><MDcheck onClick={this.inputsec} className="icons" /><MDcancel onClick={this.delsec} className="icons" /></span>
          : <MDcancel onClick={this.delsec} className="icons" />
        }
      </span>
    )
  }
}

class Cname extends Component {
  constructor(props) {
    super(props)
    this.state = {high: false}
    this.nclick = this.nclick.bind(this)
    this.addsec = this.addsec.bind(this)
    this.delsec = this.delsec.bind(this)
    this.inputsec = this.inputsec.bind(this)
  }

  addsec (ev) {
    this.props.addsec(this)
  }
  delsec (arg) {
    this.props.delsec(this.props.data)
  }
  inputsec (arg) {
    this.props.inputsec(this.props.data.psec, arg)
  }

  nclick (ev) {
    this.props.onClick(this, ev)
    this.setState({high: !this.state.high})
    console.log(ev)

  }
 
  render() {
    const { nClick, name, data, isOver, connectDropTarget } = this.props
    const { high } = this.state
   
 
    function style () {
      if (data.psec != null && isOver) return (  { 'color': '#11c8ce' } )
      if (high) return (  { 'color': 'rgba(17,200,208,0.8' } ) 
      return ( { 'color': 'rgba(11,129,133,1)' } )
    }
   
    return (
      connectDropTarget(
        <div style={style()} key={25}> 
          {data.name == 'new entry' 
          ? <InputField delsec={this.delsec} inputsec={this.inputsec}/>
          : !data.symbol 
            ? <span onClick={this.nclick}><b>{name}</b></span> 
            :<span onClick={this.nclick}>{name}</span> 
          }
          { (!data.sector && !Number.isInteger(data.psec)) 
            ? <MDadd onClick={this.addsec} className="icons" />
            : null
          }
        </div> 
      )
        
      
    )
  }
}

Cname.propTypes = {
  connectDropTarget: PropTypes.func.isRequired,
  isOver: PropTypes.bool.isRequired
}

export default DropTarget('box', boxSource, collect)(Cname)
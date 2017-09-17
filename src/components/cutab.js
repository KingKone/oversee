import React, { Component } from 'react'
import { ipcRenderer } from 'electron'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer  } from 'recharts'
import ReactTable from 'react-table'
import BrowserWindow from 'electron'
import JSONTree from 'react-json-tree'

import Symbol from './Symbol.js'
import Cname from './Cname.js'
import '../assets/css/react-table.css'

const JSONtheme = {
  scheme: 'monokai',
  author: 'wimer hazenberg (http://www.monokai.nl)',
  base00: 'rgba(0,0,0,0)',
  base01: '#383830',
  base02: '#49483e',
  base03: '#75715e',
  base04: '#a59f85',
  base05: '#f8f8f2',
  base06: '#f5f4f1',
  base07: '#f9f8f5',
  base08: '#f92672',
  base09: '#fd971f',
  base0A: '#f4bf75',
  base0B: '#a6e22e',
  base0C: '#a1efe4',
  base0D: '#66d9ef',
  base0E: '#ae81ff',
  base0F: '#cc6633'
}

let curcolumns =[]
let curdata = []
let clickdata = []
let lcup = 0
let upkey = 0

class leer extends React.Component {
  render() { return ( <div></div> ) }
}

function numberWithCommas(x) {
  if (x) {
    x = x.toString()
    var pattern = /(-?\d+)(\d{3})/
    while (pattern.test(x))
        x = x.replace(pattern, "$1,$2")
    return x
  }
}

function plusminus(x) {
  x = Number(x)
  if (x > 0) return {color:'rgba(160,0,0,1)'}
  else return {color:'rgba(0,160,0,1)'}
}

let activeItems =[];
let data = []

class Cutab extends React.Component {
  constructor(props) {
    super(props)
    this.state = {currencies:[], wheigth : 0, clickdata: clickdata, newsector: false}
    this.moveItem = this.moveItem.bind(this)
    this.nameClick = this.nameClick.bind(this)
    this.addsec = this.addsec.bind(this)
    this.delsec = this.delsec.bind(this)
    this.inputsec = this.inputsec.bind(this)
    
  }
  
  inputsec (secid, value) {
    let sec = null
    curdata.forEach((cd, i ) => {
      if (cd.id == secid) sec = i           
    })
    curdata[sec].items.forEach((item,idx) => {
    
    if (item.name == 'new entry') curdata[sec].items[idx] = {
        id: 'new',  
        ident: value.toLowerCase(),  
        items: [],
        name: value,
        note: '',
        rank: '',
        psec: secid
      }
    })
    this.setState({currencies: curdata})
    ipcRenderer.send('newSector', [secid,value])
    
  }

  delsec (arg) {
   
    let sec = null
    curdata.forEach((cd, i ) => {
      if (cd.id == arg.psec) sec = i           
    })
    curdata[sec].items.forEach((item,idx) => {
      if (arg == null && item.name == 'new entry') curdata[sec].items.splice(idx,1) 
      else if (arg != null && arg.id == item.id && item.psec) {
        curdata[sec].items.splice(idx,1) 
        //ipcRenderer.send('delSector', items.id)
        
      }
    })
    this.setState({currencies: curdata})
  }
  addsec (arg) {
    console.log(arg.props.data)
    let sec = null
    curdata.forEach((cd, i ) => {
      if (cd.id == arg.props.data.id) sec = i           
    })
    curdata[sec].items.unshift({
      id: '',  
      ident: '',  
      items: [],
      name: 'new entry',
      note: '',
      rank: '',
      psec: arg.props.data.id
    })
    this.setState({currencies: curdata})
  }
  
  nameClick(arg) {

    activeItems.forEach((item) => {
      item.setState({high: false})
    })
    activeItems = []
    if (!arg.state.high) {
      this.setState({clickdata: arg.props.data})
      activeItems.push(arg)
    }
    else this.setState({clickdata: {}})
    
  }
    
    //upkey = Math.random()
  
  moveItem (fromTo) {
    console.log(fromTo)
    if (!Array.isArray(fromTo[0])) {
      let index = null
      let sec = null
      let newsec = null;
      curdata.forEach((cd, i ) => {
        if (cd.id == fromTo[0]) cd.items.forEach((item,idx) => {
          if (item.id == fromTo[2]) {
            index = idx
            sec = i
          }
        })
      })
      curdata.forEach((cd, i ) => {
        if (cd.id == fromTo[1][0]) cd.items.forEach((item,idx) => {
          if (item.id == fromTo[1][1] && curdata[i].items[idx].items) {
            curdata[i].items[idx].items.push(curdata[sec].items[index])
            newsec = item.id;
    
          }
        })
      })
      if (newsec != null) {
        curdata[sec].items.splice(index,1)
        this.setState({currencies: curdata})
        ipcRenderer.send('moveItem', fromTo)
      }
    } else {
      let index = null
      let sec = null
      let newsec = null;
      curdata.forEach((cd, i ) => {
        if (cd.id == fromTo[0][0]) cd.items.forEach((item,idx) => {
          if (Array.isArray(item.items) && item.id == fromTo[0][1]) item.items.forEach((subitem,indx) => {
            if (subitem.id == fromTo[2]) {
              index = indx
              sec = [i,idx]
            }
          })
        })
      })
      
      curdata.forEach((cd, i ) => {
        if (Array.isArray(cd.items) && cd.id == fromTo[1][0]) cd.items.forEach((item,idx) => {
          if (Array.isArray(item.items) && item.id == fromTo[1][1] && curdata[i].items[idx].items) {
            let temp = curdata[sec[0]].items[sec[1]].items[index]
            temp.sector=[cd.id,item.id]
            curdata[i].items[idx].items.push(temp)
            newsec = item.id;
    
          }
        })
      })
      if (newsec != null) {
        curdata[sec[0]].items[sec[1]].items.splice(index,1)
        this.setState({currencies: curdata})
        ipcRenderer.send('moveItem', fromTo)
      }
    }
  }

  componentDidMount() {
    let th = this
    ipcRenderer.on('sortDataOK', function(event, arg) {
      curdata = arg
      th.setState({currencies: curdata})
      upkey = Math.random()
    })
    ipcRenderer.send('cmc-go', 'ok')
    window.addEventListener('resize', function(e) {
      e.preventDefault()
      th.setState({wheigth: BrowserWindow.outerHeight -60})
    })
  }

  render() {
    
/*
<ResponsiveContainer width="100%" height={46}>
        <LineChart width={200} height={44} data={data} key={lcup} >
      <XAxis hide="true" dataKey="time"/>
      <YAxis hide="ture" dataKey="pv" interval="preserveStartEnd" domain={['dataMin', 'dataMax']}/>
        <Line type='monotone' dataKey='pv' stroke='#0B8185' strokeWidth={1} dot={false} isAnimationActive={true}/>
        <CartesianGrid strokeDasharray="3 3" strokeWidth={1} stroke="#1F5F61"/>
      </LineChart></ResponsiveContainer>
*/
    curcolumns =[
      {
        expander: true,
        width: 30,
        Expander: ({ isExpanded, row }) => {
          if (!row._original.symbol && row._original.name != 'new entry' ) {
            return (
              <div>
                {isExpanded
                  ? <div className="cuexpwrap"><div className="cuexpopen "></div></div>
                  : <div className="cuexpwrap"><div className="cuexp "></div></div>}
              </div>
            )
          } else return ( <div ></div> )
        }
     },{
      Header: '#',
      accessor: 'rank',
      width: 40
    }, {
      Header: <div style={{textAlign:'center'}}>Symbol</div>,
      accessor: 'symbol',
      style: {textAlign: 'center', fontSize: '1.3em', fontWeight:'bold', padding:'4px'},
      width: 80,
      Cell: props =>  <Symbol moveItem={this.moveItem} data={props.original} name={props.value} key={props.value}/>
    }, {
      Header: <div style={{textAlign:'left'}}>Name</div>,
      accessor: 'name',
      width: 200,
      style: {textAlign: 'left'},
      Cell: (props) => <Cname onClick={this.nameClick} addsec={this.addsec} delsec={this.delsec} inputsec={this.inputsec} name={props.value} data={props.original}/>
    }, {
      Header: <div style={{textAlign:'right'}}>Market cap</div>,
      accessor: 'market_cap_usd',
      style: {textAlign: 'right'},
      Cell: props => {if (props.value != null) return(<span className='number'>{numberWithCommas(props.value)} $</span>)}
    }, {
      Header: <div style={{textAlign:'right'}}>Volume</div>,
      accessor: '24h_volume_usd',
      style: {textAlign: 'right'},
      Cell: props =>  {if (props.value != null) return(<span className='number'>{props.value} $</span>)}
    },  {
      Header: <div style={{textAlign:'right'}}>Price</div>,
      accessor: 'price_usd',
      style: {textAlign: 'right'},
      Cell: props =>  {if (props.value != null) return(<span className='number'>{props.value} $</span>)}
    }, {
      Header: <div style={{textAlign:'right'}}>Change</div>,
      accessor: 'percent_change_24h',
      style: {textAlign: 'right'},
      Cell: props =>  {if (props.value != null) return(<span className='number' style={plusminus(props.value<0)} >{props.value} %</span> )}
    }, {
      Header: props => <span>Graph</span>, 
      accessor: 'Volume',
      Cell: props => <div style={{'margin': '-13px'}}>   </div>
    }]
    
    function subrow(row) {
      if (row.original.items &&  row.original.items.length > 0) 
       return (
          <div style={{ padding: "0px", paddingLeft: '5px' }}>
            <ReactTable
              data={row.original.items}
              columns={curcolumns}
              defaultPageSize={row.original.items.length >20 ? 20 : row.original.items.length }
              defaultSorted={[{ id: "rank",desc: false } ]}
              showPagination={true}
              TheadComponent={leer}
              //expanded={this.state.expanded}
              //onExpandedChange={expanded => this.setState({ expanded })}
              SubComponent={row => {
                return (
                  <div style={{ padding: "0px" , paddingLeft: '0px'}}>
                  <ReactTable
                      data={row.original.items}
                      columns={curcolumns}
                      defaultPageSize={row.original.items.length >20 ? 20 : row.original.items.length }
                      showPagination={false}
                      TheadComponent={leer}
                      SubComponent={row => {
                        return (
                          <div style={{ padding: "0px" , paddingLeft: '5px'}}>
                            Another Sub Component!
                          </div>
                        )
                      }}
                    />
                  </div>
                )
              }}
            />
          </div>
        )
      return null
    }
    


    function control (that) {
      function handleClick(e) {
        that.setState(that.setState({newsector:true}))
      }
    
      let what
      if (!Number.isInteger(that.state.clickdata.psec)) what = 'sector'
      if (that.state.clickdata.sector) what = 'currency'
      if (that.state.clickdata.psec != null) what = 'subsector'
      let btns = <button onClick={handleClick} className="osButton" >Add subsector</button>
      if (that.state.newsector) btns = <div className="osAdd">bla<button className="osButton" >Add subsector</button></div>
      if (what != 'sector') btns = null
      if (Object.keys(that.state.clickdata).length > 0) return (
        <div>
          Selected {what}<br/>
          
          <JSONTree
            data={that.state.clickdata}
            theme={JSONtheme}
            invertTheme={false}
            style={{margin: '0px'}}
          />
        </div>
        ) 
      
    }

    return (
      <div  className="cutab">
        <ReactTable
          data={this.state.currencies}
          key={upkey}
          //filterable
          columns={curcolumns}
          //defaultSorted={[{ id: "rank",desc: false } ]}
          showPagination={false}
          expanded={this.state.expanded}
          onExpandedChange={expanded => this.setState({ expanded })}
          defaultPageSize={this.state.currencies.length >20 ? this.state.currencies.length : 20 }
          style={{ height: window.outerHeight -60, width: window.outerWidth -400, float: 'left' }}
          SubComponent={ (row) => subrow(row) }
        />
        <div className="cucontrol" style={{ height: window.outerHeight -80 }}>
          {control(this)}
          All objects
          <JSONTree
            data={this.state.currencies}
            theme={JSONtheme}
            invertTheme={false}
            style={{margin: '0px'}}
          />
        </div>
      </div> 
     
     )
  }
}

export default Cutab


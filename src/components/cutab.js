import React, { Component } from 'react';
import { ipcRenderer } from 'electron';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import ReactTable from 'react-table';
import '../assets/css/react-table.css';


//let data = [];
let lcup = 0;

class leer extends React.Component {
  render() {
    return (
      <div></div>
    )
  }
}

class Cutab extends React.Component {
  render() {
    const data = [{
      name: 'Ethereum',
      rank: 0,
      marketcap: 0,
      price: 0,
      change: 0
    }]
    const data1 = [
      {name: 'Page A', uv: 4000, pv: 2400, amt: 2400},
      {name: 'Page B', uv: 3000, pv: 1398, amt: 2210},
      {name: 'Page C', uv: 2000, pv: 9800, amt: 2290},
      {name: 'Page D', uv: 2780, pv: 3908, amt: 2000},
      {name: 'Page E', uv: 1890, pv: 4800, amt: 2181},
      {name: 'Page F', uv: 2390, pv: 3800, amt: 2500},
      {name: 'Page G', uv: 3490, pv: 4300, amt: 2100},
];
    const columns = [{
        Header: 'Name',
        accessor: 'name' 
      }, {
        Header: 'Rank',
        accessor: 'rank'
      }, {
        Header: 'Market cap',
        accessor: 'marketcap'
      }, {
        Header: 'Price',
        accessor: 'price'
      }, {
        Header: 'Change',
        accessor: 'change',
        Cell: props => <span className='number'>{props.value}</span> 
      }, {
        Header: props => <span>Graph</span>, // Custom header components!
        accessor: 'Volume',
        Cell: props => <LineChart width={300} height={30} data={data1} key={lcup} >
        <XAxis hide="true" dataKey="time"/>
        <YAxis hide="ture" dataKey="pv" interval="preserveStartEnd" domain={['dataMin', 'dataMax']}/>
          <Line type='monotone' dataKey='pv' stroke='#0B8185' strokeWidth={1} dot={false} isAnimationActive={true}/>
          <CartesianGrid strokeDasharray="1 20 " strokeWidth={1} stroke="#1F5F61"/>
        </LineChart> 
       
      }
    ]
    
  
    return (
      <div className="cutab">
        <ReactTable
          data={data}
          columns={columns}
          
          showPagination={false}
          SubComponent={row => {
            return (
              <div style={{ padding: "0px", paddingLeft: '5px' }}>
                <ReactTable
                  data={data}
                  columns={columns}
                  defaultPageSize={3}
                  showPagination={false}
                  TheadComponent={leer}
                  SubComponent={row => {
                    return (
                      <div style={{ padding: "0px" , paddingLeft: '5px'}}>
                      <ReactTable
                          data={data}
                          columns={columns}
                          defaultPageSize={3}
                          showPagination={false}
                          TheadComponent={leer}
                          SubComponent={row => {
                            return (
                              <div style={{ padding: "0px" , paddingLeft: '5px'}}>
                                Another Sub Component!
                              </div>
                            );
                          }}
                        />
                      </div>
                    );
                  }}
                />
              </div>
            );
          }}
        />
      </div> 
     );
  }
}
export default Cutab;

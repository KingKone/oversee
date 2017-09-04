import '../assets/css/photon.css';
import React, { Component } from 'react';

import { ipcRenderer } from 'electron';

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';


let data = [];
let lcup = 0;

class Currency extends React.Component {
  render() {
    
    return (
 
      <div className="exchange">
        <LineChart width={300} height={300} data={hist} key={lcup} >
        <XAxis hide="true" dataKey="time"/>
        <YAxis hide="ture" dataKey="rate" interval="preserveStartEnd" domain={['dataMin-0.00005', 'dataMax+0.00005']}/>
          <Line type='monotone' dataKey='rate' stroke='#0B8185' strokeWidth={1} dot={false} isAnimationActive={true}/>
          <CartesianGrid strokeDasharray="1 20 " strokeWidth={1} stroke="#1F5F61"/>
        </LineChart>
        <div className="extext">
          <h4><b>{this.state.value.MarketName}</b></h4>
          <p>{this.state.fills}</p>
        </div>
      </div> 
      
     );
  }
}



export default Currency;

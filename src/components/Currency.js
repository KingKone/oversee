import React, { Component } from 'react';

import { ipcRenderer } from 'electron';

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';


let data = [];
let lcup = 0;

class Currency extends React.Component {
  render() {
    
    return (
 
      <div className="currency">
        <div className="cusymb"><h1>{this.props.data.symbol}</h1> </div>
        <div className="cutext">
          <h4>{this.props.data.name}</h4>
          <p>{this.props.data.price_usd} USD</p>
        </div>
      </div> 
      
     );
  }
}



export default Currency;

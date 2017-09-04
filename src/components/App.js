import '../assets/css/main.css';

import React, { Component } from 'react';
import Currency from './Currency.js';
import Cutab from './Cutab.js';

import { ipcRenderer } from 'electron';
//ipcRenderer.send('bla', {bla: 'bla'});
let upkey = 0;
class App extends React.Component {


  constructor(props) {
    super(props);
    this.state = {currencies:[]};
  }

  componentDidMount() {
    let th = this;
    ipcRenderer.on('cmcccurrencies', function(event, arg) {
      console.log(arg);
      th.setState({currencies: arg});
      //th.state.currencies = arg;
      upkey = Math.random();
    });
    ipcRenderer.send('cmc-go', 'ok');
    console.log('bla');
  }

  
  render() {
    
    return (
      <div className="pad" >
        {this.state.currencies.map(curr => (
          <Cutab key={curr.id} data={curr}/>
        ))}
        
      </div>
    );
  }
}



export default App;

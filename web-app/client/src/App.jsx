import React, { Component } from 'react';
import './App.css';
import {BrowserRouter as Router, Route} from 'react-router-dom';
import user from "./Components/Holder/user";

class App extends Component {
    render() {
        return (
            <div>
               <Router>
                   <Route path="/user" exact component={user}/>
               </Router>
            </div>
        );
    }
}

export default App;

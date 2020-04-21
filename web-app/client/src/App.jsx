import React, { Component } from 'react';
import './App.css';
import {BrowserRouter as Router, Route} from 'react-router-dom';
import user from "./Components/Holder/user";
import userPage from "./Components/Holder/userPage";

class App extends Component {
    render() {
        return (
            <div>
               <Router>
                   <Route exact path="/user" component={user}/>
                   <Route exact path="/userPage" component={userPage}/>
               </Router>
            </div>
        );
    }
}

export default App;

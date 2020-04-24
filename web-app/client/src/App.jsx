import React, {Component} from 'react';
import './App.css';
import {BrowserRouter as Router, Route} from 'react-router-dom';
import user from "./Components/Holder/user";
import issuer from "./Components/Issuer/issuer";
import verifier from "./Components/Verifier/verifier";

class App extends Component {
    render() {
        return (
            <div>
                <Router>
                    <Route exact path="/user" component={user}/>
                    <Route exact path="/issuer" component={issuer}/>
                    <Route exact path="/verifier" component={verifier}/>
                </Router>
            </div>
        );
    }
}

export default App;

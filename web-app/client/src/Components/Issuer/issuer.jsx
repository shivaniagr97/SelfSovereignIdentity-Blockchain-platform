import React, {Component} from 'react';
import {HashRouter as Router, Route} from 'react-router-dom';
import issuerLogin from "./issuerLogin";
import issuerPage from "./issuerPage";
import registerIssuer from "./registerIssuer";

class issuer extends Component {
    render() {
        return (
            <Router basename="">
                <Route path="/registerIssuer" component={registerIssuer}>
                </Route>
                <Route exact path="/" component={issuerLogin}>
                </Route>
                <Route exact path="/home" component={issuerPage}>
                </Route>
            </Router>
        );
    }
}

export default issuer;
import React, {Component} from 'react';
import {HashRouter as Router, Route} from 'react-router-dom';
import issuerLogin from "./issuerLogin";
import registerIssuer from "./registerIssuer";
import Admin from "./IssuerDashboard/Admin";

class issuer extends Component {
    render() {
        return (
            <Router basename="">
                <Route path="/registerIssuer" component={registerIssuer}>
                </Route>
                <Route exact path="/" component={issuerLogin}>
                </Route>
                <Route path="/home" component={Admin}>
                </Route>
            </Router>
        );
    }
}

export default issuer;
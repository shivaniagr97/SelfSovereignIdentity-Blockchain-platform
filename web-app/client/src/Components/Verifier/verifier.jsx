import React, {Component} from 'react';
import {HashRouter as Router, Route} from 'react-router-dom';
import verifierLogin from "./verifierLogin";
import registerVerifier from "./registerVerifier";
import Admin from "./VerifierDashboard/Admin";

class verifier extends Component {
    render() {
        return (
            <Router basename="">
                <Route path="/registerVerifier" component={registerVerifier}>
                </Route>
                <Route exact path="/" component={verifierLogin}>
                </Route>
                <Route path="/home" component={Admin}>
                </Route>
            </Router>
        );
    }
}

export default verifier;
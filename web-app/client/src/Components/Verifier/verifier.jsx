import React, {Component} from 'react';
import {HashRouter as Router, Route} from 'react-router-dom';
import verifierLogin from "./verifierLogin";
import verifierPage from "./verifierPage";
import registerVerifier from "./registerVerifier";

class verifier extends Component {
    render() {
        return (
            <Router basename="">
                <Route path="/registerVerifier" component={registerVerifier}>
                </Route>
                <Route exact path="/" component={verifierLogin}>
                </Route>
                <Route exact path="/home" component={verifierPage}>
                </Route>
            </Router>
        );
    }
}

export default verifier;
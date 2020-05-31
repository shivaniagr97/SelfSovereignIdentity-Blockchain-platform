import React, {Component} from 'react';
import {HashRouter as Router, Route} from 'react-router-dom';
import serviceProviderLogin from "./serviceProviderLogin";
import registerServiceProvider from "./registerServiceProvider";
import Admin from "./ServiceProviderDashboard/Admin";

class serviceProvider extends Component {
    render() {
        return (
            <Router basename="">
                <Route path="/registerServiceProvider" component={registerServiceProvider}>
                </Route>
                <Route exact path="/" component={serviceProviderLogin}>
                </Route>
                <Route path="/home" component={Admin}>
                </Route>
            </Router>
        );
    }
}

export default serviceProvider;
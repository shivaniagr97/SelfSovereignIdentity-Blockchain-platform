import React, {Component} from 'react';
import {HashRouter as Router, Route} from 'react-router-dom';
import userLogin from "./userLogin";
import registerUser from "./registerUser";
import Admin from "./UserDashboard/Admin";

class user extends Component {

    render() {
        return (
            <Router basename="">
                <Route path="/registerUser" component={registerUser}>
                </Route>
                <Route exact path="/" component={userLogin}>
                </Route>
                <Route path="/home" component={Admin}>
                </Route>
            </Router>
        );
    }
}

export default user;
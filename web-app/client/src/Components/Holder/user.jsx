import React, {Component} from 'react';
import {HashRouter as Router, Route} from 'react-router-dom';
import userLogin from "./userLogin";
import registerUser from "./registerUser";
import userPage from "./userPage";

class user extends Component {
    render() {
        return (
            <Router basename="">
                <Route path="/registerUser" component={registerUser}>
                </Route>
                <Route exact path="/" component={userLogin}>
                </Route>
                <Route exact path="/home" component={userPage}>
                </Route>
            </Router>
        );
    }
}

export default user;
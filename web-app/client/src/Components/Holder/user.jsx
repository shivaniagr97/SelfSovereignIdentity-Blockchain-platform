import React, { Component } from 'react';
import { HashRouter as Router, Route, Link, NavLink } from 'react-router-dom';
import userLogin from "./userLogin";
import registerUser from "./registerUser";
import './registerUser.css';

class user extends Component {
    render() {
        return (
            <Router basename="/react-auth-ui/">
                <div className="App">
                    <div className="App__Aside">
                        <h1 align="center">
                            Hey user! Good to see you here!
                        </h1>
                    </div>
                    <div className="App__Form">
                        <div className="PageSwitcher">
                            <NavLink exact to="/" activeClassName="PageSwitcher__Item--Active" className="PageSwitcher__Item">Sign In</NavLink>
                            <NavLink to="/registerUser" activeClassName="PageSwitcher__Item--Active" className="PageSwitcher__Item">Sign Up</NavLink>
                        </div>

                        <div className="FormTitle">
                            <NavLink exact to="/" activeClassName="FormTitle__Link--Active" className="FormTitle__Link">Sign In</NavLink> or <NavLink to="/registerUser" activeClassName="FormTitle__Link--Active" className="FormTitle__Link">Sign Up</NavLink>
                        </div>

                        <Route path="/registerUser" component={registerUser}>
                        </Route>
                        <Route exact path="/" component={userLogin}>
                        </Route>
                    </div>

                </div>
            </Router>
        );
    }
}

export default user;
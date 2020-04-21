import React, {Component} from 'react';
import {HashRouter as Router, Link, NavLink, Redirect, Route} from 'react-router-dom';
import './userLogin.css';
import axios from 'axios';
import {ADDRESS} from "../constants";
import Spinner from "react-bootstrap/Spinner";
import registerUser from "./registerUser";
import userPage from "./userPage";

class userLogin extends Component {
    constructor(props) {
        super(props);

        const token = localStorage.getItem("token");
        let loggedIn = true;
        if (token == null) {
            loggedIn = false;
        }
        this.state = {
            userID: '',
            password: '',
            alertType: "danger",
            alertData: "",
            alertShow: false,
            loggedIn
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(e) {
        let target = e.target;
        let value = target.type === 'checkbox' ? target.checked : target.value;
        let name = target.name;

        this.setState({
            [event.target.name]: event.target.value
        });
    }

    async handleSubmit(e) {
        e.preventDefault();

        this.setState({
            spinner: true
        });

        const userCredentials = {
            userID: this.state.userID,
            password: this.state.password
        };

        let response = await axios.post(ADDRESS + `verifyPassword`, userCredentials);

        if (typeof response.data === "object") {
            localStorage.setItem("token", this.state.userID);
            this.setState({
                loggedIn: true,
            });
        } else {
            this.setState({
                spinner: false,
                alertShow: true,
                alertType: "danger",
                alertData: response.data,
            });
        }
    }

    render() {
        if (this.state.loggedIn === true) {
            return <Redirect to={{
                pathname: 'home',
            }}/>;
        }
        if (this.state.spinner) {
            return <Spinner animation="border"/>;
        } else {

            return (
                <Router basename="">
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

                            <div className="FormCenter">
                                <form onSubmit={this.handleSubmit} className="FormFields">
                                    <div className="FormField">
                                        <label className="FormField__Label" htmlFor="userID">User ID</label>
                                        <input type="string" id="userID" className="FormField__Input" placeholder="Enter your userId"
                                               name="userID" value={this.state.userID} onChange={this.handleChange}/>
                                    </div>

                                    <div className="FormField">
                                        <label className="FormField__Label" htmlFor="password">Password</label>
                                        <input type="password" id="password" className="FormField__Input"
                                               placeholder="Enter your password" name="password" value={this.state.password}
                                               onChange={this.handleChange}/>
                                    </div>

                                    <div className="FormField">
                                        <button className="FormField__Button mr-20">Sign In</button>
                                        <Link to="/registerUser" className="FormField__Link">Create an account</Link>
                                    </div>
                                </form>
                            </div>
                        </div>

                    </div>
                </Router>
            );
        }
    }
}

export default userLogin;
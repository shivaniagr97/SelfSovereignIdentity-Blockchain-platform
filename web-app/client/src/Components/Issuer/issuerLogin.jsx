import React, {Component} from 'react';
import {Link, NavLink, Redirect} from 'react-router-dom';
import './issuerLogin.css';
import axios from 'axios';
import {ADDRESS} from "../constants";
import AppAside from "./AppAside";
import FormSwitcher from "./FormSwitcher";

class issuerLogin extends Component {
    constructor(props) {
        super(props);
        localStorage.clear();
        const issuerToken = localStorage.getItem("issuerToken");
        let loggedIn = true;
        if (issuerToken == null) {
            loggedIn = false;
        }
        this.state = {
            userID: '',
            password: '',
            sessionKey: '',
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
            [name]: value
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
        response = response.data;

        if (response.data !== "Incorrect" && response.data !== "Failed to verify password") {
            let issuerToken = {
                userID: this.state.userID,
                sessionKey: response.data
            };
            localStorage.setItem("issuerToken", JSON.stringify(issuerToken));
            this.setState({
                loggedIn: true,
                sessionKey: response.data
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
        } else {

            return (
                <div className="App">
                    <AppAside/>
                    <div className="App__Form">
                        <FormSwitcher/>
                        <div className="FormCenter">
                            <form onSubmit={this.handleSubmit} className="FormFields">
                                <div className="FormField">
                                    <label className="FormField__Label" htmlFor="userID">User ID</label>
                                    <input type="string" id="userID" className="FormField__Input"
                                           placeholder="Enter your userId"
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
            );
        }
    }
}

export default issuerLogin;
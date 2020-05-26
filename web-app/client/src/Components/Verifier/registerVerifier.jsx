import React, {Component} from 'react';
import {Link, Redirect} from 'react-router-dom';
import axios from 'axios';
import './registerVerifier.css'
import {ADDRESS} from "../constants";
import FormSwitcher from "./FormSwitcher";
import AppAside from "./AppAside";

class registerVerifier extends Component {
    constructor(props) {
        super(props);

        this.state = {
            userID: '',
            password: '',
            contact: '',
            email: '',
            docTypes: [],
            hasAgreed: false,
            SMSUpdates: false,
            isRegistered: false
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
        const userDetails = {
            verifierID: this.state.userID,
            password: this.state.password,
            contact: this.state.contact,
            email: this.state.email,
            docTypes: this.state.docTypes
        };
        let response = await axios.post(ADDRESS + `createVerifier`, userDetails);
        if (typeof response.data === "object") {
            localStorage.setItem("verifierToken", this.state.userID);
            this.setState({
                isRegistered: true,
            });
        } else {
            this.setState({
                spinner: false,
                alertShow: true,
                alertType: "danger",
                alertData: response.data,
            });
        }

        console.log('The form was submitted with the following data:');
        console.log(this.state);
    }

    render() {
        if (this.state.isRegistered === true) {
            return <Redirect to='/'/>
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
                                    <input type="text" id="userID" className="FormField__Input"
                                           placeholder="Enter your user ID"
                                           name="userID" value={this.state.userID} onChange={this.handleChange}/>
                                </div>
                                <div className="FormField">
                                    <label className="FormField__Label" htmlFor="password">Password</label>
                                    <input type="password" id="password" className="FormField__Input"
                                           placeholder="Enter your password" name="password" value={this.state.password}
                                           onChange={this.handleChange}/>
                                </div>
                                <div className="FormField">
                                    <label className="FormField__Label" htmlFor="contact">Contact Number</label>
                                    <input type="contact" id="contact" className="FormField__Input"
                                           placeholder="Enter your contact number"
                                           name="contact" value={this.state.contact} onChange={this.handleChange}/>
                                </div>
                                <div className="FormField">
                                    <label className="FormField__Label" htmlFor="email">E-Mail Address</label>
                                    <input type="email" id="email" className="FormField__Input"
                                           placeholder="Enter your email"
                                           name="email" value={this.state.email} onChange={this.handleChange}/>
                                </div>
                                <div className="FormField">
                                    <label className="FormField__Label" htmlFor="docTypes">Document Type</label>
                                    <input type="docTypes" id="docTypes" className="FormField__Input"
                                           placeholder="Enter your document type"
                                           name="docTypes" value={this.state.docTypes} onChange={this.handleChange}/>
                                </div>
                                <div className="FormField">
                                    <label className="FormField__CheckboxLabel">
                                        <input className="FormField__Checkbox" type="checkbox" name="hasAgreed"
                                               value={this.state.hasAgreed} onChange={this.handleChange}/> I agree all
                                        statements
                                        in <a href="" className="FormField__TermsLink">terms of service</a>
                                    </label>
                                </div>

                                <div className="FormField">
                                    <button className="FormField__Button mr-20">Sign Up</button>
                                    <Link exact to="/" className="FormField__Link">I'm already member</Link>
                                </div>
                            </form>
                        </div>

                    </div>

                </div>
            );
        }
    }
}

export default registerVerifier;
import React, {Component} from 'react';
import {Link, Redirect} from 'react-router-dom';
import axios from 'axios';
import './registerUser.css'
import {ADDRESS} from "../constants";
import FormSwitcher from "./FormSwitcher";
import AppAside from "./AppAside";

class registerUser extends Component {
    constructor(props) {
        localStorage.removeItem('userToken');
        super(props);
        this.state = {
            firstName: '',
            lastName: '',
            userID: '',
            password: '',
            dateOfBirth: '',
            address: '',
            city: '',
            state: '',
            pinCode: '',
            contact: '',
            email: '',
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
            firstName: this.state.firstName,
            lastName: this.state.lastName,
            userID: this.state.userID,
            password: this.state.password,
            dateOfBirth: this.state.dateOfBirth,
            address: this.state.address,
            city: this.state.city,
            state: this.state.state,
            pinCode: this.state.pinCode,
            contact: this.state.contact,
            email: this.state.email
        };
        let response = await axios.post(ADDRESS + `registerHolder`, userDetails);
        if (typeof response.data === "object") {
            localStorage.setItem("userToken", this.state.userID);
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
                                    <label className="FormField__Label" htmlFor="name">First Name</label>
                                    <input type="text" id="firstName" className="FormField__Input"
                                           placeholder="Enter your first name"
                                           name="firstName" value={this.state.firstName} onChange={this.handleChange}/>
                                </div>
                                <div className="FormField">
                                    <label className="FormField__Label" htmlFor="lastName">Last Name</label>
                                    <input type="text" id="lastName" className="FormField__Input"
                                           placeholder="Enter your last name"
                                           name="lastName" value={this.state.lastName} onChange={this.handleChange}/>
                                </div>
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
                                    <label className="FormField__Label" htmlFor="dateOfBirth">Date Of Birth</label>
                                    <input type="date" id="dateOfBirth" className="FormField__Input"
                                           placeholder="Enter your date of birth"
                                           name="dateOfBirth" value={this.state.dateOfBirth}
                                           onChange={this.handleChange}/>
                                </div>
                                <div className="FormField">
                                    <label className="FormField__Label" htmlFor="address">Address</label>
                                    <input type="address" id="address" className="FormField__Input"
                                           placeholder="Enter your address"
                                           name="address" value={this.state.address} onChange={this.handleChange}/>
                                </div>
                                <div className="FormField">
                                    <label className="FormField__Label" htmlFor="city">City</label>
                                    <input type="city" id="city" className="FormField__Input"
                                           placeholder="Enter your city"
                                           name="city" value={this.state.city} onChange={this.handleChange}/>
                                </div>
                                <div className="FormField">
                                    <label className="FormField__Label" htmlFor="state">State</label>
                                    <input type="state" id="state" className="FormField__Input"
                                           placeholder="Enter your state"
                                           name="state" value={this.state.state} onChange={this.handleChange}/>
                                </div>
                                <div className="FormField">
                                    <label className="FormField__Label" htmlFor="pinCode">Pin Code</label>
                                    <input type="pinCode" id="pinCode" className="FormField__Input"
                                           placeholder="Enter your pinCode"
                                           name="pinCode" value={this.state.pinCode} onChange={this.handleChange}/>
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
                                    <label className="FormField__CheckboxLabel">
                                        <input className="FormField__Checkbox" type="checkbox" name="hasAgreed"
                                               value={this.state.hasAgreed} onChange={this.handleChange}/> I agree all
                                        statements
                                        in <a href="" className="FormField__TermsLink">terms of service</a>
                                    </label>
                                </div>

                                <div className="FormField">
                                    <button className="FormField__Button mr-20">Sign Up</button>
                                    <Link to="/" className="FormField__Link">I'm already member</Link>
                                </div>
                            </form>
                        </div>

                    </div>

                </div>
            );
        }
    }
}

export default registerUser;
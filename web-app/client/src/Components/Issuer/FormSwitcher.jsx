import {NavLink} from "react-router-dom";
import React, {Component} from "react";

class FormSwitcher extends Component {
    render() {
        return (
            <div>
                <div className="PageSwitcher">
                    <NavLink exact to="/" activeClassName="PageSwitcher__Item--Active"
                             className="PageSwitcher__Item">Sign In</NavLink>
                    <NavLink to="/registerIssuer" activeClassName="PageSwitcher__Item--Active"
                             className="PageSwitcher__Item">Sign Up</NavLink>
                </div>

                <div className="FormTitle">
                    <NavLink exact to="/" activeClassName="FormTitle__Link--Active" className="FormTitle__Link">Sign
                        In</NavLink> or <NavLink to="/registerIssuer" activeClassName="FormTitle__Link--Active"
                                                 className="FormTitle__Link">Sign Up</NavLink>
                </div>
            </div>
        );
    }
}

export default FormSwitcher;
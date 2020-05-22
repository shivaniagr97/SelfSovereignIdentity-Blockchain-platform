import React from "react";
import classNames from "classnames";
// @material-ui/core components
import {makeStyles} from "@material-ui/core/styles";
import MenuItem from "@material-ui/core/MenuItem";
import MenuList from "@material-ui/core/MenuList";
import Grow from "@material-ui/core/Grow";
import Paper from "@material-ui/core/Paper";
import ClickAwayListener from "@material-ui/core/ClickAwayListener";
import Hidden from "@material-ui/core/Hidden";
import Poppers from "@material-ui/core/Popper";
import Divider from "@material-ui/core/Divider";
// @material-ui/icons
import Person from "@material-ui/icons/Person";
// core components
import Button from "../CustomButtons/Button.jsx";
//backend call
import axios from "axios";
import {ADDRESS} from "../../Components/constants.js";

import styles from "../../assets/jss/material-dashboard-react/components/headerLinksStyle.js";
import {Redirect} from "react-router-dom";

const useStyles = makeStyles(styles);

export default function AdminNavbarLinks() {
    const classes = useStyles();
    const [logOut, setLogOut] = React.useState(false);
    const [openProfile, setOpenProfile] = React.useState(null);

    const handleClickProfile = event => {
        if (openProfile && openProfile.contains(event.target)) {
            setOpenProfile(null);
        } else {
            setOpenProfile(event.currentTarget);
        }
    };

    const handleCloseProfile = () => {
        setOpenProfile(null);
    };

    const handleLogOut = async () => {
        console.log("here");
        try {
            let userCredentials = JSON.parse(localStorage.getItem('token'));
            userCredentials.id = userCredentials.userID;
            console.log(userCredentials);
            let response = await axios.post(ADDRESS + `logOut`, userCredentials);
            response = response.data;
            console.log(response);
            if (response === 'Correct') {
                setLogOut(true);
                localStorage.removeItem("token");
            } else {
                //handle the failure by a error message stating why it failed
            }
        } catch (e) {
            //handle the error by giving out a error messeage saying the logOUt failed
        }
    };

    if (logOut) {
        return <Redirect to={{
            pathname: '/',
        }}/>;
    }

    return (
        <div>
            <div className={classes.manager}>
                <Button
                    color={window.innerWidth > 959 ? "transparent" : "white"}
                    justIcon={window.innerWidth > 959}
                    simple={!(window.innerWidth > 959)}
                    aria-owns={openProfile ? "profile-menu-list-grow" : null}
                    aria-haspopup="true"
                    onClick={handleClickProfile}
                    className={classes.buttonLink}
                >
                    <Person className={classes.icons}/>
                    <Hidden mdUp implementation="css">
                        <p className={classes.linkText}>Profile</p>
                    </Hidden>
                </Button>
                <Poppers
                    open={Boolean(openProfile)}
                    anchorEl={openProfile}
                    transition
                    disablePortal
                    className={
                        classNames({[classes.popperClose]: !openProfile}) +
                        " " +
                        classes.popperNav
                    }
                >
                    {({TransitionProps, placement}) => (
                        <Grow
                            {...TransitionProps}
                            id="profile-menu-list-grow"
                            style={{
                                transformOrigin:
                                    placement === "bottom" ? "center top" : "center bottom"
                            }}
                        >
                            <Paper>
                                <ClickAwayListener onClickAway={handleCloseProfile}>
                                    <MenuList role="menu">
                                        <MenuItem
                                            onClick={handleCloseProfile}
                                            className={classes.dropdownItem}
                                        >
                                            Profile
                                        </MenuItem>
                                        <Divider light/>
                                        <MenuItem
                                            onClick={handleLogOut}
                                            className={classes.dropdownItem}
                                        >
                                            Logout
                                        </MenuItem>
                                    </MenuList>
                                </ClickAwayListener>
                            </Paper>
                        </Grow>
                    )}
                </Poppers>
            </div>
        </div>
    );
}

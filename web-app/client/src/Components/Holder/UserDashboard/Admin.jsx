import React from "react";
import {Switch, Route, Redirect} from "react-router-dom";
import axios from 'axios';
import PerfectScrollbar from "perfect-scrollbar";
import "perfect-scrollbar/css/perfect-scrollbar.css";
import {makeStyles} from "@material-ui/core/styles";
import Navbar from "../../../UIComponents/Navbars/Navbar.jsx";
import Sidebar from "../../../UIComponents/Sidebar/Sidebar.jsx";
import routes from "./userRoutes.jsx";
import styles from "../../../assets/jss/material-dashboard-react/layouts/adminStyle.js";
import bgImage from "../../../assets/img/sidebar-2.jpg";
import logo from "../../../assets/img/holder.png";
import {ADDRESS} from "../../constants";

let ps;

const useStyles = makeStyles(styles);

export default function Admin({...rest}) {
    const classes = useStyles();
    const mainPanel = React.createRef();
    console.log(localStorage.getItem('userToken'));

    // states and functions
    const [image, setImage] = React.useState(bgImage);
    const [userData, setUserData] = React.useState({});
    const [logOut, setLogOut] = React.useState(false);
    const [color, setColor] = React.useState("blue");
    const [mobileOpen, setMobileOpen] = React.useState(false);

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };
    const getRoute = () => {
        return window.location.pathname !== "/home/maps";
    };
    const resizeFunction = () => {
        if (window.innerWidth >= 960) {
            setMobileOpen(false);
        }
    };

    // initialize and destroy the PerfectScrollbar plugin
    React.useEffect(() => {
        //first fetch the data from the backend about the user
        const fetchUserData = async () => {
            console.log("hete");
            try {
                let userCredentials = JSON.parse(localStorage.getItem('userToken'));
                if (!userCredentials) {
                    setLogOut(true);
                } else {
                    userCredentials.type = "user";
                    console.log(userCredentials);
                    let response = await axios.post(ADDRESS + `readAsset`, userCredentials);
                    if (response !== null) {
                        response = response.data;
                        response = JSON.parse(response);
                        response.sessionKey = userCredentials.sessionKey;
                        console.log(response);
                        setUserData(response || {});
                    }
                }
            } catch (e) {
                console.log(e);
            }
        };
        localStorage.setItem("token", localStorage.getItem("userToken"));
        console.log(Object.keys(userData).length === 0);
        if (!Object.keys(userData).length)
            fetchUserData();
        if (navigator.platform.indexOf("Win") > -1) {
            ps = new PerfectScrollbar(mainPanel.current, {
                suppressScrollX: true,
                suppressScrollY: false
            });
            document.body.style.overflow = "hidden";
        }
        window.addEventListener("resize", resizeFunction);
        // Specify how to clean up after this effect:
        return function cleanup() {
            if (navigator.platform.indexOf("Win") > -1) {
                ps.destroy();
            }
            window.removeEventListener("resize", resizeFunction);
        };
    }, [mainPanel]);

    if (logOut) {
        return <Redirect to={{
            pathname: '/',
        }}/>;
    }

    const switchRoutes = (
        <Switch>
            {routes.map((prop, key) => {
                if (prop.layout === "/home") {
                    return (
                        <Route
                            path={prop.layout + prop.path}
                            render={(props) => <prop.component {...props} userData={userData}/>}
                            key={key}
                        />
                    );
                }
                return null;
            })}
            {/*<Redirect from="/home" to="/home/dashboard" />*/}
        </Switch>
    );

    return (
        <div className={classes.wrapper}>
            <Sidebar
                routes={routes}
                logoText={"Holder"}
                logo={logo}
                image={image}
                handleDrawerToggle={handleDrawerToggle}
                open={mobileOpen}
                color={color}
                {...rest}
            />
            <div className={classes.mainPanel} ref={mainPanel}>
                <Navbar
                    routes={routes}
                    handleDrawerToggle={handleDrawerToggle}
                    {...rest}
                />
                {getRoute() ? (
                    <div className={classes.content}>
                        <div className={classes.container}>{switchRoutes}</div>
                    </div>
                ) : (
                    <div className={classes.map}>{switchRoutes}</div>
                )}
            </div>
        </div>
    );
}

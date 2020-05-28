import React from "react";
import {Switch, Route, Redirect} from "react-router-dom";
import axios from 'axios';
import PerfectScrollbar from "perfect-scrollbar";
import "perfect-scrollbar/css/perfect-scrollbar.css";
import {makeStyles} from "@material-ui/core/styles";
import Navbar from "../../../UIComponents/Navbars/Navbar.jsx";
import Sidebar from "../../../UIComponents/Sidebar/Sidebar.jsx";
import routes from "./issuerRoutes.jsx";
import styles from "../../../assets/jss/material-dashboard-react/layouts/adminStyle.js";
import bgImage from "../../../assets/img/sidebar-2.jpg";
import logo from "../../../assets/img/holder.png";
import {ADDRESS} from "../../constants";

let ps;

const useStyles = makeStyles(styles);

export default function Admin({...rest}) {
    const classes = useStyles();
    const mainPanel = React.createRef();
    console.log(localStorage.getItem('issuerToken'));

    // states and functions
    const [image, setImage] = React.useState(bgImage);
    const [issuerData, setIssuerData] = React.useState({});
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
        //first fetch the data from the backend about the issuer
        const fetchIssuerData = async () => {
            console.log("here");
            try {
                let issuerCredentials = JSON.parse(localStorage.getItem('issuerToken'));
                if (!issuerCredentials) {
                    setLogOut(true);
                } else {
                    issuerCredentials.type = "issuer";
                    console.log(issuerCredentials);
                    let response = await axios.post(ADDRESS + `readAsset`, issuerCredentials);
                    if (response !== null) {
                        response = response.data;
                        response = JSON.parse(response);
                        response.sessionKey = issuerCredentials.sessionKey;
                        console.log(response);
                        setIssuerData(response || {});
                    }
                }
            } catch (e) {
                console.log(e);
            }
        };
        localStorage.setItem("token", localStorage.getItem("issuerToken"));
        console.log(Object.keys(issuerData).length === 0);
        if (!Object.keys(issuerData).length)
            fetchIssuerData();
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
                            render={(props) => <prop.component {...props} issuerData={issuerData}/>}
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
                logoText={"Issuer"}
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

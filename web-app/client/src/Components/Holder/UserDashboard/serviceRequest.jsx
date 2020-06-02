import React from "react";
import {makeStyles} from "@material-ui/core/styles";
import GridItem from "../../../UIComponents/Grid/GridItem.jsx";
import GridContainer from "../../../UIComponents/Grid/GridContainer.jsx";
import Button from "../../../UIComponents/CustomButtons/Button.jsx";
import Card from "../../../UIComponents/Card/Card.jsx";
import CardHeader from "../../../UIComponents/Card/CardHeader.jsx";
import CardBody from "../../../UIComponents/Card/CardBody.jsx";
import axios from "axios";
import {ADDRESS} from "../../constants.js";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import InputLabel from "@material-ui/core/InputLabel";
import FormControl from "@material-ui/core/FormControl";
import Typography from "@material-ui/core/Typography";

const styles = {
    cardCategoryWhite: {
        color: "rgba(255,255,255,.62)",
        margin: "0",
        fontSize: "14px",
        marginTop: "0",
        marginBottom: "0"
    },
    cardTitleWhite: {
        color: "#FFFFFF",
        marginTop: "0px",
        minHeight: "auto",
        fontWeight: "300",
        fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif",
        marginBottom: "3px",
        textDecoration: "none"
    }
};

const useStyles = makeStyles(styles);

export default function ServiceRequest(props) {
    const classes = useStyles();
    localStorage.setItem("token", localStorage.getItem("userToken"));
    const [userData, setUserData] = React.useState(props.userData);
    const [serviceProviderDetails, setServiceProviderDetails] = React.useState([]);
    const [currentServiceProviderDetails, setCurrentServiceProviderDetails] = React.useState([]);
    const [serviceRequestSchema, setServiceRequestSchema] = React.useState({
        userID: "",
        issuerID: "",
        documentType: "",
    });

    React.useEffect(() => {
        const fetchServiceProvidersData = async () => {
            console.log("here");
            try {
                let requestType = {
                    requestType: "serviceProvider",
                    sessionKey: userData.sessionKey,
                    userID: userData.userID,
                };
                let response = await axios.post(ADDRESS + `getGenericData`, requestType);
                response = response.data;
                console.log(response);
                let serviceProvider = [];

                for (let i = 0; i < response.length; i++) {
                    let item = {};
                    item["issuerID"] = response[i].Record.issuerID;
                    item["city"] = response[i].Record.city;
                    item["issuerType"] = response[i].Record.issuerType;
                    console.log(item);
                    serviceProvider.push(item);
                }
                console.log("serviceProvider");
                console.log(serviceProvider);
                setServiceProviderDetails(serviceProvider);

            } catch (e) {
                console.log(e);
            }
        };
        console.log(userData);
        if (typeof userData === 'object' && Object.keys(userData).length) {
            fetchServiceProvidersData();
        }
    }, []);


    function fetchServiceType(serviceProviderId) {
        for (let i = 0; i < serviceProviderDetails.length; i++) {
            if (serviceProviderDetails[i].issuerID === serviceProviderId) {
                return serviceProviderDetails[i];
            }
        }
    }

    const handleChange = (event) => {
        event.preventDefault();
        if (serviceRequestSchema.issuerID === '') {
            manageIssueRequestDisplay();
        }
        serviceRequestSchema[event.target.name] = event.target.value;
        setCurrentServiceProviderDetails(fetchServiceType(event.target.value));
        console.log("currentServiceProviderDetails");
        console.log(currentServiceProviderDetails);
        serviceRequestSchema.documentType = currentServiceProviderDetails.issuerType;
        console.log(serviceRequestSchema);
        setServiceRequestSchema(serviceRequestSchema);
    };

    function createServiceProviderMenuItems() {
        console.log("menu items creation");
        console.log(serviceProviderDetails);
        let items = [];
        for (let i = 0; i < serviceProviderDetails.length; i++) {
            items.push(<MenuItem
                key={i}
                value={serviceProviderDetails[i].issuerID}>{serviceProviderDetails[i].issuerID + " " + serviceProviderDetails[i].issuerType}</MenuItem>);
        }
        return items;
    }

    const manageIssueRequestDisplay = () => {
        var x = document.getElementById("serviceRequest");
        if (x.style.display === "none") {
            x.style.display = "block";
        } else {
            x.style.display = "none";
        }
    };

    const submitRequest = async () => {
        console.log("here");
        try {
            serviceRequestSchema.userID = userData.userID;
            serviceRequestSchema.sessionKey = userData.sessionKey;
            console.log(currentServiceProviderDetails);
            console.log(serviceRequestSchema);
            let response = await axios.post(ADDRESS + `createIssueRequest`, serviceRequestSchema);
            response = response.data;
            console.log(response);
            manageIssueRequestDisplay();
        } catch (e) {
            console.log(e);
        }
    };

    return (
        <div>
            <GridContainer>
                <GridItem xs={12} sm={12} md={8}>
                    <Card>
                        <CardHeader color="primary">
                            <h4 className={classes.cardTitleWhite}>Service Request</h4>
                        </CardHeader>
                        <CardBody>
                            <GridContainer direction={"column"} justify={"center"} alignItems="center">
                                <GridItem xs={12} sm={12} md={8}>
                                    <FormControl>
                                        <InputLabel id="issuerID">Select Issuer</InputLabel>
                                        <Select
                                            style={{minWidth: 300}}
                                            id="issuerID"
                                            name={"issuerID"}
                                            value={serviceRequestSchema.issuerID}
                                            onChange={handleChange}
                                        >
                                            {createServiceProviderMenuItems()}
                                        </Select>
                                    </FormControl>
                                </GridItem>
                            </GridContainer>
                            <div id='serviceRequest' style={{display: 'none'}}>
                                <GridContainer direction={"column"} justify={"center"} alignItems="center">
                                    <GridItem xs={12} sm={12} md={8}>
                                        <Typography component="p" variant="h6" align='center'>
                                            ServiceProvider Id : {currentServiceProviderDetails.issuerID || ''}
                                            <br/>
                                            ServiceType: {currentServiceProviderDetails.issuerType || ''}
                                            <br/>
                                            City : {currentServiceProviderDetails.city || ''}
                                        </Typography>
                                    </GridItem>
                                    <GridItem xs={12} sm={12} md={5}>
                                        <Button style={{minWidth: 200}} color="primary" onClick={submitRequest}>Submit
                                            Request</Button>
                                    </GridItem>

                                </GridContainer>
                            </div>
                        </CardBody>
                    </Card>
                </GridItem>
            </GridContainer>
        </div>
    );
}
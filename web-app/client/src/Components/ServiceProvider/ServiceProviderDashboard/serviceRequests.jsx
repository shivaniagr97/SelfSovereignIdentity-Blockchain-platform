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
import CustomInput from "../../../UIComponents/CustomInput/CustomInput";
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
    localStorage.setItem("token", localStorage.getItem("serviceProviderToken"));
    const [userData, setUserData] = React.useState(props.serviceProviderData);
    const [serviceRequestDetails, setServiceRequestDetails] = React.useState({});
    const [requestAccessSchema, setRequestAccessSchema] = React.useState({
        requesterID: "",
        holderID: "",
        documentsRequested: "",
    });
    console.log(userData);

    async function fetchServiceRequestData() {
        console.log("here");
        try {
            let payloadSchema = {
                listType: 'issueRequests',
                assetId: serviceRequestDetails.issueRequestID,
                sessionKey: userData.sessionKey,
                issuerID: userData.issuerID,
                type: "issuer",
            };
            let response = await axios.post(ADDRESS + `readIndividualAsset`, payloadSchema);
            response = response.data;
            console.log(response);
            if (typeof response === 'object' && response !== []) {
                let date = new Date(response.timeStamp * 1000);
                response.timeStamp = date.toDateString();
                setServiceRequestDetails(response);
                manageIssueRequestDisplay();
            }
        } catch (e) {
            console.log(e);
        }
    }

    const handleChange = async (event) => {
        event.preventDefault();
        if (event.target.name === "issueRequestID") {
            serviceRequestDetails[event.target.name] = event.target.value;
            setServiceRequestDetails(serviceRequestDetails);
            await fetchServiceRequestData();
        } else {
            requestAccessSchema[event.target.name] = event.target.value;
            setRequestAccessSchema(requestAccessSchema);
        }
    };

    const manageIssueRequestDisplay = () => {
        var x = document.getElementById("issueRequest");
        if (x.style.display === "none") {
            x.style.display = "block";
        } else {
            x.style.display = "none";
        }
    };

    const submitRequest = async () => {
        console.log("here");
        try {
            requestAccessSchema.holderID = serviceRequestDetails.holderID;
            requestAccessSchema.requesterID = userData.issuerID;
            requestAccessSchema.sessionKey = userData.sessionKey;
            requestAccessSchema.documentsRequested = requestAccessSchema.documentsRequested.split(',');
            console.log(requestAccessSchema);
            let response = await axios.post(ADDRESS + `requestAccess`, requestAccessSchema);
            response = response.data;
            console.log(response);
            manageIssueRequestDisplay();
        } catch (e) {
            console.log(e);
        }
    };

    function createIssueRequestMenuItems() {
        console.log(userData);
        if (typeof userData === 'object' && Object.keys(userData).length) {
            console.log("menu items creation");
            let items = [];
            for (let i = 0; i < userData.issueRequests.length; i++) {
                items.push(<MenuItem
                    key={i}
                    value={userData.issueRequests[i]}>{userData.issueRequests[i]}</MenuItem>);
            }
            return items;
        }
    }

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
                                        <InputLabel id="issueRequestID">Select Service Request</InputLabel>
                                        <Select
                                            style={{minWidth: 300}}
                                            id="issueRequestID"
                                            name={"issueRequestID"}
                                            value={serviceRequestDetails.issuerID || ''}
                                            onChange={handleChange}
                                        >
                                            {createIssueRequestMenuItems()}
                                        </Select>
                                    </FormControl>
                                </GridItem>
                            </GridContainer>
                            <div id='issueRequest' style={{display: 'none'}}>
                                <GridContainer direction={"column"} justify={"center"} alignItems="center">
                                    <GridItem xs={12} sm={12} md={5}>
                                        <Typography component="p" variant="h6" align='center'>
                                            {/*userID, issuerID, documentType, timeStamp, requestId*/}
                                            Holder Id : {serviceRequestDetails.holderID || ''}
                                            <br/>
                                            Time: {serviceRequestDetails.timeStamp || ''}
                                            <br/>
                                            RequestId : {serviceRequestDetails.requestID || ''}
                                            <br/>
                                            Document Type : {serviceRequestDetails.documentType || ''}
                                            <br/>
                                            Status : {serviceRequestDetails.status || ''}
                                        </Typography>
                                    </GridItem>
                                    <GridItem xs={12} sm={12} md={5}>
                                        <CustomInput
                                            labelText="Document Types(, separated)"
                                            id="documentsRequested"
                                            formControlProps={{
                                                fullWidth: true
                                            }}
                                            style={{minWidth: 300}}
                                            name="documentsRequested"
                                            autoComplete={"documentsRequested"}
                                            readOnly={false}
                                            value={requestAccessSchema.documentsRequested || ''}
                                            handleChange={handleChange}
                                        />
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
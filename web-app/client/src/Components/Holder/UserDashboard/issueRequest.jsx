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

export default function IssueRequest(props) {
    const classes = useStyles();
    localStorage.setItem("token", localStorage.getItem("userToken"));
    const [userData, setUserData] = React.useState(props.userData);
    const [issuerDetails, setIssuerDetails] = React.useState([]);
    const [issueRequestSchema, setIssueRequestSchema] = React.useState({
        userID: "",
        issuerID: "",
        documentType: "",
    });
    const fetchIssuerData = async () => {
        console.log("here");
        try {
            let requestType = {
                requestType: "issuer",
                issuerType: issueRequestSchema.documentType,
                sessionKey: userData.sessionKey,
                userID: userData.userID,
            };
            let response = await axios.post(ADDRESS + `getGenericData`, requestType);
            response = response.data;
            console.log(response);
            let issuer = [];

            for (let i = 0; i < response.length; i++) {
                let item = {};
                item["issuerID"] = response[i].Record.issuerID;
                item["city"] = response[i].Record.city;
                console.log(item);
                issuer.push(item);
            }
            if (response.length) {
                manageIssueRequestDisplay();
            }
            console.log(issuer);
            setIssuerDetails(issuer);

        } catch (e) {
            console.log(e);
        }
    };

    const handleChange = (event) => {
        //   event.preventDefault();
        issueRequestSchema[event.target.name] = event.target.value;
        console.log(issueRequestSchema);
        setIssueRequestSchema(issueRequestSchema);
    };

    function createIssuerMenuItems() {
        console.log("menu items creation");
        let items = [];
        for (let i = 0; i < issuerDetails.length; i++) {
            items.push(<MenuItem
                key={i}
                value={issuerDetails[i].issuerID}>{issuerDetails[i].issuerID + " " + issuerDetails[i].city}</MenuItem>);
        }
        return items;
    }

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
            issueRequestSchema.userID = userData.userID;
            issueRequestSchema.sessionKey = userData.sessionKey;
            let response = await axios.post(ADDRESS + `createIssueRequest`, issueRequestSchema);
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
                            <h4 className={classes.cardTitleWhite}>Issue Request</h4>
                        </CardHeader>
                        <CardBody>
                            <GridContainer direction={"column"} alignItems="center">
                                <GridItem xs={12}>
                                    <CustomInput
                                        labelText="Issuer Type"
                                        id="IssuerType"
                                        formControlProps={{
                                            fullWidth: true
                                        }}
                                        style={{minWidth: 300}}
                                        name="documentType"
                                        autoComplete={"Issuer Type"}
                                        readOnly={false}
                                        value={issueRequestSchema.documentType || ''}
                                        handleChange={handleChange}
                                    />
                                </GridItem>
                                <GridItem xs={12} sm={12}>
                                    <Button style={{minWidth: 200}} color="primary" onClick={fetchIssuerData}>Fetch
                                        Issuer</Button>
                                </GridItem>

                            </GridContainer>
                            <div id='issueRequest' style={{display: 'none'}}>
                                <GridContainer direction={"column"} justify={"center"} alignItems="center">
                                    <GridItem xs={12} sm={12} md={8}>
                                        <FormControl>
                                            <InputLabel id="issuerID">Select Issuer</InputLabel>
                                            {/*<TextField variant="outlined"*/}
                                            {/*           required*/}
                                            {/*           style={{minWidth: 300}}*/}
                                            {/*           fullWidth*/}
                                            {/*           select*/}
                                            {/*           label="Select Issuer"*/}
                                            {/*           id="issuerID"*/}
                                            {/*           name={"issuerID"}*/}
                                            {/*           autoComplete="issuerID"*/}
                                            {/*           classes={{root: classes.root}}*/}
                                            {/*           defaultValue={"issueRequestSchema.issuerID || ''"}*/}
                                            {/*           onChange={handleChange}*/}
                                            {/*>*/}
                                            <Select
                                                style={{minWidth: 300}}
                                                id="issuerID"
                                                name={"issuerID"}
                                                value={issueRequestSchema.issuerID}
                                                onChange={handleChange}
                                            >
                                                {/*<MenuItem value={"issuerDetails[i].issuerID"}>{"issuerDetails[i].issuerID +  + issuerDetails[i].city"}</MenuItem>*/}
                                                {createIssuerMenuItems()}
                                            </Select>
                                        </FormControl>
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
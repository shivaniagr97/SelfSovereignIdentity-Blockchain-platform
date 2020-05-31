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

export default function VerifyRequest(props) {
    const classes = useStyles();
    localStorage.setItem("token", localStorage.getItem("userToken"));
    const [userData, setUserData] = React.useState(props.userData);
    const [verifierDetails, setVerifierDetails] = React.useState([]);
    const [verifyRequestSchema, setVerifyRequestSchema] = React.useState({
        userID: "",
        verifierID: "",
        documentID: "",
    });
    const fetchVerifierData = async () => {
        console.log("here");
        try {
            let requestType = {
                requestType: "verifier",
                docTypes: verifyRequestSchema.documentType,
                sessionKey: userData.sessionKey,
                userID: userData.userID,
            };
            let response = await axios.post(ADDRESS + `getGenericData`, requestType);
            response = response.data;
            console.log(response);
            let verifier = [];

            for (let i = 0; i < response.length; i++) {
                let item = {};
                item["verifierID"] = response[i].Record.verifierID;
                console.log(item);
                verifier.push(item);
            }
            if (response.length) {
                manageVerifyRequestDisplay();
            }
            console.log(verifier);
            setVerifierDetails(verifier);

        } catch (e) {
            console.log(e);
        }
    };

    const handleChange = (event) => {
        //   event.preventDefault();
        verifyRequestSchema[event.target.name] = event.target.value;
        console.log(verifyRequestSchema);
        setVerifyRequestSchema(verifyRequestSchema);
    };

    function createVerifierMenuItems() {
        console.log("menu items creation");
        let items = [];
        for (let i = 0; i < verifierDetails.length; i++) {
            items.push(<MenuItem
                key={i}
                value={verifierDetails[i].verifierID}>{verifierDetails[i].verifierID}</MenuItem>);
        }
        return items;
    }

    function createDocumentMenuItems() {
        console.log("menu items creation");
        if (Object.keys(userData).length) {
            let documents = Object.keys(userData.accessRights);
            let items = [];
            for (let i = 0; i < documents.length; i++) {
                items.push(<MenuItem
                    key={i}
                    value={documents[i]}>{documents[i]}</MenuItem>);
            }
            return items;
        }
    }

    const manageVerifyRequestDisplay = () => {
        var x = document.getElementById("verifyRequest");
        if (x.style.display === "none") {
            x.style.display = "block";
        } else {
            x.style.display = "none";
        }
    };

    const submitRequest = async () => {
        console.log("here");
        try {
            let documents = Object.keys(userData.accessRights);
           // console.log(documents.contains(verifyRequestSchema.documentID));
            verifyRequestSchema.userID = userData.userID;
            verifyRequestSchema.sessionKey = userData.sessionKey;
            let response = await axios.post(ADDRESS + `createVerifyRequest`, verifyRequestSchema);
            response = response.data;
            console.log(response);
            manageVerifyRequestDisplay();
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
                            <h4 className={classes.cardTitleWhite}>Verify Request</h4>
                        </CardHeader>
                        <CardBody>
                            <GridContainer direction={"column"} justify={"center"} alignItems="center">
                                <GridItem xs={12} sm={12} md={5}>
                                    <CustomInput
                                        labelText="Verifier Type"
                                        id="VerifierType"
                                        formControlProps={{
                                            fullWidth: true
                                        }}
                                        style={{minWidth: 300}}
                                        name="documentType"
                                        autoComplete={"Verifier Type"}
                                        readOnly={false}
                                        value={verifyRequestSchema.documentType || ''}
                                        handleChange={handleChange}
                                    />
                                </GridItem>
                                <GridItem xs={12} sm={12} md={5}>
                                    <Button style={{minWidth: 200}} color="primary" onClick={fetchVerifierData}>Fetch
                                        Verifier</Button>
                                </GridItem>

                            </GridContainer>
                            <div id='verifyRequest' style={{display: 'none'}}>
                                <GridContainer direction={"column"} justify={"center"} alignItems="center">
                                    <GridItem xs={12} sm={12} md={5}>
                                        <FormControl>
                                            <InputLabel
                                                id="verifierID">{"Select Verifier"}</InputLabel>
                                            <Select
                                                style={{minWidth: 300}}
                                                id="verifierID"
                                                name={"verifierID"}
                                                value={verifyRequestSchema.verifierID}
                                                onChange={handleChange}
                                            >
                                                {createVerifierMenuItems()}
                                            </Select>
                                        </FormControl>
                                    </GridItem>
                                    <GridItem xs={12} sm={12} md={5}>
                                        <FormControl>
                                            <InputLabel
                                                id="documentID">{"Select Document"}</InputLabel>
                                            <Select
                                                style={{minWidth: 300}}
                                                id="documentID"
                                                name={"documentID"}
                                                value={verifyRequestSchema.documentID}
                                                onChange={handleChange}
                                            >
                                                {createDocumentMenuItems()}
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
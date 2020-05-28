import React from "react";
import {makeStyles} from "@material-ui/core/styles";
import GridItem from "../../../UIComponents/Grid/GridItem.jsx";
import GridContainer from "../../../UIComponents/Grid/GridContainer.jsx";
import CustomInput from "../../../UIComponents/CustomInput/CustomInput.jsx";
import Button from "../../../UIComponents/CustomButtons/Button.jsx";
import Card from "../../../UIComponents/Card/Card.jsx";
import CardHeader from "../../../UIComponents/Card/CardHeader.jsx";
import CardBody from "../../../UIComponents/Card/CardBody.jsx";
import CardFooter from "../../../UIComponents/Card/CardFooter.jsx";
import axios from "axios";
import {ADDRESS} from "../../constants.js";

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

export default function IssuerProfile(props) {
    const classes = useStyles();
    localStorage.setItem("token", localStorage.getItem("issuerToken"));
    const [issuerData, setIssuerData] = React.useState(props.issuerData);
    console.log(issuerData);

    const handleChange = (event) => {
        event.preventDefault();
        console.log(event.target.name);
        console.log(event.target.value);
        issuerData[event.target.name] = event.target.value;
        setIssuerData(issuerData);
        console.log("here");
    };

    const submitDetails = async (event) => {
        event.preventDefault();
        let response = "";
        try {
            console.log(issuerData);
            response = await axios.post(ADDRESS + `updateAsset`, issuerData);
            response = response.data;
            console.log(response);
            if (response === "Correct") {
                console.log(response);
                delete issuerData.password;
                setIssuerData(issuerData);
            } else {
                //show error message
                console.log(response);
            }
        } catch (e) {
            //show error message
            console.log("failed to connect to the server");
        }
    };

    return (
        <div>
            <GridContainer>
                <GridItem xs={12} sm={12} md={8}>
                    <Card>
                        <CardHeader color="primary">
                            <h4 className={classes.cardTitleWhite}>Edit Profile</h4>
                            <p className={classes.cardCategoryWhite}>Complete your profile</p>
                        </CardHeader>
                        <CardBody>
                            <GridContainer>
                                <GridItem xs={12} sm={12} md={5}>
                                    <CustomInput
                                        labelText="Contact"
                                        id="Contact"
                                        formControlProps={{
                                            fullWidth: true
                                        }}
                                        name={"contact"}
                                        autoComplete={"Contact"}
                                        readOnly={false}
                                        value={issuerData.contact || ''}
                                        handleChange={handleChange}
                                    />
                                </GridItem>
                                <GridItem xs={12} sm={12} md={3}>
                                    <CustomInput
                                        labelText="IssuerName"
                                        id="issuerID"
                                        formControlProps={{
                                            fullWidth: true
                                        }}
                                        name={"issuerID"}
                                        autoComplete={"issuerID"}
                                        readOnly={true}
                                        value={issuerData.issuerID || ''}
                                    />
                                </GridItem>
                                <GridItem xs={12} sm={12} md={3}>
                                    <CustomInput
                                        labelText="IssuerType"
                                        id="issuerType"
                                        formControlProps={{
                                            fullWidth: true
                                        }}
                                        name={"issuerType"}
                                        autoComplete={"issuerType"}
                                        readOnly={true}
                                        value={issuerData.issuerType || ''}
                                    />
                                </GridItem>
                                <GridItem xs={12} sm={12} md={4}>
                                    <CustomInput
                                        labelText="Email Address"
                                        id="email"
                                        formControlProps={{
                                            fullWidth: true
                                        }}
                                        name={"email"}
                                        autoComplete={"email"}
                                        readOnly={false}
                                        value={issuerData.email || ''}
                                        handleChange={handleChange}
                                    />
                                </GridItem>
                                <GridItem xs={12} sm={12} md={4}>
                                    <CustomInput
                                        labelText="City"
                                        id="city"
                                        formControlProps={{
                                            fullWidth: true
                                        }}
                                        name={"city"}
                                        autoComplete={"city"}
                                        readOnly={false}
                                        value={issuerData.city || ''}
                                        handleChange={handleChange}
                                    />
                                </GridItem>
                                <GridItem xs={12} sm={12} md={4}>
                                    <CustomInput
                                        labelText="State"
                                        id="state"
                                        formControlProps={{
                                            fullWidth: true
                                        }}
                                        name={"state"}
                                        autoComplete={"state"}
                                        readOnly={false}
                                        value={issuerData.state || ''}
                                        handleChange={handleChange}
                                    />
                                </GridItem>
                                <GridItem xs={12} sm={12} md={4}>
                                    <CustomInput
                                        labelText="Postal Code"
                                        id="postal-code"
                                        formControlProps={{
                                            fullWidth: true
                                        }}
                                        name={"pinCode"}
                                        autoComplete={"pinCode"}
                                        readOnly={false}
                                        value={issuerData.pinCode || ''}
                                        handleChange={handleChange}
                                    />
                                </GridItem>
                                <GridItem xs={12} sm={12} md={4}>
                                    <CustomInput
                                        labelText="Password"
                                        id="password"
                                        formControlProps={{
                                            fullWidth: true
                                        }}
                                        name={"password"}
                                        autoComplete={"password"}
                                        readOnly={false}
                                        value={issuerData.password || ''}
                                        type={'password'}
                                        handleChange={handleChange}
                                    />
                                </GridItem>
                            </GridContainer>
                        </CardBody>
                        <CardFooter>
                            <Button color="primary" onClick={submitDetails}>Update Profile</Button>
                        </CardFooter>
                    </Card>
                </GridItem>
            </GridContainer>
        </div>
    );
}

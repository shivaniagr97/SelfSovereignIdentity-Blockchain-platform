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

export default function ServiceProviderProfile(props) {
    const classes = useStyles();
    localStorage.setItem("token", localStorage.getItem("serviceProviderToken"));
    const [serviceProviderData, setServiceProviderData] = React.useState(props.serviceProviderData);
    console.log(serviceProviderData);

    const handleChange = (event) => {
        event.preventDefault();
        console.log(event.target.name);
        console.log(event.target.value);
        serviceProviderData[event.target.name] = event.target.value;
        setServiceProviderData(serviceProviderData);
        console.log("here");
    };

    const submitDetails = async (event) => {
        event.preventDefault();
        let response = "";
        try {
            console.log(serviceProviderData);
            serviceProviderData.userID = serviceProviderData.issuerID;
            response = await axios.post(ADDRESS + `updateAsset`, serviceProviderData);
            response = response.data;
            if (response === "Correct") {
                console.log(response);
                delete serviceProviderData.password;
                setServiceProviderData(serviceProviderData);
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
                                        value={serviceProviderData.contact || ''}
                                        handleChange={handleChange}
                                    />
                                </GridItem>
                                <GridItem xs={12} sm={12} md={3}>
                                    <CustomInput
                                        labelText="ServiceProviderName"
                                        id="serviceProviderID"
                                        formControlProps={{
                                            fullWidth: true
                                        }}
                                        name={"issuerID"}
                                        autoComplete={"serviceProviderID"}
                                        readOnly={true}
                                        value={serviceProviderData.issuerID || ''}
                                    />
                                </GridItem>
                                <GridItem xs={12} sm={12} md={3}>
                                    <CustomInput
                                        labelText="ServiceProviderType"
                                        id="serviceProviderType"
                                        formControlProps={{
                                            fullWidth: true
                                        }}
                                        name={"issuerType"}
                                        autoComplete={"serviceType"}
                                        readOnly={true}
                                        value={serviceProviderData.issuerType || ''}
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
                                        value={serviceProviderData.email || ''}
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
                                        value={serviceProviderData.city || ''}
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
                                        value={serviceProviderData.state || ''}
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
                                        value={serviceProviderData.pinCode || ''}
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
                                        value={serviceProviderData.password || ''}
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

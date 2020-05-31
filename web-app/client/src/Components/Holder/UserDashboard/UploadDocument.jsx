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

export default function UploadDocument(props) {
    const classes = useStyles();
    localStorage.setItem("token", localStorage.getItem("userToken"));
    const [userData, setUserData] = React.useState(props.userData);
    const [documentType, setDocumentType] = React.useState('');
    const [selectedDocumentFile, setSelectedDocumentFile] = React.useState('');
    console.log(userData);
    console.log("herehere");

    const handleChange = (event) => {
        event.preventDefault();
        if (event.target.name === 'identity') {
            console.log(event.target.files[0]);
            setSelectedDocumentFile(event.target.files[0]);
        } else if (event.target.name === 'DocumentType') {
            console.log(event.target.value);
            setDocumentType(event.target.value);
        }
    };

    const submitDetails = async (event) => {
        event.preventDefault();
        let response = "";
        console.log("submitDetails begins");
        try {
            let data = new FormData();
            data.append('file', selectedDocumentFile, selectedDocumentFile.name);
            data.append('holderID', userData.userID);
            data.append('time', new Date().toLocaleString());
            data.append('documentType', documentType);
            data.append('sessionKey', userData.sessionKey);

            console.log(data);
            response = await axios.post(ADDRESS + `createIdentity`, data);
            response = response.data;
            if (response === 'Correct') {
                setSelectedDocumentFile('');
                setDocumentType('');
            } else {
                console.log(response);
            }
        } catch (e) {
            //show error message
            console.log(e);
        }
    };

    return (
        <div>
            <GridContainer>
                <GridItem xs={12} sm={12} md={8}>
                    <Card>
                        <CardHeader color="primary">
                            <h4 className={classes.cardTitleWhite}>Upload Document</h4>
                        </CardHeader>
                        <CardBody>
                            <GridContainer>
                                <GridItem xs={12} sm={12} md={5}>
                                    <CustomInput
                                        labelText="Document Type"
                                        id="DocumentType"
                                        formControlProps={{
                                            fullWidth: true
                                        }}
                                        name="DocumentType"
                                        autoComplete={"Document Type"}
                                        readOnly={false}
                                        value=''
                                        handleChange={handleChange}
                                    />
                                </GridItem>
                                <GridItem xs={12} sm={12} md={5}>
                                    <CustomInput
                                        type="file"
                                        id="identity"
                                        formControlProps={{
                                            fullWidth: true
                                        }}
                                        name="identity"
                                        readOnly={false}
                                        handleChange={handleChange}
                                    />
                                </GridItem>
                            </GridContainer>
                        </CardBody>
                        <CardFooter>
                            <Button color="primary" onClick={submitDetails}>Upload Document</Button>
                        </CardFooter>
                    </Card>
                </GridItem>
            </GridContainer>
        </div>
    );
}
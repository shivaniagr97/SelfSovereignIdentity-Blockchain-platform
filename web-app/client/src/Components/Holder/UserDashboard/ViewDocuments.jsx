import React from "react";
import GridContainer from "../../../UIComponents/Grid/GridContainer";
import GridItem from "../../../UIComponents/Grid/GridItem";
import Card from "../../../UIComponents/Card/Card";
import CardHeader from "../../../UIComponents/Card/CardHeader";
import CardBody from "../../../UIComponents/Card/CardBody";
import CardFooter from "../../../UIComponents/Card/CardFooter";
import Button from "../../../UIComponents/CustomButtons/Button";
import ToggleButton from '@material-ui/lab/ToggleButton';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';
import axios from "axios";
import {ADDRESS} from "../../constants.js";
import {makeStyles} from "@material-ui/core/styles";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import Table from "@material-ui/core/Table";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import {object} from "prop-types";
import Dialog from "@material-ui/core/Dialog";
import PropTypes from 'prop-types';

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

function SimpleDialog(props) {
    const {onClose, imageURL, open} = props;

    const handleClose = () => {
        onClose(imageURL);
    };
    return (
        <Dialog onClose={handleClose} scroll={"body"} aria-labelledby="simple-dialog-title" open={open}>
            <img src={imageURL} alt="rahul parihar"
                 width="100%" height="60%"/>
        </Dialog>
    );
}

SimpleDialog.propTypes = {
    onClose: PropTypes.func.isRequired,
    open: PropTypes.bool.isRequired,
    imageURL: PropTypes.string.isRequired,
};

const useStyles = makeStyles(styles);
export default function ViewDocuments(props) {

    const classes = useStyles();
    localStorage.setItem("token", localStorage.getItem("userToken"));
    const [userData, setUserData] = React.useState(props.userData);
    const [mode, setMode] = React.useState('uploaded');
    const [uploadedDocumentTableDisplay, setUploadedDocumentTableDisplay] = React.useState(true);
    const [issuedDocumentTableDisplay, setIssuedDocumentTableDisplay] = React.useState(false);
    const [uploadedDocumentsDetails, setUploadedDocumentsDetails] = React.useState([]);
    const [issuedDocumentsDetails, setIssuedDocumentsDetails] = React.useState([]);
    const [documentDetail, setDocumentDetail] = React.useState([]);
    const [open, setOpen] = React.useState(false);
    const [imageURL, setImageURL] = React.useState('');

    const handleClose = () => {
        setOpen(false);
    };

    async function displayDocument(values) {
        console.log(values);
        console.log("here");
        try {
            let fileSchema = {
                documentId: values.documentID,
                userID: values.holderID,
                sessionKey: userData.sessionKey,
                type: values.documentType,
                id: userData.userID
            };
            await axios.post(ADDRESS + `fetchFileFromDatabase`, fileSchema, {responseType: "blob"})
                .then(res => {
                    console.log(res);
                    let url = URL.createObjectURL(res.data);
                    console.log(url);
                    setOpen(true);
                    setImageURL(url);
                });
        } catch (e) {
            console.log(e);
        }
    }


    React.useEffect(() => {
        const fetchDocumentData = async () => {
            try {
                let payloadSchema = {
                    listType: 'accessRights',
                    accessRights: Object.keys(userData.accessRights),
                    sessionKey: userData.sessionKey,
                    userID: userData.userID,
                    type: "holder",
                };
                let response = await axios.post(ADDRESS + `readIndividualAsset`, payloadSchema);
                response = response.data;
                console.log(response);
                if (typeof response === 'object') {
                    for (let i = 0; i < response.length; i++) {
                        let document = response[i][0];
                        if (document.hasOwnProperty("issuerID")) {
                            issuedDocumentsDetails.push(document);
                        } else {
                            uploadedDocumentsDetails.push(document);
                        }
                    }
                    console.log(issuedDocumentsDetails);
                    console.log(uploadedDocumentsDetails);
                    setIssuedDocumentsDetails(issuedDocumentsDetails);
                    setUploadedDocumentsDetails(uploadedDocumentsDetails);
                }

            } catch (e) {
                console.log(e);
            }
        };
        if (Object.keys(userData).length) {
            fetchDocumentData();
        }
    }, []);
    const handleMode = async (event, newMode) => {
        console.log(newMode);
        if (newMode === null) {
            setUploadedDocumentTableDisplay(false);
            setIssuedDocumentTableDisplay(false);
        } else if (newMode === 'uploaded') {
            setUploadedDocumentTableDisplay(true);
            setIssuedDocumentTableDisplay(false);
        } else {
            setUploadedDocumentTableDisplay(false);
            setIssuedDocumentTableDisplay(true);
        }
        setMode(newMode);
    };

    var uploadedTable = uploadedDocumentTableDisplay ? (
        <GridItem xs={12}>
            <Table size="medium">
                <TableHead>
                    <TableRow>
                        <TableCell style={{fontWeight: 'bold'}}>Document Type</TableCell>
                        <TableCell style={{fontWeight: 'bold'}}>Document Id</TableCell>
                        <TableCell style={{fontWeight: 'bold'}}>Verifier Id</TableCell>
                        <TableCell style={{fontWeight: 'bold'}}>View Document</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {createUploadedTableBody()}
                </TableBody>
            </Table>
        </GridItem>
    ) : (<div/>);

    var issuedTable = issuedDocumentTableDisplay ? (
        <GridItem xs={12}>
            <Table size="medium">
                <TableHead>
                    <TableRow>
                        <TableCell style={{fontWeight: 'bold'}}>Document Type</TableCell>
                        <TableCell style={{fontWeight: 'bold'}}>Document Id</TableCell>
                        <TableCell style={{fontWeight: 'bold'}}>Issuer Id</TableCell>
                        <TableCell style={{fontWeight: 'bold'}}>View Document</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {createIssuedTableBody()}
                </TableBody>
            </Table>
        </GridItem>
    ) : (<div/>);

    function createUploadedTableBody() {
        let rows = [];
        for (let i = 0; i < uploadedDocumentsDetails.length; i++) {
            console.log(uploadedDocumentsDetails);
            rows.push(
                <TableRow key={i}>
                    <TableCell>{(uploadedDocumentsDetails[i].documentType)}</TableCell>
                    <TableCell>{uploadedDocumentsDetails[i].documentID}</TableCell>
                    <TableCell>{(uploadedDocumentsDetails[i].verifierID) || "Not Verified"}</TableCell>
                    <TableCell><Button name={i}
                                       onClick={() => displayDocument(uploadedDocumentsDetails[i])}>
                        {'View Document'}
                    </Button></TableCell>
                </TableRow>
            );
        }
        console.log(rows);
        return rows;
    }

    function createIssuedTableBody() {
        let rows = [];
        for (let i = 0; i < issuedDocumentsDetails.length; i++) {
            rows.push(
                <TableRow key={i}>
                    <TableCell>{(issuedDocumentsDetails[i].documentType)}</TableCell>
                    <TableCell>{issuedDocumentsDetails[i].documentID}</TableCell>
                    <TableCell>{(issuedDocumentsDetails[i].issuerID)}</TableCell>
                    <TableCell><Button name={i}
                                       onClick={() => displayDocument(issuedDocumentsDetails[i])}>
                        {'View Document'}
                    </Button></TableCell>
                </TableRow>
            );
        }
        console.log(rows);
        return rows;
    }

    return (
        <div>
            <GridContainer>
                <GridItem xs={12} sm={12} md={8}>
                    <Card>
                        <CardHeader color="primary">
                            <h4 className={classes.cardTitleWhite}>View Documents</h4>
                        </CardHeader>
                        <CardBody>
                            <GridContainer alignItems={"center"} justify={"center"}>
                                <GridItem>
                                    <ToggleButtonGroup
                                        size="small"
                                        value={mode}
                                        exclusive
                                        onChange={handleMode}
                                        aria-label="Mode Selection">
                                        <ToggleButton value="uploaded" aria-label="Uploaded Documents">
                                            Uploaded Documents
                                        </ToggleButton>
                                        <ToggleButton value="issued" aria-label="Issued Documents">
                                            Issued Documents
                                        </ToggleButton>
                                    </ToggleButtonGroup>
                                </GridItem>
                            </GridContainer>
                            {issuedTable}
                            {uploadedTable}
                            <SimpleDialog imageURL={imageURL} open={open} onClose={handleClose}/>
                        </CardBody>
                        <CardFooter>
                        </CardFooter>
                    </Card>
                </GridItem>
            </GridContainer>
        </div>
    );
}
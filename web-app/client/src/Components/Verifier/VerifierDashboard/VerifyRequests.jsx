import React from "react";
import GridContainer from "../../../UIComponents/Grid/GridContainer";
import GridItem from "../../../UIComponents/Grid/GridItem";
import Card from "../../../UIComponents/Card/Card";
import CardHeader from "../../../UIComponents/Card/CardHeader";
import CardBody from "../../../UIComponents/Card/CardBody";
import Button from "../../../UIComponents/CustomButtons/Button";
import axios from "axios";
import {ADDRESS} from "../../constants.js";
import {makeStyles} from "@material-ui/core/styles";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import Table from "@material-ui/core/Table";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import PropTypes from "prop-types";

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
    const {onClose, imageURL, open, documentInfo} = props;

    const handleClose = () => {
        onClose(imageURL);
    };
    let verifierOrIssuer;
    if (documentInfo.hasOwnProperty('issuerID')) {
        verifierOrIssuer = 'IssuerID';
    } else {
        verifierOrIssuer = 'VerifierID';

    }
    console.log(documentInfo);
    return (
        <Dialog onClose={handleClose} scroll={'body'} aria-labelledby="simple-dialog-title" open={open}>
            <DialogContent>
                <DialogTitle id="simple-dialog-title" style={{textAlign: "center"}}>
                    <b>UserId:</b> {documentInfo.holderID}<br/>
                    <b>{verifierOrIssuer}:</b> {documentInfo.verifierID || documentInfo.issuerID || 'Not Verified'}<br/>
                    <b>DocumentID:</b> {documentInfo.documentID}<br/>
                    <b>DocumentType:</b> {documentInfo.documentType}
                </DialogTitle>
                <img src={imageURL} alt="rahul parihar"
                     width="100%" height="60%"/>
            </DialogContent>
        </Dialog>
    );
}

SimpleDialog.propTypes = {
    onClose: PropTypes.func.isRequired,
    open: PropTypes.bool.isRequired,
    imageURL: PropTypes.string.isRequired,
    documentInfo: PropTypes.object.isRequired,
};

const useStyles = makeStyles(styles);
export default function VerifyRequests(props) {

    const classes = useStyles();
    localStorage.setItem("token", localStorage.getItem("verifierToken"));
    const [userData, setUserData] = React.useState(props.verifierData);
    const [documentAccessInfo, setDocumentAccessInfo] = React.useState([]);
    const [documentId, setDocumentId] = React.useState('');
    const [currentDocument, setCurrentDocument] = React.useState({});
    const [imageURL, setImageURL] = React.useState('');
    const [open, setOpen] = React.useState(false);
    const [requestIdDetails, setRequestIdDetails] = React.useState([]);
    console.log(userData);

    React.useEffect(() => {
        const fetchUserDetailsAndDocuments = async () => {
            try {
                let payloadSchema = {
                    listType: 'accessDocumentInfo',
                    accessDocumentInfo: Object.keys(userData.accessDocumentInfo),
                    sessionKey: userData.sessionKey,
                    verifierID: userData.verifierID,
                    type: "verifier",
                };
                let response = await axios.post(ADDRESS + `readIndividualAsset`, payloadSchema);
                response = response.data;
                console.log(response);
                if (typeof response === 'object') {
                    setDocumentAccessInfo(response);
                }
                //fetch all the requestIds from the backend was bored so didnt change the backend hehe
                payloadSchema.listType = 'verifyRequests';
                delete payloadSchema.accessDocumentInfo;
                for (let i = 0; i < userData.verifyRequests.length; i++) {
                    payloadSchema.assetId = userData.verifyRequests[i];
                    response = await axios.post(ADDRESS + `readIndividualAsset`, payloadSchema);
                    response = response.data;
                    console.log(response);
                    if (typeof response === 'object' && response !== []) {
                        let date = new Date(response.timeStamp * 1000);
                        response.timeStamp = date.toDateString();
                        requestIdDetails.push(response);
                    }
                }
                setRequestIdDetails(requestIdDetails);
            } catch (e) {
                console.log(e);
            }
        };
        console.log(userData);
        if (typeof userData === 'object' && Object.keys(userData).length) {
            fetchUserDetailsAndDocuments();
        }
    }, []);


    function handleChange(e) {
        e.preventDefault();
        console.log("handleChange");
        console.log(e.target.value);
        setDocumentId(e.target.value);

    }

    function checkAndFetchVerifyRequest(userID, documentID) {
        console.log("checkAndFetchVerifyRequest");
        for (let i = 0; i < requestIdDetails.length; i++) {
            console.log(requestIdDetails[i].documentID + " " + documentID + " " + requestIdDetails.holderID + " " + userID);
            if (requestIdDetails[i].documentID === documentID && requestIdDetails[i].holderID === userID) {
                return requestIdDetails[i].requestID;
            }
        }
        return -1;
    }

    function createTableBody() {
        let rows = [];
        for (let i = 0; i < documentAccessInfo.length; i++) {
            //first match the request id to the proper requester Id once done we will display and verify identity
            console.log("create Body Table");
            console.log(documentAccessInfo);
            if (documentAccessInfo[i].length === 1) {
                continue;
            }
            //fetch the request ID and match all the details
            console.log(requestIdDetails);
            let requestID = checkAndFetchVerifyRequest(documentAccessInfo[i][0].userID, documentAccessInfo[i][1].documentID);
            if (requestID === -1) {
                continue;
            }
            console.log(requestID);
            rows.push(<TableRow key={i}>
                <TableCell>{requestID}</TableCell>
                <TableCell>{documentAccessInfo[i][0].userID}</TableCell>
                <TableCell>{documentAccessInfo[i][0].firstName + " " + documentAccessInfo[i][0].lastName}</TableCell>
                <TableCell>{documentAccessInfo[i][1].documentID}</TableCell>
                <TableCell align="right">
                    <Button name={i} style={{minWidth:70}} onClick={() => displayDocument(documentAccessInfo[i])}>
                        {'click here'}
                    </Button>
                </TableCell>
                <TableCell align="right">
                    <Button name={i} style={{minWidth:70}} onClick={() => VerifyIdentityRequest(documentAccessInfo[i])}>
                        {'click here'}
                    </Button>
                </TableCell>
            </TableRow>);
        }
        console.log(rows);
        return rows;
    }


    async function VerifyIdentityRequest(userCompleteInfo) {
        let response = "";
        console.log("submitDetails begins");
        try {
            console.log(requestIdDetails);
            console.log(userCompleteInfo);
            let requestID = '';
            for (let i = 0; i < requestIdDetails.length; i++) {
                if (userCompleteInfo[0].userID === requestIdDetails[i].holderID) {
                    requestID = requestIdDetails[i].requestID;
                    break;
                }
            }
            if (requestID !== '') {
                let payloadSchema = {
                    sessionKey: userData.sessionKey,
                    verifierID: userData.verifierID,
                    documentID: userCompleteInfo[1].documentID,
                    requestID: requestID
                };
                console.log(payloadSchema);
                response = await axios.post(ADDRESS + `verifyIdentity`, payloadSchema);
                response = response.data;
                if (response === 'Correct') {
                    setDocumentId('');
                } else {
                    console.log(response);
                }
            }
        } catch (e) {
            //show error message
            console.log(e);
        }
    }

    async function displayDocument(UserCompleteInfo) {
        console.log(UserCompleteInfo[1]);
        console.log("display Document");
        try {
            let fileSchema = {
                documentId: UserCompleteInfo[1].documentID,
                userID: UserCompleteInfo[1].holderID,
                sessionKey: userData.sessionKey,
                type: UserCompleteInfo[1].documentType,
                id: userData.verifierID
            };
            await axios.post(ADDRESS + `fetchFileFromDatabase`, fileSchema, {responseType: "blob"})
                .then(res => {
                    console.log(res);
                    let url = URL.createObjectURL(res.data);
                    console.log(url);
                    setImageURL(url);
                    setOpen(true);
                    setCurrentDocument(UserCompleteInfo[1]);
                });
        } catch (e) {
            console.log(e);
        }
    }

    const handleClose = () => {
        setOpen(false);
    };

    return (
        <div>
            <GridContainer>
                <GridItem xs={12} sm={12} md={9}>
                    <Card>
                        <CardHeader color="primary">
                            <h4 className={classes.cardTitleWhite}>Verify Request</h4>
                        </CardHeader>
                        <CardBody>

                            <Table size="medium">
                                <TableHead>
                                    <TableRow>
                                        <TableCell style={{fontWeight: 'bold'}}>Request Id</TableCell>
                                        <TableCell style={{fontWeight: 'bold'}}>User Id</TableCell>
                                        <TableCell style={{fontWeight: 'bold'}}>User Name</TableCell>
                                        <TableCell style={{fontWeight: 'bold'}}>Document Id</TableCell>
                                        <TableCell style={{fontWeight: 'bold'}}>View Document</TableCell>
                                        <TableCell style={{fontWeight: 'bold'}}>Verify Identity</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {createTableBody()}
                                </TableBody>
                            </Table>
                            <SimpleDialog imageURL={imageURL} open={open} onClose={handleClose}
                                          documentInfo={currentDocument}/>
                        </CardBody>
                    </Card>
                </GridItem>
            </GridContainer>
        </div>
    );
}
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
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
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
export default function ProvideService(props) {

    const classes = useStyles();
    localStorage.setItem("token", localStorage.getItem("serviceProviderToken"));
    const [userData, setUserData] = React.useState(props.serviceProviderData);
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
                    issuerID: userData.issuerID,
                    type: "issuer",
                };
                let response = await axios.post(ADDRESS + `readIndividualAsset`, payloadSchema);
                response = response.data;
                console.log(response);
                if (typeof response === 'object') {
                    setDocumentAccessInfo(response);
                }
                //fetch all the requestIds from the backend was bored so didnt change the backend hehe
                payloadSchema.listType = 'issueRequests';
                payloadSchema.issueRequests = userData.issueRequests;
                for (let i = 0; i < userData.issueRequests.length; i++) {
                    payloadSchema.assetId = userData.issueRequests[i];
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

    function createTableBody() {
        let rows = [];
        for (let i = 0; i < documentAccessInfo.length; i++) {
            rows.push(<TableRow key={i}>
                <TableCell>{documentAccessInfo[i][0].userID}</TableCell>
                <TableCell>{documentAccessInfo[i][0].firstName + " " + documentAccessInfo[i][0].lastName}</TableCell>
                <TableCell>
                    <Select
                        style={{minWidth: 100}}
                        id="documentID"
                        name={"documentID"}
                        value={documentId}
                        onChange={handleChange}
                    >
                        {createMenuItems(documentAccessInfo[i])}
                    </Select>
                </TableCell>
                <TableCell align="right">
                    <Button name={i} onClick={() => displayDocument(documentAccessInfo[i])}>
                        {'click here'}
                    </Button>
                </TableCell>
            </TableRow>);
        }
        console.log(rows);
        return rows;
    }


    function createMenuItems(userInfo) {
        console.log("creteMenuItems");
        let items = [];
        for (let i = 1; i < userInfo.length; i++) {
            let documentId = userInfo[i].documentID;
            items.push(
                <MenuItem key={i} value={documentId}>
                    {documentId}
                </MenuItem>);
        }
        return items;
    }

    async function displayDocument(UserCompleteInfo) {
        let documentInfo = {};
        for (let i = 1; i < UserCompleteInfo.length; i++) {
            if (documentId === UserCompleteInfo[i].documentID) {
                documentInfo = UserCompleteInfo[i];
                break;
            }
        }
        console.log(documentInfo);
        console.log("display Document");
        try {
            let fileSchema = {
                documentId: documentId,
                userID: documentInfo.holderID,
                sessionKey: userData.sessionKey,
                type: documentInfo.documentType,
                id: userData.issuerID
            };
            await axios.post(ADDRESS + `fetchFileFromDatabase`, fileSchema, {responseType: "blob"})
                .then(res => {
                    console.log(res);
                    let url = URL.createObjectURL(res.data);
                    console.log(url);
                    setImageURL(url);
                    setOpen(true);
                    setCurrentDocument(documentInfo);
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
                <GridItem xs={12} sm={12} md={8}>
                    <Card>
                        <CardHeader color="primary">
                            <h4 className={classes.cardTitleWhite}>Provide Service</h4>
                        </CardHeader>
                        <CardBody>

                            <Table size="medium">
                                <TableHead>
                                    <TableRow>
                                        <TableCell style={{fontWeight: 'bold'}}>User Id</TableCell>
                                        <TableCell style={{fontWeight: 'bold'}}>User Name</TableCell>
                                        <TableCell style={{fontWeight: 'bold'}}>Documents</TableCell>
                                        <TableCell style={{fontWeight: 'bold'}}>View Documents</TableCell>
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
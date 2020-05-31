import React from "react";
import GridContainer from "../../../UIComponents/Grid/GridContainer";
import GridItem from "../../../UIComponents/Grid/GridItem";
import Card from "../../../UIComponents/Card/Card";
import CardHeader from "../../../UIComponents/Card/CardHeader";
import CardBody from "../../../UIComponents/Card/CardBody";
import CardFooter from "../../../UIComponents/Card/CardFooter";
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
import ToggleButton from "@material-ui/lab/ToggleButton";
import ToggleButtonGroup from "@material-ui/lab/ToggleButtonGroup";

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
export default function ManageAccess(props) {

    const classes = useStyles();
    localStorage.setItem("token", localStorage.getItem("userToken"));
    const [userData, setUserData] = React.useState(props.userData);
    const [requestersDetails, setRequestersDetails] = React.useState([]);
    const [accessRightsDetails, setAccessRightsDetails] = React.useState([]);
    const [documentIds, setDocumentIds] = React.useState([]);
    const [permissionedRequester, setPermissionedRequester] = React.useState('');
    const [mode, setMode] = React.useState('grantAccess');
    const [requesterTableDisplay, setRequesterTableDisplay] = React.useState(true);
    const [permissionedTableDisplay, setPermissionedTableDisplay] = React.useState(false);

    const handleMode = async (event, newMode) => {
        console.log(newMode);
        if (newMode === null) {
            setRequesterTableDisplay(false);
            setPermissionedTableDisplay(false);
        } else if (newMode === 'grantAccess') {
            setRequesterTableDisplay(true);
            setPermissionedTableDisplay(false);
        } else {
            setRequesterTableDisplay(false);
            setPermissionedTableDisplay(true);
        }
        setMode(newMode);
    };

    React.useEffect(() => {
        const fetchAccessControlData = async () => {
            try {
                let payloadSchema = {
                    listType: 'requesters',
                    requesters: Object.keys(userData.requesters),
                    sessionKey: userData.sessionKey,
                    userID: userData.userID,
                    type: "holder",
                };
                let response = await axios.post(ADDRESS + `readIndividualAsset`, payloadSchema);
                response = response.data;
                console.log(response);
                if (typeof response === 'object') {
                    setRequestersDetails(response);
                }
                delete payloadSchema.requesters;
                payloadSchema.listType = 'accessRights';
                payloadSchema.accessRights = Object.keys(userData.accessRights);
                response = await axios.post(ADDRESS + `readIndividualAsset`, payloadSchema);
                response = response.data;
                console.log(response);
                if (typeof response === 'object') {
                    setAccessRightsDetails(response);
                }

            } catch (e) {
                console.log(e);
            }
        };
        if (Object.keys(userData).length) {
            fetchAccessControlData();
        }
    }, []);

    var requesterTable = requesterTableDisplay ? (
        <GridItem xs={12}>
            <Table size="medium">
                <TableHead>
                    <TableRow>
                        <TableCell style={{fontWeight: 'bold'}}>Requester Id</TableCell>
                        <TableCell style={{fontWeight: 'bold'}}>Requester Type</TableCell>
                        <TableCell style={{fontWeight: 'bold'}}>Documents Requested</TableCell>
                        <TableCell style={{fontWeight: 'bold'}}>Select Documents</TableCell>
                        <TableCell style={{fontWeight: 'bold'}}>Grant Access</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {createRequestersTableBody()}
                </TableBody>
            </Table>
        </GridItem>
    ) : (<div/>);

    var permissionedTable = permissionedTableDisplay ? (
        <GridItem xs={12}>
            <Table size="medium">
                <TableHead>
                    <TableRow>
                        <TableCell style={{fontWeight: 'bold'}}>Document Id</TableCell>
                        <TableCell style={{fontWeight: 'bold'}}>Document Type</TableCell>
                        <TableCell style={{fontWeight: 'bold'}}>Permissioned Users</TableCell>
                        <TableCell style={{fontWeight: 'bold'}}>Revoke Access</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {createPermissionedTableBody()}
                </TableBody>
            </Table>
        </GridItem>
    ) : (<div/>);

    function createUsersMenuItems(documentID, index) {
        console.log("users menu items creation");
        let items = [];
        console.log(accessRightsDetails);
        if (accessRightsDetails.length && index !== undefined) {

            let users = [];
            if (accessRightsDetails[index].length > 1) {
                users = accessRightsDetails[index].slice(1, accessRightsDetails[index].length);
            }
            for (let i = 0; i < users.length; i++) {
                items.push(<MenuItem
                    key={i}
                    value={(users[i].verifierID || users[i].issuerID)}>{(users[i].verifierID || users[i].issuerID) + " " + users[i].type}</MenuItem>);
            }
            return items;
        }
    }

    function createDocumentsMenuItems() {
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

    function handleChange(e) {
        console.log("here");
        console.log(e.target.value);
        if (e.target.name === "documentIDs") {
            setDocumentIds(e.target.value);
        } else if (e.target.name === "permissionedUsers") {
            console.log(e);
            setPermissionedRequester(e.target.value);
        }
    }

    async function submitRequest(requesterId, documentId) {
        try {
            let payloadSchema = {
                sessionKey: userData.sessionKey,
                holderID: userData.userID,
                requesterID: requesterId,
                userID: userData.userID
            };

            if (permissionedTableDisplay) {
                payloadSchema.documentID = documentId;
                console.log(payloadSchema);
                let response = await axios.post(ADDRESS + `revokeAccess`, payloadSchema);
                response = response.data;
                console.log(response);
                if (response === 'Correct') {
                    setPermissionedRequester("");
                }
            } else if (requesterTableDisplay) {
                payloadSchema.permissionedIDs = documentIds;
                let response = await axios.post(ADDRESS + `grantAccess`, payloadSchema);
                response = response.data;
                console.log(response);
                if (response === 'Correct') {
                    for (let i = 0; i < requestersDetails.length; i++) {
                        if (requestersDetails[i][0].verifierID === requesterId || requestersDetails[i][0].issuerID === requesterId) {
                            requestersDetails.splice(i);
                            setRequestersDetails(requestersDetails);
                            break;
                        }
                    }
                }
            }
        } catch (e) {
            console.log(e);
        }
    }

    function createPermissionedTableBody() {
        let rows = [];
        for (let i = 0; i < accessRightsDetails.length; i++) {
            let document = accessRightsDetails[i][0];
            rows.push(
                <TableRow key={i}>
                    <TableCell>{document.documentID}</TableCell>
                    <TableCell>{(document.documentType)}</TableCell>
                    <TableCell>
                        <Select
                            multiple={false}
                            style={{minWidth: 200}}
                            id={document.documentID}
                            name={"permissionedUsers"}
                            value={permissionedRequester}
                            onChange={handleChange}
                        >
                            {createUsersMenuItems(document.documentID, i)}
                        </Select>
                    </TableCell>
                    <TableCell><Button name={i}
                                       onClick={() => submitRequest(permissionedRequester, document.documentID)}
                    >
                        {'Revoke Access'}
                    </Button></TableCell>
                </TableRow>
            );
        }
        console.log(rows);
        return rows;
    }

    function createRequestersTableBody() {
        let rows = [];
        for (let i = 0; i < requestersDetails.length; i++) {
            let requester = requestersDetails[i][0];
            console.log(requestersDetails[i].slice(1, requestersDetails[i].length));
            let documentsRequested = requestersDetails[i].slice(1, requestersDetails[i].length).join(', ');
            console.log(documentsRequested);
            rows.push(
                <TableRow key={i}>
                    <TableCell>{requester.verifierID || requester.issuerID}</TableCell>
                    <TableCell>{((requester.issuerType) || (requester.docTypes[0])) + " " + requester.type}</TableCell>
                    <TableCell>{documentsRequested}</TableCell>
                    <TableCell>
                        <Select
                            multiple={true}
                            style={{minWidth: 200}}
                            id="documentIDs"
                            name={"documentIDs"}
                            value={documentIds || []}
                            onChange={handleChange}
                        >
                            {createDocumentsMenuItems()}
                        </Select>
                    </TableCell>
                    <TableCell><Button name={i}
                                       onClick={() => submitRequest(requester.verifierID || requester.issuerID, "")}
                    >
                        {'Grant Access'}
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
                            <h4 className={classes.cardTitleWhite}>Manage Access</h4>
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
                                        <ToggleButton value="grantAccess" aria-label="Grant Document Access">
                                            Grant Access
                                        </ToggleButton>
                                        <ToggleButton value="revokeAccess" aria-label="Revoke Document Access">
                                            Revoke Access
                                        </ToggleButton>
                                    </ToggleButtonGroup>
                                </GridItem>
                                {requesterTable}
                                {permissionedTable}
                            </GridContainer>
                        </CardBody>
                        <CardFooter>
                        </CardFooter>
                    </Card>
                </GridItem>
            </GridContainer>
        </div>
    );
}
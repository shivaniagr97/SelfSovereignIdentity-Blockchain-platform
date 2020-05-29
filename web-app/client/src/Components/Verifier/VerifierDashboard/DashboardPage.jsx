import React from "react";
import GridContainer from "../../../UIComponents/Grid/GridContainer";
import CardActionArea from "@material-ui/core/CardActionArea";
import Card from "../../../UIComponents/Card/Card";
import CardMedia from "@material-ui/core/CardMedia";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import makeStyles from "@material-ui/core/styles/makeStyles";

const useStyles = makeStyles({
    root: {
        maxWidth: 600,
        maxHeight: 600,
        background: 'rgba(255,255,255,0.84)',
    },
});

export default function DashboardPage(props) {
    const classes = useStyles();
    return (
        <div align={"center"}>
            <GridContainer justify={"center"}>
                <Card className={classes.root}>
                    <CardActionArea>
                        <CardMedia
                            component="img"
                            alt="Contemplative Reptile"
                            height="600"
                            image="https://cdn2.iconfinder.com/data/icons/blockchain/500/blockchain_12-512.png"
                            title="Contemplative Reptile"
                        />
                        <CardContent>
                            <Typography gutterBottom variant="h5" component="h2">
                                Verifier
                            </Typography>
                            <Typography variant="body2" color="textSecondary" component="p">
                                Lizards are a widespread group of squamate reptiles, with over 6,000 species, ranging
                                across all continents except Antarctica
                            </Typography>
                        </CardContent>
                    </CardActionArea>
                </Card>
            </GridContainer>
        </div>
    );
}
import React from "react";
// nodejs library to set properties for components
import PropTypes from "prop-types";
// @material-ui/core components
import {makeStyles} from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";

const styles = {
    grid: {
        margin: "0 -15px !important",
        width: "unset"
    }
};

const useStyles = makeStyles(styles);

export default function GridContainer(props) {
    const classes = useStyles();
    const {
        children,
        justify,
        alignItems,
        alignContent,
        direction,
        ...rest
    } = props;
    return (
        <Grid container {...rest} className={classes.grid} justify={justify} alignItems={alignItems}
              direction={direction}
              alignContent={alignContent}>
            {children}
        </Grid>
    );
}

GridContainer.propTypes = {
    children: PropTypes.node,
    justify: PropTypes.string,
    alignContent: PropTypes.string,
    alignItems: PropTypes.string,
    direction: PropTypes.string,
};

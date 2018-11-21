import React from 'react';
import classes from './BuildControl.css';

const buildControl = (props) => (
    <div className={classes.BuildControl}>
        <div className={classes.Label}>{props.label}</div>
        <Button className={classes.Less}>Less</Button>
        <Button className={classes.More}>More</Button>
    </div>
);

export default buildControl;
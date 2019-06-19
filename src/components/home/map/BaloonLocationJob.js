import * as css from './BaloonLocationJob.css';
import {Col, Row} from "react-flexbox-grid";
import * as strings from '../../../utils/Strings';
import moment from 'moment';
import React from 'react';

const BaloonLocationJob = (props) => (
    <div className={"baloonLocationJob"} onClick={props.onClick}>
        <p className={"title"}>{strings.stringsJobs.LBL_JOB_LOCATION}</p>
        <p className={"address"}>{props.address}</p>
    </div>
);

export default BaloonLocationJob;
import * as css from './JobItemOverlay.css';
import {Col, Row} from "react-flexbox-grid";
import * as strings from '../../../utils/Strings';
import moment from 'moment';
import {Link} from "react-router-dom";
import * as Constants from "../../../utils/Constants";
import archiveJob from "../../../assets/img/archive_job.svg"


import React from 'react';

const JobItemOverlay = (props) => (
    <div className={"jobItemOverlayContainer"}>
        <div className={"header"}>
            {props.hoc && props.hoc.status !== Constants.JOBS_ARCHIVED &&
                <div className={"buttonsContainer"}>
                    <button onClick={props.onArchiveOpen}>
                        <img src={archiveJob} />
                    </button>
                </div>
            }

        </div>
        <div className={"body"}>
            <Row className={"subbody"}>
                <Col xs={6}>
                    <div className={"lblField"}>{strings.stringsJobs.LBL_ROLE}</div>
                    <div className={"fieldRole"}>{props.hoc.jobRole.name}</div>
                </Col>
                <Col xs={6}>
                    <div className={"lblField"}>{strings.stringsJobs.LBL_LENGTH}</div>
                    <div className={"field"}>
                        {moment(props.hoc.startDate).format('DD/MM/YY')}
                        <i className="material-icons middle-vertical-align">arrow_right_alt</i>
                        {moment(props.hoc.endDate).format('DD/MM/YY')}
                    </div>
                </Col>
            </Row>
            <Row className={"subbody"}>
                <Col xs={12}>
                    <div className={"fieldRoleDescr"}>{props.hoc.description}</div>
                </Col>
            </Row>
            <Row className={"subbody"}>
                <Col xs={4}>
                    <div className={"lblField"}>{strings.stringsJobs.LBL_POSITIONS}</div>
                    <div className={"field"}>{props.hoc.requiredEmployees}</div>
                </Col>
                <Col xs={8}>
                    <div className={"lblField"}>{strings.stringsJobs.LBL_JOB_LOCATION}</div>
                    <div className={"field"}>{props.hoc.address}</div>
                </Col>
            </Row>
        </div>
    </div>
);

export default JobItemOverlay;
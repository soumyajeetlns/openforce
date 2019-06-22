import React, {Component} from 'react';
import * as css from './JobItem.css';
import {Col, Row} from "react-flexbox-grid";
import * as strings from '../../../utils/Strings';
import moment from 'moment';
import {Link} from "react-router-dom";
import * as Constants from "../../../utils/Constants";

class JobItem extends Component {
    constructor(args) {
        super(args);
        this.state = {}
    }

    goToMap = () =>{
        this.props.history.push({
            pathname: Constants.JOB_MAP + "/" + this.props.hoc.id,
            state: this.props.hoc
        })
    }

    goToEdit = (e) =>{
        e.preventDefault();
        e.stopPropagation();
        this.props.onEdit();
    }

    openjob = () =>{
        if(this.props.hoc.status == 'active')
        {
            return <div className={"bg"}><span className={"recruiting"}>{strings.stringsJobs.LBL_JOB_OPEN}</span></div>;
        }
        else if(this.props.hoc.status == 'draft')
        {
            return <div className={"bgclose"}><span className={"recruiting"}>{strings.stringsJobs.LBL_JOB_DRAFT}</span></div>;
        }
        else
        {
            return <div className={"bgclose"}><span className={"recruiting"}>{strings.stringsJobs.LBL_JOB_CLOSED}</span></div>;
        }
    }

    render() {
        return (
            <Col xs={12} lg={3} className={"jobItemContainer"} onClick={this.goToMap}>
                <div className={"header"}>
                    { this.openjob() }
                    <button className={"btnEdit"} onClick={this.goToEdit}>
                        {/* <i className="material-icons">more_horiz</i> */}
                        <i className="material-icons">edit</i>
                    </button>
                </div>
                <div className={"body"}>
                    <div className={"lblField"}>{strings.stringsJobs.LBL_ROLE}</div>
                    <div className={"fieldRole"}>{this.props.hoc.jobRole.name}</div>
                    <Row className={"subbody"}>
                        <Col xs={4}>
                            <div className={"lblField"}>{strings.stringsJobs.LBL_POSITIONS}</div>
                            <div className={"field"}>{this.props.hoc.requiredEmployees}</div>
                        </Col>
                        <Col xs={8}>
                            <div className={"lblField"}>{strings.stringsJobs.LBL_LENGTH}</div>
                            <div className={"field"}>
                                {moment(this.props.hoc.startDate).format('DD/MM/YY')}
                                <i className="material-icons middle-vertical-align">arrow_right_alt</i>
                                {moment(this.props.hoc.endDate).format('DD/MM/YY')}
                            </div>
                        </Col>
                    </Row>
                    <Row className={"subbody"}>
                        <Col xs={12}>
                            <div className={"lblField"}>{strings.stringsJobs.LBL_JOB_LOCATION}</div>
                            <div className={"field"}>{this.props.hoc.address}</div>
                        </Col>
                    </Row>
                </div>
            </Col>


        )
    }
}

export default JobItem;
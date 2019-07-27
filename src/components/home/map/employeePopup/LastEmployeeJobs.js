import * as css from './EmployeePopup.css';
import React from 'react';
import Wrapper from "../../../wrapper/Wrapper";
import {Col, Row} from "react-flexbox-grid";
import moment from "moment/moment";

const LastEmployeeJobs = (props) => (
    <div className={"employeeLastJobsWrapper"}>
        {props.jobs && props.jobs.map((lastJob)=>
            <div className={"lastJob"}>
                <Row>
                    <Col xs={1}>
                        <div className={"graphLastJob"}/>
                    </Col>
                    <Col xs={11} className={"lastJobBody"}>
                        <span className={"circle"}>
                            <div className={"subCircle"}/>
                        </span>

                        <div className={"addressJob"}>
                            {lastJob.address}
                        </div>
                        <div  className={"dateJob"}>
                            {moment(lastJob.startDate).format('Do MMMM YYYY') + " - " + moment(lastJob.endDate).format('Do MMMM YYYY')}
                        </div>
                    </Col>
                </Row>


            </div>
        )}
    </div>
)

export default LastEmployeeJobs;

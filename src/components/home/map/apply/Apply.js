import * as css from './Apply.css';
import {Col, Row} from "react-flexbox-grid";
import moment from 'moment';
import StarRatings from 'react-star-ratings';


import React from 'react';

const Apply = (props) => (
    <div className={"applyContainer"} onClick={props.apply.status === "applied"?props.onOpenEmployeePopup:props.onOpenHiredEmployeePopup}>
        <Row>
            <Col xs={2}>
                <img src={props.apply.user?props.apply.user.profileImg:null}/>
            </Col>
            <Col xs={10}>
                <div className={"infosContainer"}>
                    <div>
                        <span className={"bold"}>
                            {props.apply.user.firstName + " " + props.apply.user.lastName}
                        </span>
                        <span className={"applyDate"}>
                            {props.apply.applicationDate}
                        </span>
                    </div>
                    <div>
                        <span className={"bold"}>
                            <StarRatings
                                 rating={props.apply.user.rating}
                                 starRatedColor="black"
                                 numberOfStars={5}
                                 starDimension="10px"
                                 starSpacing="2px"
                                 name='rating'/>
                            {" " + props.apply.user.rating}
                        </span>
                        <span className={"applyPrice"}>
                            {"asdasfdsa"}
                        </span>
                    </div>
                </div>
            </Col>
        </Row>

    </div>
);

export default Apply;
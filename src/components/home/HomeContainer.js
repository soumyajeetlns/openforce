import React, {Component} from 'react';
import {Col, Row} from "react-flexbox-grid";
import * as css from './HomeContainer.css';
import * as strings from "../../utils/Strings";
import * as constants from "../../utils/Constants";
import {Link} from "react-router-dom";
import HeaderProfile from "./HeaderProfile";
import logo from '../../assets/img/logo.svg';
import Wrapper from "../wrapper/Wrapper";

class HomeContainer extends Component {
    constructor(args) {
        super(args);
        this.state = {

        }
    }
    render() {
        return (
            <div className={"wrapperHomeContainer"}>
                <Row className={this.props.selectedTab === "fakeSection"?"blur":null}>
                    <Col xs={12} className={"header"}>
                        {
                            this.props.selectedTab !== "fakeSection" &&
                            <Wrapper>
                                <div className={"logo"}>
                                    <img src={logo}/>
                                </div>

                                <div className={"sections"}>
                                    <Link to={constants.JOBS + "/" + constants.JOBS_ACTIVE}>
                                        <div className={constants.JOBS_ACTIVE === this.props.selectedTab?"section active":"section"}>
                                            {strings.stringsHomeContainer.LBL_OPEN}
                                        </div>
                                    </Link>
                                    <Link to={constants.JOBS + "/" + constants.JOBS_DRAFT}>
                                        <div className={constants.JOBS_DRAFT === this.props.selectedTab?"section active":"section"}>
                                            {strings.stringsHomeContainer.LBL_DRAFT}
                                        </div>
                                    </Link>
                                    <Link to={constants.JOBS + "/" + constants.JOBS_ARCHIVED}>
                                        <div className={constants.JOBS_ARCHIVED === this.props.selectedTab?"section active":"section"}>
                                            {strings.stringsHomeContainer.LBL_CLOSED}
                                        </div>
                                    </Link>
                                </div>

                                <div className={"profile"}>
                                    <HeaderProfile/>
                                </div>

                                {
                                    this.props.selectedTab.toLowerCase() !== "archive"?
                                        <button className={"btnAddJob hidden-xs"} onClick={this.props.onJobAdd}>
                                            <i className="material-icons">add</i>
                                        </button>
                                        :null
                                }
                            </Wrapper>
                        }


                    </Col>
                </Row>
                <Row>
                    <Col xs={12}>
                        {this.props.children}
                    </Col>
                    {
                        this.props.selectedTab.toLowerCase() !== "archive"?
                            <button className={"btnAddJob hidden-lg"} onClick={this.props.onJobAdd}>
                                <i className="material-icons">add</i>
                            </button>
                            :null
                    }
                </Row>
            </div>
        )
    }
}

export default HomeContainer;
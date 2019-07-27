import React, {Component} from 'react';
import * as css from './LoginContainer.css';
import {Row, Col} from "react-flexbox-grid";
import Wrapper from "../wrapper/Wrapper";
import * as utils from "../../utils/Utils";
import mapBackground from '../../assets/img/login_map_bg_new.jpg';
import logo from '../../assets/img/logo.svg'
import * as strings from "../../utils/Strings";
import * as constants from "../../utils/Constants";

class LoginContainer extends Component {
    constructor(args) {
        super(args);
        this.state = {}
    }

    render() {
        return (
            <Row className={"wrapperLoginContainer"} style={{backgroundImage: `url(${mapBackground})`, height: "100%"}}>
                <div className={"logo"}>
                    <img src={logo}/>
                </div>
                <div className={"cardLoginOut"} style={{backgroundImage: `url(${mapBackground})`}}>
                    <div className={"cardLogin"}>
                        {this.props.onBackButton}
                    {
                        this.props.onBackButton ?
                            <div className={"wrapperBackArrow"} onClick={this.props.onBackButton}>
                                <div className={"backArrow"}>
                                    <i className="material-icons">
                                        arrow_back
                                    </i>
                                </div>
                            </div>
                            :
                            null
                    }
                    <div className={"componentContainer"}> {this.state.animationComponent && this.state.animationComponent.component?
                                                            this.state.animationComponent.component:
                                                            this.props.children} 
                    </div>
                </div>
                </div>
                <Col xs={4} className={"leftColumn leftcol desktop_view"}>
                    {/* <div className={"termsOfConditions"}>
                        <p>{strings.stringsSignup.LBL_TERMS_OF_CONDITIONS_1}</p>
                        <br/>
                        <a href={"mailto:"+constants.EMAIL_ISSUE}>
                            <p className={"underline"}>{strings.stringsSignup.LBL_TERMS_OF_CONDITIONS_2}</p>
                        </a>
                        <br/>
                        <p>{strings.stringsSignup.LBL_TERMS_OF_CONDITIONS_3}</p>
                        <br/>
                        <a href={"/assets/privacy_of.pdf"} target={"_blank"}>
                            <p className={"underline"}>{strings.stringsSignup.LBL_TERMS_OF_CONDITIONS_4}</p>
                        </a>
                    </div> */}
                </Col>
                <Col xs={8} className={"rightColumn rightcol"} style={{paddingLeft: 0, paddingRight: 0}}>
                    <img src={mapBackground} style={{width: "100%", height: "", objectFit: "cover", visibility: "hidden"}} />
                </Col>
                <br clear="all"/>
                <Col xs={4} className={"leftColumn leftcol"}>
                    <div className={"termsOfConditions"}>
                        <p>{strings.stringsSignup.LBL_TERMS_OF_CONDITIONS_1}</p>
                        <br/>
                        <a href={"mailto:"+constants.EMAIL_ISSUE}>
                            <p className={"underline"}>{strings.stringsSignup.LBL_TERMS_OF_CONDITIONS_2}</p>
                        </a>
                        <br/>
                        <p>{strings.stringsSignup.LBL_TERMS_OF_CONDITIONS_3}</p>
                        <br/>
                        <a href={"/assets/privacy_of.pdf"} target={"_blank"}>
                            <p className={"underline"}>{strings.stringsSignup.LBL_TERMS_OF_CONDITIONS_4}</p>
                        </a>
                    </div>
                </Col>

            </Row>
        )
    }
}

export default LoginContainer;
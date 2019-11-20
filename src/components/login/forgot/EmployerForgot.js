import React, {Component} from 'react';
import * as strings from "../../../utils/Strings";
import * as constants from "../../../utils/Constants";
import LoginContainer from "../LoginContainer";
import {Col, Row} from "react-flexbox-grid";
import Input from "../../input/Input";
import AsyncButton from "../../asyncButton/AsyncButton";
import css from './EmployerForgot.css'
import * as utils from "../../../utils/Utils";
import * as authFunction from "../../../functions/Auth";

class EmployerForgot extends Component {
    constructor(args) {
        super(args);
        this.state = {
            errors:{},
            email:null,
            loading:false,
            successMessage:null
        }
    }

    submitForgot = () =>{
        const tempState = utils.deepCopy(this.state);
        tempState.successMessage = null;

        if(utils.isBlank(tempState.email)){
            tempState.errors.message = strings.stringsForgot.errors.ERROR_EMAIL;
            this.setState(tempState)
        }else{
            tempState.errors.message = null;
            tempState.loading = true;
            this.setState(tempState,()=>{
                authFunction.forgotPassword(tempState.email,()=>{
                    tempState.loading = false;
                    tempState.successMessage = strings.stringsForgot.MESSAGE_SUCCESS_FORGOT;
                    this.setState(tempState);
                },(error)=>{
                    tempState.loading = false;
                    tempState.errors.message = error.message
                    this.setState(tempState);
                });
            })
        }
    }

    onInputChange = (e) =>{
        const tempState = utils.deepCopy(this.state);
        tempState.email = e.target.value;
        this.setState(tempState)
    }

    render() {
        return (
            <LoginContainer onBackButton={()=> this.props.history.push(constants.SIGNIN_EMPLOYER)}>
                <div className={"wrapperSignin"}>
                    <Row>
                        <Col xs={8} className={"title"}>
                            {strings.stringsForgot.LBL_TITLE}
                        </Col>
                    </Row>

                    <Row>
                        <Col xs={12} style={{marginTop:"40px"}}>
                            <Input type={"text"}
                                   onChange={this.onInputChange}
                                   name={"email"}
                                   error={this.state.errors.email}
                                   label={strings.stringsSignin.LBL_EMAIL}
                                   value={this.state.email}
                                   placeholder={strings.stringsForgot.PLACEHOLDER_EMAIL}/>
                        </Col>

                        <Col xs={12} style={{marginTop:"20px"}}>
                            {
                                this.state.successMessage?
                                    <p className={"statusMessage globalSuccessMessage"}>{this.state.successMessage}</p>
                                :
                                    <p className={"globalErrorMessage"}>
                                        {this.state.errors.message}
                                    </p>
                            }

                        </Col>
                    </Row>

                    <Row className={"wrapperButtons"}>
                        <Col xs={12} style={{textAlign:"center"}}>
                            <AsyncButton
                                className={"btnSubmit"}
                                loading={this.state.loading}
                                textButton={strings.stringsSignin.BTN_SUBMIT}
                                onClick={this.submitForgot}/>
                        </Col>
                    </Row>
                </div>
            </LoginContainer>
        )
    }
}

export default EmployerForgot;
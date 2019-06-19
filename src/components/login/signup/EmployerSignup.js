import React, {Component} from 'react';
import LoginContainer from "../LoginContainer";
import * as strings from '../../../utils/Strings';
import * as css from './EmployerSignup.css';
import Input from "../../input/Input";
import { slideInLeft} from 'react-animations'
import * as utils from "../../../utils/Utils";
import AnimationComponent from "../../../utils/hoc/animationComponent/AnimationComponent";
import Wrapper from "../../wrapper/Wrapper";
import {Col, Row} from "react-flexbox-grid";
import * as authFunctions from "../../../functions/Auth";
import AsyncButton from "../../asyncButton/AsyncButton";
import * as errorsFirebase from "../../../utils/FirebaseErrors";
import * as constants from "../../../utils/Constants";

class EmployerSignup extends Component {
    constructor(args) {
        super(args);
        this.state = {
            companyName:undefined,
            email:undefined,
            psw1:undefined,
            psw2:undefined,
            checkbox:false,
            loading:false,
            step:1,
            onBackButton:null,
            errors:{
                companyName:false,
                email:false,
                password:false,
                checkbox:false,
            },
            successMessage:null
        }
    }

    submitStepOne = () =>{
        if(this.checkErrorsStepOne()){
            const tempState = utils.deepCopy(this.state);
            tempState.step = 2;
            tempState.onBackButton = this.onBackButton;
            this.setState(tempState);
        }
    }

    submitStepTwo = () =>{
        if(this.checkErrorStepTwo()){
            const tempState = utils.deepCopy(this.state);
            tempState.loading = true;
            this.setState(tempState,()=>{
                const employer = {};
                employer.email = tempState.email;
                employer.companies = [tempState.companyName];
                employer.type = constants.CLUSTER_EMPLOYER;
                authFunctions.createEmployerUser(tempState.email, tempState.psw1, employer, this.successSignup, this.errorSignup);
            });
        }
    }

    successSignup = () =>{
        const tempState = JSON.parse(JSON.stringify(this.state));
        tempState.loading = false;
        tempState.successMessage = strings.stringsSignup.MESSAGE_SUCCESS_SIGNUP;
        tempState.step = 3;
        tempState.onBackButton = null;
        this.setState(tempState);
    }

    errorSignup = (error) =>{
        const tempState = JSON.parse(JSON.stringify(this.state));
        tempState.loading = false;

        switch(error.code){
            case errorsFirebase.LOGIN_BAD_FORMAT_EMAIL:
                tempState.errors.message = strings.stringsSignup.errors.ERROR_EMAIL;
                break;
            case errorsFirebase.LOGIN_INVALID_PASSWORD:
                tempState.errors.message = strings.stringsSignup.errors.ERROR_PASSWORD;
                break
            case errorsFirebase.CHANGE_PASSWORD_WEAK:
                tempState.errors.message = strings.stringsSignup.errors.ERROR_PASSWORD;
                break
            default:
                tempState.errors.message = error.message;
                break;
        }
        this.setState(tempState);
    }

    checkErrorsStepOne = () =>{
        const tempState = utils.deepCopy(this.state);
        if(!tempState.companyName || tempState.companyName.trim() === ""){
            tempState.errors.companyName = true;
            this.setState(tempState);
            return false;
        }

        return true;
    }

    checkErrorStepTwo = () =>{
        const tempState = utils.deepCopy(this.state);
        let check = true;
        for(let propertyName in tempState.errors) {
            tempState.errors[propertyName] = false;
        }
        tempState.errors.message = null;

        if(!tempState.email || tempState.email.trim() === "" || !utils.validateEmail(tempState.email)){
            tempState.errors.email = true;
            tempState.errors.message = strings.stringsSignup.errors.ERROR_EMAIL;
            check = false;
        }else if(!tempState.psw1 || tempState.psw1.trim() === "" || tempState.psw1.length < 6){
            tempState.errors.password = true;
            tempState.errors.message = strings.stringsSignup.errors.ERROR_PASSWORD;
            check = false;
        }else if(tempState.psw1 !== tempState.psw2){
            tempState.errors.password = true;
            tempState.errors.message = strings.stringsSignup.errors.ERROR_PASSWORD_MATCH;
            check = false;
        }else if(!tempState.checkbox){
            tempState.errors.checkbox = true;
            tempState.errors.message = strings.stringsSignup.errors.ERROR_CHECKBOX;
            check = false;
        }

        this.setState(tempState);
        return check;
    }

    onBackButton = () =>{
        const tempState = utils.deepCopy(this.state);
        tempState.step = 1;
        tempState.onBackButton = this.goToSignin;
        this.setState(tempState);
    }

    goToSignin = () =>{
        this.props.history.push(constants.SIGNIN_EMPLOYER);
    }

    componentDidMount = () =>{
        const tempState = utils.deepCopy(this.state);
        tempState.onBackButton = this.goToSignin;
        this.setState(tempState);
    }

    onInputChange = (e) =>{
        const tempState = utils.deepCopy(this.state);
        tempState[e.target.name] = e.target.value;
        tempState.errors[e.target.name] = false;
        this.setState(tempState);
    }

    onCheckboxChange = (e) =>{
        const tempState = utils.deepCopy(this.state);
        tempState.checkbox = e.target.checked;
        this.setState(tempState);
    }

    render() {
        return (
            <LoginContainer onBackButton={this.state.onBackButton}>
                {
                    this.state.step === 1?
                    <Wrapper>
                        <div className={"withPadding wrapperSignup"}>
                            <p className={"title"}>{strings.stringsSignup.TITLE_STEP_1}</p>

                            <Input
                                onChange={this.onInputChange}
                                name={"companyName"}
                                key={1}
                                error={this.state.errors.companyName}
                                label={strings.stringsSignup.LBL_COMPANY_NAME}
                                value={this.state.companyName}
                                placeholder={strings.stringsSignup.PLACEHOLDER_STEP_1}/>
                        </div>

                        <div className={"wrapperSignup"}>
                            <div className={"separatorStep1"}/>
                            <center>
                                <button className={"btnSubmitStepOne"} onClick={this.submitStepOne}>
                                    {strings.stringsSignup.BTN_STEP_1}
                                </button>
                            </center>
                        </div>
                    </Wrapper>

                    : this.state.step === 2?

                    <Wrapper>
                        <div className={"withPadding wrapperSignup"}>
                            <p className={"title"}>{strings.stringsSignup.TITLE_STEP_2}</p>
                            <Input
                                key={2}
                                onChange={this.onInputChange}
                                name={"email"}
                                error={this.state.errors.email}
                                label={strings.stringsSignup.LBL_EMAIL}
                                value={this.state.email}
                                placeholder={strings.stringsSignup.PLACEHOLDER_EMAIL_STEP_2}/>
                        </div>
                        <div className={"wrapperSignup"}>
                            <div className={"separatorStep2"}/>
                        </div>
                        <div className={"wrapperSignup withPadding"}>
                            <Input
                                label={strings.stringsSignup.LBL_PASSWORD_1}
                                type={"password"}
                                onChange={this.onInputChange}
                                name={"psw1"}
                                style={{marginTop:"-30px"}}
                                error={this.state.errors.password}
                                placeholder={strings.stringsSignup.LBL_PASSWORD}/>

                            <Input
                                label={strings.stringsSignup.LBL_PASSWORD_2}
                                type={"password"}
                                onChange={this.onInputChange}
                                name={"psw2"}
                                style={{marginTop:"20px"}}
                                error={this.state.errors.password}
                                placeholder={strings.stringsSignup.LBL_PASSWORD}/>

                            <Row className={"wrapperCheckbox"}>
                                <Col xs={1}>
                                    <Input type={"checkbox"}
                                           onChange={this.onCheckboxChange}
                                           error={this.state.errors.checkbox}/>
                                </Col>
                                <Col xs={11} className={"lblCheckbox"} checked={this.state.checkbox}>{strings.stringsSignup.LBL_CHECKBOX_STEP_2}</Col>
                            </Row>

                            {
                                this.state.successMessage?
                                    <p className={"statusMessage globalSuccessMessage"}>{this.state.successMessage}</p>
                                    :
                                    <p className={"statusMessage globalErrorMessage"}>{this.state.errors.message}</p>
                            }

                            <div className={"wrapperButtons"}>
                                <AsyncButton
                                    className={"btnSubmitStepTwo"}
                                    loading={this.state.loading}
                                    textButton={strings.stringsSignup.BTN_CONTINUE}
                                    onClick={this.submitStepTwo}/>


                            </div>
                        </div>
                    </Wrapper>

                    :

                    <Wrapper>
                        <div className={"wrapperSignup withPadding"}>
                            <p className={"statusMessage globalSuccessMessage"}>{this.state.successMessage}</p>
                        </div>
                        <div className={"wrapperSignup"}>
                            <div className={"separatorStep1"}/>
                        </div>
                        <div className={"wrapperSignup wrapperButtons"}>
                            <center>
                                <button className={"btnSubmitStepTwo"} onClick={()=>this.props.history.push(constants.SIGNIN_EMPLOYER)} style={{marginBottom:"40px",marginTop:"30px"}}>
                                    {strings.stringsSignup.BTN_SIGN_IN}
                                </button>
                            </center>
                        </div>
                    </Wrapper>
                }


            </LoginContainer>
        )
    }
}

export default EmployerSignup;
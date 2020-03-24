import React, {Component} from 'react';
import LoginContainer from "../LoginContainer";
import * as strings from '../../../utils/Strings';
import * as css from './EmployerSignin.css';
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
import {Link} from "react-router-dom";
import * as employerFunctions from "../../../functions/EmployerFunctions";
import EmployerUser from "../../../utils/hoc/employerUser/EmployerUser";
import {connect} from "react-redux";

class EmployerSignin extends Component {
    constructor(args) {
        super(args);
        this.state = {
            email:null,
            loading:false,
            password:null,
            errors:{
                email:null,
                password:null,
                message:null
            }
        }
    }

    componentDidMount = () =>{
        //const asd = null;
        //asd.asd = "ciao";
    }

    onInputChange = (e) =>{
        const tempState = utils.deepCopy(this.state);
        tempState[e.target.name] = e.target.value;
        tempState.errors[e.target.name] = false;
        this.setState(tempState);
    }

    loginSuccess = (user) => {
        employerFunctions.getEmployer(user.user.uid,(employer)=>{
            const tempState = utils.deepCopy(this.state)
            tempState.loading = false;
            this.setState(tempState);

            const adminUser =  EmployerUser.getInstance(employer);
            this.props.onUserEmployeeLoggedIn(adminUser);
            this.props.history.push(constants.HOME);
        });
    }

    loginError = (error) =>{
        const tempState = utils.deepCopy(this.state);

        switch(error.code){
            case errorsFirebase.LOGIN_BAD_FORMAT_EMAIL:
                tempState.errors.message = strings.stringsSignin.errors.ERROR_EMAIL;
                break;
            case errorsFirebase.LOGIN_INVALID_PASSWORD:
                tempState.errors.message = strings.stringsSignin.errors.ERROR_PASSWORD;
                break;
            case errorsFirebase.LOGIN_USER_UNCONFIRMED:
                tempState.errors.message = strings.stringsSignin.errors.USER_NOT_VERIFIED;
                break;
            case errorsFirebase.LOGIN_USER_NOT_FOUND:
                tempState.errors.message = strings.stringsSignin.errors.USER_NOT_FOUND;
                break;
            default:
                tempState.errors.message = strings.stringsSignin.errors.ERROR_PASSWORD;
                break;
        }

        tempState.loading = false;
        this.setState(tempState);
    }

    loginHandler = () =>{
        const tempState = utils.deepCopy(this.state);
        const email = tempState.email;
        const password = tempState.password;

        if(utils.isBlank(email)){
            this.loginError({message:strings.stringsSignup.errors.ERROR_EMAIL});
        }else{
            const tempState = utils.deepCopy(this.state);
            tempState.loading = true;
            tempState.errors.message = null;
            this.setState(tempState);
            authFunctions.loginEmployerUser(email,password,this.loginSuccess, this.loginError);
        }
    };

    render() {
        return (
            <LoginContainer>
                <div className={"wrapperSignin"}>
                    <Row>
                        <Col xs={8} className={"title"}>
                            {strings.stringsSignin.LBL_TITLE}
                        </Col>
                        <Col xs={4} className={"wrapperLblSignup"}>
                            <Row>
                                <Col xs={12} className={"lblSignup"}>
                                    {strings.stringsSignin.LBL_SIGNUP}
                                </Col>
                                <Col xs={12}>
                                    <Link to={constants.SIGNUP_EMPLOYER}>
                                        {strings.stringsSignin.LBL_SIGNUP_2}
                                    </Link>
                                </Col>
                            </Row>
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
                                   placeholder={strings.stringsSignin.PLACEHOLDER_EMAIL}/>
                        </Col>
                        <Col xs={12} style={{marginTop:"30px"}}>
                            <Input type={"password"}
                                   onChange={this.onInputChange}
                                   name={"password"}
                                   error={this.state.errors.password}
                                   label={strings.stringsSignin.LBL_PASSWORD}
                                   placeholder={strings.stringsSignin.PLACEHOLDER_PASSWORD}/>
                        </Col>

                        <Col xs={12} style={{marginTop:"20px"}}>
                            <p className={"globalErrorMessage"}>
                                {this.state.errors.message}
                            </p>
                        </Col>
                    </Row>

                    <Row className={"wrapperButtons"}>
                        <Col xs={6} style={{textAlign:"right"}}>
                            <button className={"btnForgot"} onClick={()=>this.props.history.push(constants.FORGOT_EMPLOYER)}>{strings.stringsSignin.BTN_FORGOT}</button>
                        </Col>

                        <Col xs={6} style={{textAlign:"left"}}>
                            <AsyncButton
                                className={"btnSubmit"}
                                loading={this.state.loading}
                                textButton={strings.stringsSignin.BTN_SUBMIT}
                                onClick={this.loginHandler}/>
                        </Col>
                    </Row>
                </div>
            </LoginContainer>
        )
    }
}

const mapStateToProps = state =>{
    return {
        ctr: state
    }
}
const mapDispatchToProps = dispatch =>{
    return {
        onUserEmployeeLoggedIn : (user) => {
            dispatch({type: constants.REDUX_PUT_USER_EMPLOYER_STATE,payload:user})
        }
    }
}
export default connect(mapStateToProps,mapDispatchToProps)(EmployerSignin);
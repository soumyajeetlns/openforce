import React, {Component} from 'react';
import {Col, Row} from "react-flexbox-grid";
import {Link} from "react-router-dom";
import * as css from './ProfileEmployer.css';
import {connect} from "react-redux";
import * as utils from "../../../utils/Utils";
import * as constants from "../../../utils/Constants";
import goBackIcon from '../../../assets/img/goBackIcon.svg';
import * as strings from "../../../utils/Strings";

import addressIcon from '../../../assets/img/addressIcon.svg';
import detailIcon from '../../../assets/img/detailsIcon.svg';
import settingsIcon from '../../../assets/img/settingsIcon.svg';
import Input from "../../input/Input";
import * as employerFunctions from "../../../functions/EmployerFunctions";
import {getImageUrlWithDimension, uploadImage} from "../../../utils/ImageUtils";
import AsyncButton from "../../asyncButton/AsyncButton";
import * as jobsFunctions from "../../../functions/JobsFunctions";
import Wrapper from "../../wrapper/Wrapper";
import * as authFunctions from "../../../functions/Auth";

class ProfileEmployer extends Component {
    constructor(args) {
        super(args);
        this.refDetail = React.createRef();
        this.refAddress = React.createRef();
        this.refSettings = React.createRef();
        this.state = {
            companyNameProfile:null,
            employer:{},
            fileImage:null,
            previewImage:null,
            loadingUpdate:false,
            loadingChangingPassword:false,
            old_password:null,
            password_1:null,
            password_2:null,
            companyType:null,
            businessname:null,
        }

        let fileImage;
    }

    componentDidMount = () =>{
        if(this.props.ctr.user && this.props.ctr.user.companies[0]){
            const tempState = utils.deepCopy(this.state);
            tempState.companyNameProfile = utils.getCompanyNameFormatted(this.props.ctr.user.companies[0]);
            tempState.employer = this.props.ctr.user;
            //todo:update redux:
            this.setState(tempState);
        }
    }

    scrollToSection = (section) =>{
        let refTemp;
        if(section === "detail"){
            refTemp = this.refDetail;
        }
        if(section === "address"){
            refTemp = this.refAddress;
        }
        if(section === "settings"){
            refTemp = this.refSettings;
        }
        window.scrollTo({
            top:refTemp.current.offsetTop,
            behavior: "smooth"
        })
    }

    onTextChange = (field, value) =>{
        const tempState = utils.deepCopy(this.state);
        tempState.employer[field] = value.target.value;
        this.setState(tempState)
    }

    onPasswordChange = (field, value) =>{
        const tempState = utils.deepCopy(this.state);
        tempState[field] = value.target.value;
        this.setState(tempState)
    }

    saveEmployer = () =>{
        const tempState = utils.deepCopy(this.state);
        tempState.loadingUpdate = true;

        this.setState(tempState,()=>{
            const publicId = tempState.employer.uid + "_" + utils.generateID();
            const file = this.fileImage;
            if(file){
                uploadImage(file, publicId, (response) => {
                    console.log("Response: " + JSON.stringify(response));
                    tempState.employer.publicID = response.public_id;
                    tempState.employer.profileImage = response.url;

                    employerFunctions.updateEmployer(tempState.employer,()=>{
                        tempState.loadingUpdate = false;
                        this.props.onUserEmployeeUpdated(tempState.employer);
                        utils.showSuccess(strings.stringsProfileEmployer.LBL_SUCCESS_UPDATE);
                        this.setState(tempState)
                    },(error)=>{
                        console.log("Error", JSON.stringify(error));
                        tempState.loadingUpdate = false;
                        utils.showError(strings.stringsProfileEmployer.LBL_ERROR_UPDATE);
                        this.setState(tempState)
                    });
                }, null);
            }else{
                tempState.loadingUpdate = false;
                this.setState(tempState,()=>{
                    employerFunctions.updateEmployer(tempState.employer,()=>{
                        tempState.loadingUpdate = false;
                        this.props.onUserEmployeeUpdated(tempState.employer);
                        utils.showSuccess(strings.stringsProfileEmployer.LBL_SUCCESS_UPDATE);
                        this.setState(tempState)
                    },(error)=>{
                        console.log("Error", JSON.stringify(error));
                        tempState.loadingUpdate = false;
                        utils.showError(strings.stringsProfileEmployer.LBL_ERROR_UPDATE);
                        this.setState(tempState)
                    });
                });
            }
        })
    }

    selectImage = () => {
        this.inputImageRef.click();
    };

    changeImage = (file) => {
        if(file && file.target.files.length>0){
            const tempState = utils.deepCopy(this.state);
            this.fileImage = file.target.files[0];
            const reader = new FileReader();

            reader.onload = (e)=> {
                tempState.previewImage = e.target.result;
                this.setState(tempState);
            }
            reader.readAsDataURL(file.target.files[0]);
        }
    };

    getImage = () =>{
        let img = null;
        const tempState = utils.deepCopy(this.state)
        if(this.state.previewImage){
            img = this.state.previewImage;
        }else{
            img = getImageUrlWithDimension(tempState.employer.publicID, 120, 120, 120); ;

        }
        return img;
    }

    clearPasswords = (tempState) =>{
        tempState.old_password = null;
        tempState.password_1 = null;
        tempState.password_2 = null;
    }

    changePassword = () =>{
        const tempState = utils.deepCopy(this.state);
        const symbols = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/;

        if(tempState.old_password){
            if(tempState.password_1 === tempState.password_2 && tempState.password_1){

                let count = 0;
                for(let i=0;i<tempState.password_1.length;i++){
                    if(symbols.test(tempState.password_1[i]))count++;
                }

                if(tempState.password_1.trim().length>7 && count>=2){

                    tempState.loadingChangingPassword = true;
                    this.setState(tempState,()=>{
                        employerFunctions.changePassword(tempState.old_password, tempState.password_1, ()=>{
                            utils.showSuccess(strings.stringsProfileEmployer.LBL_SUCCESS_CHANGE_PASSWORD)
                            tempState.loadingChangingPassword = false;
                            this.clearPasswords(tempState);
                            this.setState(tempState)
                        }, (error)=>{
                            utils.showError(error.message)
                            tempState.loadingChangingPassword = false;
                            this.clearPasswords(tempState);
                            this.setState(tempState)
                        })
                    })
                }else{
                    utils.showError(strings.stringsProfileEmployer.LBL_ERROR_PASSWORDS_NO_VALID)
                }
            }else{
                utils.showError(strings.stringsProfileEmployer.LBL_ERROR_PASSWORDS_MISMATCH)
            }
        }else{
            utils.showError(strings.stringsProfileEmployer.LBL_ERROR_WRONG_PASSWORD)
        }

    }

    logout = () =>{
        authFunctions.logoutEmployerUser();
    }

    render() {
        return (
            <div className={"wrapperProfileEmployer"}>
                <div className={"backButton"} onClick={()=>this.props.history.push(constants.HOME)}>
                    <img src={goBackIcon}/>
                </div>
                {this.props.ctr.user.companyType === "Sole Trader"?
                    <Row style={{marginLeft:"50px"}}>
                        <Col xs={12}>
                            <Row>
                                <Col xs={3} className={"customCol"}>
                                    <div className={"titleColumn  leftuptitle mobileHide"}>
                                        { this.props.ctr.user && this.props.ctr.user && this.props.ctr.user.companies ? this.props.ctr.user.companies[0]:null}
                                    </div>
                                </Col>
                                <Col xs={5} className={"customCol"}>
                                    <div className={"titleColumn myTitleStyle"} style={{marginLeft: "30px"}}>
                                        {strings.stringsProfileEmployer.LBL_COLUMN_TRADING_DETAILS}
                                        {/* <AsyncButton loading={this.state.loadingUpdate} className={"btnUpdate"} onClick={this.saveEmployer} textButton={strings.stringsProfileEmployer.BTN_UPDATE}/> */}
                                    </div>
                                </Col>
                            </Row>
                            <Row className={"defaultMarginTop"}>
                                <Col xs={3}>
                                    <span onClick={this.selectImage}>
                                        <input onChange={this.changeImage} type="file" accept="image/*" style={{display: 'none'}} ref={input => this.inputImageRef = input}/>
                                        <center>
                                            {
                                                this.props.ctr.user && (this.props.ctr.user.profileImage || this.state.previewImage)?
                                                    <Wrapper>
                                                        <img className={"profileImg"} src={this.getImage()}/>
                                                    </Wrapper>
                                                    :
                                                    <div className={"profileImgPlaceholder"}>
                                                        {this.state.companyNameProfile}
                                                    </div>
                                            }
                                        </center>
                                    </span>

                                    <Row className={"defaultMarginTop2"}>
                                        <Col xs={12} className={"customCol leftColumn mySpaceRemove"}>
                                            {/* <div className={"item"} onClick={this.scrollToSection.bind(this,"detail")}>
                                                <img src={detailIcon}/>
                                                {strings.stringsProfileEmployer.LBL_DETAIL}
                                            </div> */}
                                            <div className={"item"} onClick={this.scrollToSection.bind(this,"address")}>
                                                <img src={addressIcon}/>
                                                {strings.stringsProfileEmployer.LBL_COLUMN_BUSINESS_DETAIL}
                                            </div>
                                            <div className={"item"} onClick={this.scrollToSection.bind(this,"settings")}>
                                                <img src={settingsIcon}/>
                                                {strings.stringsProfileEmployer.LBL_SETTINGS}
                                            </div>
                                        </Col>

                                        <Col xs={12} style={{textAlign:"center"}}>
                                            <button className={"btnLogout"} onClick={this.logout}>{strings.stringsProfileEmployer.BTN_LOGOUT}</button>
                                        </Col>
                                    </Row>
                                </Col>
                                <Col xs={7} className={"customCol bodyCustomCol defaultMarginLeft myProfileStyle"} style={{height: "423px"}}>
                                    <div className={"section"} ref={this.refDetail}>
                                        <Col lg={6} xs={12}>
                                            <p className={"sectionTitle"}>
                                                {strings.stringsProfileEmployer.LBL_REGISTER_TRADE_NAME}
                                            </p>
                                            <p className={"inputProfileEmployer"}>
                                                {this.props.ctr.user.businessname}
                                            </p>
                                        </Col>
                                        <Col lg={6} xs={12}>
                                            <p className={"sectionTitle"}>
                                                {strings.stringsProfileEmployer.LBL_COMPANY_TRADE_TYPE}
                                            </p>
                                            <p className={"inputProfileEmployer"}>
                                                {this.props.ctr.user.companyType}
                                            </p>                                    
                                        </Col>
                                        <Col lg={6} xs={12}>
                                            <p className={"sectionTitle"}>
                                                {strings.stringsProfileEmployer.LBL_COMPANY_TRADE_UTR}
                                            </p>
                                            <p className={"inputProfileEmployer"}>
                                                <input type={"text"} className={"inputProfileEmployer marginTop"}
                                                    value={this.state.employer.utrno}
                                                    onChange={this.onTextChange.bind(this,"utrno")}
                                                    placeholder={strings.stringsProfileEmployer.LBL_COMPANY_TRADE_UTR}/>
                                            </p> 
                                        </Col>
                                    </div>
                                    
                                    <div className={"section"} ref={this.refAddress}>
                                        <Col xs={12}>
                                            <Col lg={12} xs={12}>
                                                <p className={"sectionTitle"}>
                                                    {strings.stringsProfileEmployer.LBL_ADDRESS}
                                                </p>
                                                <input type={"text"} className={"inputProfileEmployer marginTop"}
                                                    value={this.state.employer.address_1}
                                                    onChange={this.onTextChange.bind(this,"address_1")}
                                                    placeholder={strings.stringsProfileEmployer.LBL_ADDRESS_1}/>
                                            </Col>
                                            <Col lg={6} xs={12}>
                                                <input type={"text"} className={"inputProfileEmployer marginTop"}
                                                    onChange={this.onTextChange.bind(this,"address_2")}
                                                    value={this.state.employer.address_2}
                                                    placeholder={strings.stringsProfileEmployer.LBL_ADDRESS_2}/>
                                            </Col>
                                            {/* <Col xs={6}>
                                                <input type={"text"} className={"inputProfileEmployer marginTop"}
                                                    onChange={this.onTextChange.bind(this,"address_3")}
                                                    value={this.state.employer.address_3}
                                                    placeholder={strings.stringsProfileEmployer.LBL_ADDRESS_3}/>
                                            </Col> */}                                            
                                            <Col lg={6} xs={12}>
                                                <input type={"text"} style={{width:"180px"}} className={"inputProfileEmployer marginTop"}
                                                    onChange={this.onTextChange.bind(this,"postCode")}
                                                    value={this.state.employer.postCode}
                                                    placeholder={strings.stringsProfileEmployer.LBL_POST_CODE}/>
                                            </Col>
                                            <Col lg={6} xs={12}>                                                
                                                <input type={"text"} className={"inputProfileEmployer"}
                                                    value={this.state.employer.companyNumber}
                                                    style={{width:"180px"}} onChange={this.onTextChange.bind(this,"companyNumber")}
                                                    placeholder={strings.stringsProfileEmployer.LBL_COMPANY_NUMBER}
                                                    />
                                            </Col>
                                        </Col>
                                    </div>
                                </Col>
                            </Row>
                            <Row className={"defaultMarginTop"}>
                            <Col xs={3} ></Col>
                                <Col xs={7} xsOffset={3} className={"customCol titleColumnProfile"}>
                                    <div className={"titleColumn"}>
                                        {strings.stringsProfileEmployer.LBL_SETTINGS}
                                    </div>
                                </Col>
                            </Row>
                            <Row className={"defaultMarginTop"}>
                                <Col xs={3}>
                                    &nbsp;
                                </Col>
                                <Col xs={7} className={"customCol bodyCustomCol defaultMarginLeft myProfileStyle"}>
                                    <div className={"section"}>
                                        <p className={"sectionTitle"}>
                                            {strings.stringsProfileEmployer.LBL_EMAIL_ADDRESS}
                                        </p>
                                        <input type={"text"}
                                            className={"inputProfileEmployer marginTop"}
                                            readOnly={true}
                                            value={this.props.ctr.user?this.props.ctr.user.email:null}/>

                                        <input type={"password"} className={"inputProfileEmployer marginTop"}
                                            onChange={this.onPasswordChange.bind(this,"old_password")}
                                            value={this.state.old_password?this.state.old_password:""}
                                            placeholder={strings.stringsProfileEmployer.LBL_CURRENT_PASSWORD}/>
                                        <input type={"password"} className={"inputProfileEmployer marginTop"}
                                            onChange={this.onPasswordChange.bind(this,"password_1")}
                                            value={this.state.password_1?this.state.password_1:""}
                                            placeholder={strings.stringsProfileEmployer.LBL_PASSWORD_1}/>
                                        <input type={"password"} className={"inputProfileEmployer marginTop"}
                                            onChange={this.onPasswordChange.bind(this,"password_2")}
                                            value={this.state.password_2?this.state.password_2:""}
                                            placeholder={strings.stringsProfileEmployer.LBL_PASSWORD_2}/>

                                        <p className={"messagePassword"}>{strings.stringsProfileEmployer.LBL_PASSWORD_MESSAGE}</p>
                                        <AsyncButton loading={this.state.loadingChangingPassword} className={"btnChangePassword"} onClick={this.changePassword}
                                                    textButton={strings.stringsProfileEmployer.BTN_CHANGE_PASSWORD}/>
                                        <div  ref={this.refSettings}/>
                                    </div>
                                </Col>
                            </Row>
                            <Row className={"defaultMarginTop"}>
                                <Col lg={6} xs={12} className={"customCol"}>
                                    <div className={"titleColumn"} style={{marginLeft: "30px"}}>
                                        <AsyncButton loading={this.state.loadingUpdate} className={"btnUpdate"} onClick={this.saveEmployer} textButton={strings.stringsProfileEmployer.BTN_UPDATE}/>
                                    </div>
                                </Col>
                                <Col lg={6} xs={12} className={"customCol"}>
                                    <div className={"titleColumn"} style={{marginLeft: "30px"}}>
                                        <AsyncButton loading={this.state.loadingUpdate} className={"btnDelete"}  textButton={strings.stringsProfileEmployer.BTN_DELETE_ACCOUNT}/>
                                    </div>
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                :
                    <Row style={{marginLeft:"50px"}}>
                        <Col xs={12}>
                            <Row>
                                <Col xs={3} className={"customCol"}>
                                    <div className={"titleColumn leftuptitle mobileHide"}>
                                        { this.props.ctr.user && this.props.ctr.user && this.props.ctr.user.companies ? this.props.ctr.user.companies[0]:null}
                                    </div>
                                </Col>
                                <Col xs={5} className={"customCol"}>
                                    <div className={"titleColumn myTitleStyle"}>
                                        {strings.stringsProfileEmployer.LBL_COLUMN_BUSINESS_DETAIL}
                                        {/* <AsyncButton loading={this.state.loadingUpdate} className={"btnUpdate"} onClick={this.saveEmployer} textButton={strings.stringsProfileEmployer.BTN_UPDATE}/> */}
                                    </div>
                                </Col>
                            </Row>
                            <Row className={"defaultMarginTop"}>
                                <Col xs={3}>
                                    <span onClick={this.selectImage}>
                                        <input onChange={this.changeImage} type="file" accept="image/*" style={{display: 'none'}} ref={input => this.inputImageRef = input}/>
                                        <center>
                                            {
                                                this.props.ctr.user && (this.props.ctr.user.profileImage || this.state.previewImage)?
                                                    <Wrapper>
                                                        <img className={"profileImg"} src={this.getImage()}/>
                                                    </Wrapper>
                                                    :
                                                    <div className={"profileImgPlaceholder"}>
                                                        {this.state.companyNameProfile}
                                                    </div>
                                            }
                                        </center>
                                    </span>

                                    <Row className={"defaultMarginTop2"}>
                                        <Col xs={12} className={"customCol leftColumn mySpaceRemove"}>
                                            <div className={"item"} onClick={this.scrollToSection.bind(this,"detail")}>
                                                <img src={addressIcon}/>
                                                {strings.stringsProfileEmployer.LBL_COLUMN_BUSINESS_DETAIL}
                                            </div>
                                            {/* <div className={"item"} onClick={this.scrollToSection.bind(this,"address")}>
                                                <img src={detailIcon}/>
                                                {strings.stringsProfileEmployer.LBL_ADDRESS}
                                            </div> */}
                                            <div className={"item"} onClick={this.scrollToSection.bind(this,"settings")}>
                                                <img src={settingsIcon}/>
                                                {strings.stringsProfileEmployer.LBL_SETTINGS}
                                            </div>
                                        </Col>

                                        <Col xs={12} style={{textAlign:"center"}}>
                                            <button className={"btnLogout"} onClick={this.logout}>{strings.stringsProfileEmployer.BTN_LOGOUT}</button>
                                        </Col>
                                    </Row>
                                </Col>
                                <Col xs={7} className={"customCol bodyCustomCol defaultMarginLeft myProfileStyle"} style={{height: "423px"}}>
                                    <div className={"section"} ref={this.refDetail}>
                                        <Col lg={6} xs={12}>
                                        <p className={"sectionTitle"}>
                                            {strings.stringsProfileEmployer.LBL_EMPLOYER_NAME}
                                        </p>
                                        <p className={"inputProfileEmployer"}>
                                            {this.props.ctr.user.businessname}
                                        </p>
                                        </Col>
                                        <Col lg={6} xs={12}>
                                            <p className={"sectionTitle"}>
                                                {strings.stringsProfileEmployer.LBL_COMPANY_TRADE_TYPE}
                                            </p>
                                            <p className={"inputProfileEmployer"}>
                                                {this.props.ctr.user.companyType}
                                            </p>                                    
                                        </Col>
                                        <Col lg={6} xs={12}>
                                            <p className={"sectionTitle"}>
                                                {strings.stringsProfileEmployer.LBL_COMPANY_NUMBER}
                                            </p>
                                            <p className={"inputProfileEmployer"}>
                                                {this.props.ctr.user.utrno}
                                            </p>                                    
                                        </Col>
                                        {/*
                                        <p className={"sectionTitle"}>
                                            {strings.stringsProfileEmployer.LBL_COMPANY_NUMBER}
                                        </p>
                                        <input type={"text"} className={"inputProfileEmployer"}
                                            value={this.state.employer.companyNumber}
                                            style={{width:"180px"}} onChange={this.onTextChange.bind(this,"companyNumber")}/>
                                        <p className={"sectionTitle"}>
                                            {strings.stringsProfileEmployer.LBL_CONTACT_NUMBER}
                                        </p>
                                        <input type={"number"} className={"inputProfileEmployer"}
                                            value={this.state.employer.contactNumber}
                                            style={{width:"180px"}} onChange={this.onTextChange.bind(this,"contactNumber")}/>
                                        */}
                                    </div>
                                    
                                    <div className={"section"} ref={this.refAddress}>
                                        <Col xs={12}>
                                            <Col xs={12}>
                                                <p className={"sectionTitle"}>
                                                    {strings.stringsProfileEmployer.LBL_ADDRESS}
                                                </p>
                                                <input type={"text"} className={"inputProfileEmployer marginTop"}
                                                    value={this.state.employer.address_1}
                                                    onChange={this.onTextChange.bind(this,"address_1")}
                                                    placeholder={strings.stringsProfileEmployer.LBL_ADDRESS_1}/>
                                            </Col>
                                            <Col lg={6} xs={12}>
                                                <input type={"text"} className={"inputProfileEmployer marginTop"}
                                                    onChange={this.onTextChange.bind(this,"address_2")}
                                                    value={this.state.employer.address_2}
                                                    placeholder={strings.stringsProfileEmployer.LBL_ADDRESS_2}/>
                                            </Col>
                                            {/* <Col xs={6}>
                                                <input type={"text"} className={"inputProfileEmployer marginTop"}
                                                    onChange={this.onTextChange.bind(this,"address_3")}
                                                    value={this.state.employer.address_3}
                                                    placeholder={strings.stringsProfileEmployer.LBL_ADDRESS_3}/>
                                            </Col> */}
                                            <Col lg={6} xs={12}>
                                                <input type={"text"} style={{width:"180px"}} className={"inputProfileEmployer marginTop"}
                                                    onChange={this.onTextChange.bind(this,"postCode")}
                                                    value={this.state.employer.postCode}
                                                    placeholder={strings.stringsProfileEmployer.LBL_POST_CODE}/>
                                            </Col>
                                            <Col lg={6} xs={12}>
                                                <input type={"text"} className={"inputProfileEmployer marginTop"}
                                                    onChange={this.onTextChange.bind(this,"companyNumber")}
                                                    value={this.state.employer.companyNumber}
                                                    placeholder={strings.stringsProfileEmployer.LBL_COMPANY_NUMBER}/>
                                            </Col>
                                        </Col>
                                    </div>
                                </Col>
                            </Row>
                            <Row className={"defaultMarginTop"}>
                            <Col xs={3} ></Col>
                                <Col xs={7} xsOffset={3} className={"customCol titleColumnProfile"}>
                                    <div className={"titleColumn"}>
                                        {strings.stringsProfileEmployer.LBL_SETTINGS}
                                    </div>
                                </Col>
                            </Row>
                            <Row className={"defaultMarginTop"}>
                                <Col xs={3}>
                                    &nbsp;
                                </Col>
                                <Col xs={7} className={"customCol bodyCustomCol defaultMarginLeft myProfileStyle"}>
                                    <div className={"section"}>
                                        <p className={"sectionTitle"}>
                                            {strings.stringsProfileEmployer.LBL_EMAIL_ADDRESS}
                                        </p>
                                        <input type={"text"}
                                            className={"inputProfileEmployer marginTop"}
                                            readOnly={true}
                                            value={this.props.ctr.user?this.props.ctr.user.email:null}/>

                                        <input type={"password"} className={"inputProfileEmployer marginTop"}
                                            onChange={this.onPasswordChange.bind(this,"old_password")}
                                            value={this.state.old_password?this.state.old_password:""}
                                            placeholder={strings.stringsProfileEmployer.LBL_CURRENT_PASSWORD}/>
                                        <input type={"password"} className={"inputProfileEmployer marginTop"}
                                            onChange={this.onPasswordChange.bind(this,"password_1")}
                                            value={this.state.password_1?this.state.password_1:""}
                                            placeholder={strings.stringsProfileEmployer.LBL_PASSWORD_1}/>
                                        <input type={"password"} className={"inputProfileEmployer marginTop"}
                                            onChange={this.onPasswordChange.bind(this,"password_2")}
                                            value={this.state.password_2?this.state.password_2:""}
                                            placeholder={strings.stringsProfileEmployer.LBL_PASSWORD_2}/>

                                        <p className={"messagePassword"}>{strings.stringsProfileEmployer.LBL_PASSWORD_MESSAGE}</p>
                                        <AsyncButton loading={this.state.loadingChangingPassword} className={"btnChangePassword"} onClick={this.changePassword}
                                                    textButton={strings.stringsProfileEmployer.BTN_CHANGE_PASSWORD}/>
                                        <div  ref={this.refSettings}/>
                                    </div>
                                </Col>
                            </Row>
                            <Row className={"defaultMarginTop"}>
                                <Col lg={6} xs={12} className={"customCol myUpdateBtn"}>
                                    <div className={"titleColumn"} style={{marginLeft: "30px"}}>
                                        <AsyncButton loading={this.state.loadingUpdate} className={"btnUpdate"} onClick={this.saveEmployer} textButton={strings.stringsProfileEmployer.BTN_UPDATE}/>
                                    </div>
                                </Col>
                                <Col lg={6} xs={12} className={"customCol myDeleteBtn"}>
                                    <div className={"titleColumn"} style={{marginLeft: "30px"}}>
                                        <AsyncButton loading={this.state.loadingUpdate} className={"btnDelete"}  textButton={strings.stringsProfileEmployer.BTN_DELETE_ACCOUNT}/>
                                    </div>
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                }
                
            </div>
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
        getJobRoles : () =>{
            dispatch({type: constants.REDUX_GET_JOB_ROLES_STATE})
        },
        getEmployer : () =>{
            dispatch({type: constants.REDUX_GET_USER_EMPLOYER_STATE})
        },
        onUserEmployeeUpdated : (user) => {
            dispatch({type: constants.REDUX_PUT_USER_EMPLOYER_STATE,payload:user})
        }
    }
}
export default  connect(mapStateToProps,mapDispatchToProps)(ProfileEmployer);

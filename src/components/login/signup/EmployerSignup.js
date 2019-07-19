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
            companyType:undefined,
            soletraderName:undefined,
            websiteName:undefined,
            utrName:undefined,
            addressTraderName: undefined,
            cityName: undefined,
            postcodeName: undefined,
            contactMobileName: undefined,
            checkbox:false,
            radio:undefined,
            loading:false,
            step:1,
            onBackButton:null,
            isChecked: true,
            errors:{
                companyName:false,
                email:false,
                password:false,
                checkbox:false,
            },
            selectedOption: '',
            successMessage:null
        }
    }
    
    radioChecked = () =>{
        return {checked: true}
    }

    submitStepOne = () =>{
        if(this.checkErrorsStepOne()){
            const tempState = utils.deepCopy(this.state);
            tempState.step = 2;
            tempState.onBackButton = this.onBackButton;
            this.setState(tempState);
        }
    }
    submitManually =() =>{
        const tempState = utils.deepCopy(this.state);
        tempState.step = 5;
        tempState.onBackButton = this.onBackButton;
        this.setState(tempState);
    }

    submitStepTwo = () =>{
        if(this.checkErrorStepTwo()){
            const tempState = utils.deepCopy(this.state);
            let checkOne = true;
            if(tempState.radio === "Limited Company"){
                tempState.step = 4;
                tempState.onBackButton = this.onBackButtonTwo;
                this.setState(tempState);
            }else if(tempState.radio === "Sole Trader"){
                tempState.step = 3;
                tempState.onBackButton = this.onBackButtonTwo;
                this.setState(tempState);
            }else{
                
            }    
        }
    }
    submitStepThree = () =>{
        if(this.checkErrorStepThree()){
            const tempState = utils.deepCopy(this.state);
            tempState.step = 6;
            tempState.onBackButton = this.onBackButton;
            this.setState(tempState);


            /******The following code will be used after payment on registration */
            // const tempState = utils.deepCopy(this.state);
            // // tempState.step = 2;
            // // tempState.onBackButton = this.onBackButton;
            // // this.setState(tempState);
            // // console.log(tempState);
            // tempState.loading = true;
            // this.setState(tempState,()=>{
            //     const employer = {};
            //     employer.email = tempState.email;
            //     employer.companies = [tempState.companyName];
            //     employer.companyType = tempState.radio;

            //     employer.businessname = tempState.soletraderName;
            //     employer.website = tempState.websiteName;
            //     employer.utrno = tempState.utrName;
            //     employer.address = tempState.addressTradeName;
            //     employer.cityname = tempState.cityName;
            //     employer.postcode = tempState.postcodeName;
            //     employer.contactno = tempState.contactMobileName;
            //     // companyType
            //     employer.type = constants.CLUSTER_EMPLOYER;
            //     authFunctions.createEmployerUser(tempState.email, tempState.psw1, employer, this.successSignup, this.errorSignup);
            // });
            /**********************end of the sole trader registration******** */
        }
    }

    successSignup = () =>{
        const tempState = JSON.parse(JSON.stringify(this.state));
        tempState.loading = false;
        tempState.successMessage = strings.stringsSignup.MESSAGE_SUCCESS_SIGNUP;
        tempState.step = '';
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
        const tempStateOne = utils.deepCopy(this.state);
        let checkOne = true;
        if(!tempStateOne.companyName || tempStateOne.companyName.trim() === ""){
            tempStateOne.errors.companyName = true;
            this.setState(tempStateOne);
            return false;
        }else if(!tempStateOne.email || tempStateOne.email.trim() === "" || !utils.validateEmail(tempStateOne.email)){
            tempStateOne.errors.email = true;
            tempStateOne.errors.message = strings.stringsSignup.errors.ERROR_EMAIL;
            checkOne = false;
        }else if(!tempStateOne.psw1 || tempStateOne.psw1.trim() === "" || tempStateOne.psw1.length < 6){
            tempStateOne.errors.password = true;
            tempStateOne.errors.message = strings.stringsSignup.errors.ERROR_PASSWORD;
            checkOne = false;
        }else if(tempStateOne.psw1 !== tempStateOne.psw2){
            tempStateOne.errors.password = true;
            tempStateOne.errors.message = strings.stringsSignup.errors.ERROR_PASSWORD_MATCH;
            checkOne = false;
        }
        this.setState(tempStateOne);
        return checkOne;
    }

    checkErrorStepTwo = () =>{
        const tempState = utils.deepCopy(this.state);
        let check = true;
        tempState.errors.message = null;
        if(!tempState.companyType){
            tempState.errors.companyType = true;
            tempState.errors.message = strings.stringsSignup.errors.ERROR_RADIO;
            check = false;
        }
        this.setState(tempState);
        return check;
    }

    checkErrorStepThree = () =>{
        const tempStateThree = utils.deepCopy(this.state);
        let checkThree = true;
        tempStateThree.errors.message = null;
        if(!tempStateThree.soletraderName || tempStateThree.soletraderName.trim() === ""){
            tempStateThree.errors.soletraderName = true;
            tempStateThree.errors.message = strings.stringsSignup.errors.ERROR_SOLETRADER;
            checkThree = false;
        }    
        this.setState(tempStateThree);
        return checkThree;
    }

    onBackButton = () =>{
        const tempState = utils.deepCopy(this.state);
        tempState.step = 1;
        tempState.onBackButton = this.goToSignin;
        this.setState(tempState);
    }

    onBackButtonTwo = () =>{
        const tempState = utils.deepCopy(this.state);
        tempState.step = 2;
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
    onRadioButtonChange = (e) =>{
        const tempState = utils.deepCopy(this.state);
        tempState.radio = e.target.value;
        // tempState.errors.companyType = true;
        tempState.companyType = tempState.radio;
        tempState.errors.message = null;
        this.setState(tempState);
    }

    render() {
        return (
            <LoginContainer onBackButton={this.state.onBackButton}>
                {
                    this.state.step === 1?
                    <Wrapper>
                        <div className={"withPadding"}>
                            <p className={"title headerText"}>{strings.stringsSignup.TITLE_STEP_1}</p>
                            <Input
                                onChange={this.onInputChange}
                                name={"companyName"}
                                key={1}
                                error={this.state.errors.companyName}
                                label={strings.stringsSignup.LBL_COMPANY_NAME}
                                value={this.state.companyName}
                                placeholder={strings.stringsSignup.PLACEHOLDER_STEP_1}/>
                        </div>
                        <div className={"withPadding wrapperSignup"}>
                            <Input
                                onChange={this.onInputChange}
                                name={"email"}
                                error={this.state.errors.email}
                                label={strings.stringsSignup.LBL_EMAIL}
                                value={this.state.email}
                                placeholder={strings.stringsSignup.PLACEHOLDER_EMAIL_STEP_2}/>
                        </div>
                        <div className={"withPadding wrapperSignup"}>
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

                            {
                                this.state.successMessage?
                                    <p className={"statusMessage globalSuccessMessage"}>{this.state.successMessage}</p>
                                    :
                                    <p className={"statusMessage globalErrorMessage"}>{this.state.errors.message}</p>
                            }    
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

                    <Wrapper className={"withButton"}>
                        <div className={"withPadding"}>
                            <p className={"title headerText"}>{strings.stringsSignup.TITLE_STEP_2}</p>
                        </div>
                        <div className={"wrapperSignup  withPaddingSubtitle"}>
                            <p className={"subtitle"}>{strings.stringsSignup.SUBTITLE_STEP_2}</p>
                        </div>
                        <div className={"wrapperSignup withPaddingCustom"}>
                            <Row className={"wrapperCheckbox checkbox-wrapper"}>

                                <Col xs={12}>
                                    <Col xs={10}>
                                        <span className={'Oval'} style={{paddingLeft:12,paddingRight:12}}>
                                            <i className={'fa fa-shopping-bag Shape'} style={{color:"white"}}></i> 
                                        </span>           
                                    &nbsp; &nbsp; &nbsp;
                                    {strings.stringsSignup.EMP_TYP_1}  
                                    </Col> 
                                    <Col xs={2}>
                                    <Input type={"radio"}
                                                className={'Oval-Copy'}
                                                name={"companyType"}
                                                value={'Limited Company'}
                                                defaultChecked={this.state.checked}
                                            onChange={this.onRadioButtonChange}
                                            onClick={this.onRadioButtonChange}
                                            error={this.state.errors.radio}/>
                                            {/* React.createElement('input',{type: 'checkbox', defaultChecked: false}); */}
                                    </Col>        
                                </Col>
                            </Row>  
                        </div>       
                        <div className={"wrapperSignup"}>
                            <div className={"separatorStep2"}/>
                        </div>
                        <div className={"wrapperSignup withPaddingCustom"}>
                            <Row className={"wrapperCheckbox checkbox-wrapper"}>

                                <Col xs={12}>
                                    <Col xs={10}>

                                        <span className={'Oval'} style={{paddingLeft:12,paddingRight:12}}>
                                            <i className={'fa fa-wrench Shape'} style={{color:"white"}}></i> 
                                        </span>           
                                        &nbsp; &nbsp; &nbsp;
                                    {strings.stringsSignup.EMP_TYP_2}  
                                    </Col> 
                                    <Col xs={2}>
                                    <Input type={"radio"}
                                                className={'Oval-Copy'}
                                                name={"companyType"}
                                                value={'Sole Trader'}
                                                onChange={this.onRadioButtonChange}
                                                error={this.state.errors.radio}/>
                                    </Col>        
                                </Col>
                            </Row>  
                        </div> 
                        <div className={"wrapperSignup withPadding"}>

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
                    : this.state.step === 3?

                    <Wrapper>
                        <div className={"withPadding TraderBox1"}>
                            <p className={"title headerText"}>{strings.stringsSignup.TITLE_STEP_3}</p>
                        </div>
                        <div className={"withPadding TraderBox"}>
                            <Input
                                onChange={this.onInputChange}
                                name={"soletraderName"}
                                error={this.state.errors.soletraderName}
                                label={strings.stringsSignup.LBL_SOLETRADER_NAME}
                                value={this.state.soletraderName}
                                placeholder={strings.stringsSignup.PLACEHOLDER_STEP_3}/>
                        </div>
                        <div className={"withPadding TraderBox"}>
                            <Row className={"wrapperCheckbox checkbox-wrapper"}>
                                    <Col xs={12} className={'tradingName'}>
                                        <p className="tradingDt">Trading name is required</p>
                                    </Col>
                            </Row>        
                        </div>     
                        <div className={"withPadding TraderBox TradeTwo"}>
                            <Row className={"wrapperCheckbox checkbox-wrapper"}>
                                    <Col xs={6}>
                                        <Input
                                            onChange={this.onInputChange}
                                            name={"websiteName"}
                                            error={this.state.errors.websiteName}
                                            label={strings.stringsSignup.WEBSITE_LABEL}
                                            value={this.state.websiteName}
                                            placeholder={strings.stringsSignup.WEBSITE_PLACEHOLDER}/>
                                    </Col>  
                                    <Col xs={6}>
                                        <Input
                                            onChange={this.onInputChange}
                                            name={"utrName"}
                                            error={this.state.errors.utrName}
                                            label={strings.stringsSignup.UTR_LABEL}
                                            value={this.state.utrName}
                                            placeholder={strings.stringsSignup.UTR_PLACEHOLDER}/>
                                    </Col>      
                            </Row>            
                        </div>
                           
                        <div className={"wrapperSignup"}>
                            <div className={"separatorStep2"}/>
                        </div>
                        <div className={"withPadding TraderBox"}>
                            <Row className={"wrapperCheckbox checkbox-wrapper"}>
                                    <Col xs={12}>
                                        <Input
                                            onChange={this.onInputChange}
                                            name={"addressTradeName"}
                                            key={1}
                                            error={this.state.errors.addressTraderName}
                                            label={strings.stringsSignup.SUBTITLE_STEP_3}
                                            value={this.state.addressTraderName}
                                            placeholder={strings.stringsSignup.ADDRESS_PLACEHOLDER}/>
                                    </Col>
                            </Row>
                        </div>
                        <div className={"withPadding TraderBox"}>
                            <Row className={"wrapperCheckbox checkbox-wrapper"}>
                                    <Col xs={6}>
                                        <Input
                                            onChange={this.onInputChange}
                                            name={"cityName"}
                                            key={1}
                                            error={this.state.errors.cityName}
                                            value={this.state.cityName}
                                            placeholder={strings.stringsSignup.CITY_PLACEHOLDER}/>
                                    </Col>  
                                    <Col xs={6}>
                                        <Input
                                            onChange={this.onInputChange}
                                            name={"postcodeName"}
                                            key={1}
                                            error={this.state.errors.postcodeName}
                                            value={this.state.postcodeName}
                                            placeholder={strings.stringsSignup.POSTCODE_PLACEHOLDER}/>
                                    </Col> 

                            </Row>
                        </div>            
                        <div className={"withPadding TraderBox"}>
                            <Row className={"wrapperCheckbox checkbox-wrapper"}>        
                                    <Col xs={6}>
                                        <Input
                                            onChange={this.onInputChange}
                                            name={"contactMobileName"}
                                            key={1}
                                            error={this.state.errors.contactMobileName}
                                            value={this.state.contactMobileName}
                                            placeholder={strings.stringsSignup.PLACEHOLDER_CONTACT_MOBILE}/>
                                    </Col>     
                            </Row>            
                        </div> 
                        <div className={"wrapperSignup withPadding TraderBox paddingTopZero"}>

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
                                    onClick={this.submitStepThree}/>


                            </div>
                        </div>
                        
                    </Wrapper>
                    :this.state.step === 4?
                        <Wrapper>
                            <div className={"withPadding"}>
                                <p className={"title headerText"}>{strings.stringsSignup.TITLE_STEP_4}</p>
                            </div>
                            <div className={"withlessheaderPadding"}>
                                <p className={"title"}>{strings.stringsSignup.COMPANY_HOUSE_SIGNUP_1}</p>
                            </div>
                            
                            <div className={"withPadding GetSeratchTop"}>                            
                                <Input
                                    onChange={this.onInputChange}
                                    name={"companyBusinessName"}
                                    error={this.state.errors.companyBusinessName}
                                    value={this.state.companyBusniessName}
                                    className={"searchField GetSeratch"}
                                    placeholder={strings.stringsSignup.PLACEHOLDER_STEP_COMPANY}/>
                                    <button className={"searchButton SearchBtnClass"} onClick={this.getCompany}>Get Details</button>
                            </div> 
                            <div className={"withPadding"}>
                                <button className={"button-bg"} onClick={this.submitManually}>ENTER COMPANY DETAILS MANUALLY </button>
                            </div>
                            <div className={"wrapperSignup withPadding"}>

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
                                        disabled
                                        textButton={strings.stringsSignup.BTN_SUBMIT}
                                        onClick={this.submitStepThree}/>


                                </div>
                            </div>
                        </Wrapper>
                    :this.state.step === 5?
                    <Wrapper>
                        <div className={"withPadding"}>
                            <p className={"title headerText"}>{strings.stringsSignup.TITLE_STEP_4}</p>
                        </div>
                        <div className={"withPadding"}>
                                <button className={"button-bg"} onClick={this.submitManually}>ENTER COMPANY DETAILS MANUALLY </button>
                            </div>
                        <div className={"withPadding TraderBox"}>
                            <Input
                                onChange={this.onInputChange}
                                name={"soletraderName"}
                                error={this.state.errors.soletraderName}
                                label={strings.stringsSignup.LBL_SOLETRADER_NAME}
                                value={this.state.soletraderName}
                                placeholder={strings.stringsSignup.PLACEHOLDER_STEP_3}/>
                        </div>
                        <div className={"withPadding TraderBox"}>
                            <Row className={"wrapperCheckbox checkbox-wrapper"}>
                            <Col xs={8}>
                                        <Input
                                            onChange={this.onInputChange}
                                            name={"websiteName"}
                                            error={this.state.errors.websiteName}
                                            label={strings.stringsSignup.WEBSITE_LABEL}
                                            value={this.state.websiteName}
                                            placeholder={strings.stringsSignup.WEBSITE_PLACEHOLDER}/>
                                    </Col>  
                                    <Col xs={4} className={"DropdownStyle"}>
                                        <select
                                            onChange={this.onInputChange}
                                            name={"utrName"}
                                            error={this.state.errors.utrName}
                                            label={strings.stringsSignup.UTR_LABEL}
                                            value={'Limited'}
                                            placeholder={strings.stringsSignup.UTR_PLACEHOLDER}/>
                                    </Col>  
                            </Row>        
                        </div>     
                        <div className={"withPadding TraderBox TradeTwo"}>
                            <Row className={"wrapperCheckbox checkbox-wrapper"}>
                                    <Col xs={6}>
                                        <Input
                                            onChange={this.onInputChange}
                                            name={"websiteName"}
                                            error={this.state.errors.websiteName}
                                            label={strings.stringsSignup.WEBSITE_LABEL}
                                            value={this.state.websiteName}
                                            placeholder={strings.stringsSignup.WEBSITE_PLACEHOLDER}/>
                                    </Col>  
                                    <Col xs={6}>
                                        <Input
                                            onChange={this.onInputChange}
                                            name={"utrName"}
                                            error={this.state.errors.utrName}
                                            label={strings.stringsSignup.UTR_LABEL}
                                            value={this.state.utrName}
                                            placeholder={strings.stringsSignup.UTR_PLACEHOLDER}/>
                                    </Col>      
                            </Row>            
                        </div>
                        {/* <div className={"wrapperSignup  withPaddingSubtitle"}>
                            <p className={"subtitle"}>{strings.stringsSignup.SUBTITLE_STEP_2}</p>
                        </div> */}     
                        <div className={"wrapperSignup"}>
                            <div className={"separatorStep2"}/>
                        </div>
                        {/* <div className={"withPadding"}>
                            <Input
                                onChange={this.onInputChange}
                                name={"soletraderName"}
                                key={1}
                                error={this.state.errors.soletraderName}
                                label={strings.stringsSignup.LBL_SOLETRADER_NAME}
                                value={this.state.soletraderName}
                                placeholder={strings.stringsSignup.PLACEHOLDER_STEP_3}/>
                        </div> */}
                        <div className={"withPadding TraderBox"}>
                            <Row className={"wrapperCheckbox checkbox-wrapper"}>
                                    <Col xs={12}>
                                        <Input
                                            onChange={this.onInputChange}
                                            name={"addressTradeName"}
                                            key={1}
                                            error={this.state.errors.addressTraderName}
                                            label={strings.stringsSignup.SUBTITLE_STEP_3}
                                            value={this.state.addressTraderName}
                                            placeholder={strings.stringsSignup.ADDRESS_PLACEHOLDER}/>
                                    </Col>
                            </Row>
                        </div>
                        <div className={"withPadding TraderBox"}>
                            <Row className={"wrapperCheckbox checkbox-wrapper"}>
                                    <Col xs={6}>
                                        <Input
                                            onChange={this.onInputChange}
                                            name={"cityName"}
                                            key={1}
                                            error={this.state.errors.cityName}
                                            value={this.state.cityName}
                                            placeholder={strings.stringsSignup.CITY_PLACEHOLDER}/>
                                    </Col>  
                                    <Col xs={6}>
                                        <Input
                                            onChange={this.onInputChange}
                                            name={"postcodeName"}
                                            key={1}
                                            error={this.state.errors.postcodeName}
                                            value={this.state.postcodeName}
                                            placeholder={strings.stringsSignup.POSTCODE_PLACEHOLDER}/>
                                    </Col> 

                            </Row>
                        </div>            
                            <div className={"withPadding TraderBox"}>
                                <Row className={"wrapperCheckbox checkbox-wrapper"}>        
                                    <Col xs={6}>
                                        <Input
                                            onChange={this.onInputChange}
                                            name={"contactMobileName"}
                                            key={1}
                                            error={this.state.errors.contactMobileName}
                                            value={this.state.contactMobileName}
                                            placeholder={strings.stringsSignup.PLACEHOLDER_CONTACT_MOBILE}/>
                                    </Col>       
                            </Row>            
                        </div> 
                        <div className={"wrapperSignup withPadding TraderBox paddingTopZero"}>

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
                                    onClick={this.submitStepThree}/>


                            </div>
                        </div>
                    </Wrapper>    
                    :this.state.step === 6?
                    
                    <Wrapper className={"withButton"}>
                    <div className={"withPadding"}>
                        <p className={"title headerText"}>{strings.stringsSignup.TITLE_STEP_6}</p>
                    </div>
                    <div className={"wrapperSignup  withPaddingSubtitle"}>
                        <p className={"subtitle"}>{strings.stringsSignup.PAYMENT_SUBTITLE}</p>
                    </div>
                    <div className={"wrapperSignup"}>
                            <div className={"separatorStep1"}/>
                    </div>
                    <div className={"wrapperSignup withPaddingCustom"}>
                        <Row className={"wrapperCheckbox checkbox-wrapper"}>

                            <Col xs={3}>

                                <span className={'Oval'} style={{paddingLeft:12,paddingRight:12}}>
                                    <i className={'fa fa-shopping-bag Shape'} style={{color:"white"}}></i> 
                                </span> 
                            </Col>
                            <Col xs={9}>
                                <div>Connect your business</div>
                                <div>Open Force uses Stripe to manage payments and invoices automatically.</div>
                            </Col>
                        </Row>
                    </div>   
                    <div className={"wrapperSignup withPadding"}>

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
                :this.state.step === 7?
                <Wrapper className={"withButton"}>
                    <div className={"withPadding"}>
                        <p className={"title headerText"}>{strings.stringsSignup.TITLE_STEP_6}</p>
                    </div>
                    <div className={"wrapperSignup  withPaddingSubtitle"}>
                        <p className={"subtitle"}>{strings.stringsSignup.PAYMENT_SUBTITLE}</p>
                    </div>
                    <div className={"wrapperSignup"}>
                            <div className={"separatorStep1"}/>
                    </div>
                    <div className={"wrapperSignup withPaddingCustom"}>
                        <Row className={"wrapperCheckbox checkbox-wrapper"}>

                            <Col xs={3}>

                                <span className={'Oval'} style={{paddingLeft:12,paddingRight:12}}>
                                    <i className={'fa fa-shopping-bag Shape'} style={{color:"white"}}></i> 
                                </span> 
                            </Col>
                            <Col xs={9}>
                                <div>Connect your business</div>
                                <div>Open Force uses Stripe to manage payments and invoices automatically.</div>
                            </Col>
                        </Row>
                    </div>   
                    <div className={"wrapperSignup withPadding"}>

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
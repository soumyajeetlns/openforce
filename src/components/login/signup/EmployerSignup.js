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
import stripeButton from '../../../assets/img/stripe_btn.jpg';
import stripeIconES from '../../../assets/img/stripe-icon.svg';
import linkBtnES from '../../../assets/img/link_btn.jpg';
class EmployerSignup extends Component {
    constructor(args) {
        super(args);
        this.state = {
            companyName:undefined,
            getCompanyName:undefined,
            email:undefined,
            psw1:undefined,
            psw2:undefined,
            companyType:undefined,
            soletraderName:undefined,
            websiteName:undefined,
            utrName:undefined,
            addressTraderName: undefined,
            addressTradeName: undefined,
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
            successMessage:null,

            apiCompanyName:[]
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
            }
            else{
                
            }
        }
    }
    submitStepThree = () =>{
        if(this.checkErrorStepThree()){
            const tempState = utils.deepCopy(this.state);
            tempState.step = 6;
            tempState.onBackButton = this.onBackButton;
            this.setState(tempState);
            let session     =   JSON.stringify(tempState);
            //console.log(session);
            localStorage.setItem('session', session);
        }
    }

    submitStepFour = () =>{
        if(this.checkErrorStepFour()){
            const tempState = utils.deepCopy(this.state);
            tempState.step = 6;
            tempState.onBackButton = this.onBackButton;
            this.setState(tempState);
            let session     =   JSON.stringify(tempState);
            //console.log(session);
            localStorage.setItem('session', session);
        }
    }

    finalSubmitForSignUp = () =>{
        /******The following code will be used after payment on registration Sole Trader*/
            const tempState = utils.deepCopy(this.state);
            // tempState.step = 2;
            // tempState.onBackButton = this.onBackButton;
            // this.setState(tempState);
            // console.log(tempState);
            // Soumyajeet Amends
            if(this.props.location.search!=""){
                let params = this.props.location.search.split("&");
                let values = params[1].split("=");
                let stripeId = values[1];
                //console.log('Stripe Id Pritam ' + stripeId);
                       
            let getlocalData =   JSON.parse(localStorage.getItem('session'));
            console.log(getlocalData);
            if(getlocalData != null && getlocalData.companyType === 'Sole Trader')
            {
                tempState.companyName           =   getlocalData.companyName;
                tempState.email                 =   getlocalData.email;
                tempState.psw1                  =   getlocalData.psw1;
                tempState.psw2                  =   getlocalData.psw2;
                tempState.companyType           =   getlocalData.companyType;
                tempState.getCompanyName        =   getlocalData.getCompanyName;
                tempState.websiteName           =   getlocalData.websiteName;
                tempState.utrName               =   getlocalData.utrName;
                tempState.cityName              =   getlocalData.cityName;
                tempState.postcodeName          =   getlocalData.postcodeName;
                tempState.contactMobileName     =   getlocalData.contactMobileName;
                tempState.checkbox              =   getlocalData.checkbox;
                tempState.radio                 =   getlocalData.radio;
                tempState.isChecked             =   getlocalData.isChecked;
                tempState.addressTradeName      =   getlocalData.addressTradeName;
                tempState.stripeId              =   stripeId
            
                // Pritam Amends
                tempState.loading = true;
                this.setState(tempState,()=>{
                const employer = {};
                employer.email          =   tempState.email;
                employer.companies      =   [tempState.companyName];
                employer.companyType    =   tempState.radio;
                employer.businessname   =   tempState.getCompanyName;
                employer.website        =   tempState.websiteName;
                employer.utrno          =   tempState.utrName;
                employer.address        =   tempState.addressTradeName;
                employer.cityname       =   tempState.cityName;
                employer.postcode       =   tempState.postcodeName;
                employer.contactno      =   tempState.contactMobileName;
                employer.stripeId       =   tempState.stripeId;
                // companyType
                employer.type = constants.CLUSTER_EMPLOYER;
                authFunctions.createEmployerUser(tempState.email, tempState.psw1, employer, this.successSignup, this.errorSignup);
                });
                /**********************end of the sole trader registration******** */
                localStorage.removeItem('session');
            }
            else if(getlocalData != null && getlocalData.companyType != 'Sole Trader'){
                let params = this.props.location.search.split("&");
                let values = params[1].split("=");
                let stripeId = values[1];

                tempState.companyName           =   getlocalData.companyType;
                tempState.email                 =   getlocalData.email;
                tempState.psw1                  =   getlocalData.psw1;
                tempState.psw2                  =   getlocalData.psw2;
                tempState.companyType           =   'Limited Company';
                tempState.getCompanyName        =   getlocalData.getCompanyName;
                tempState.radio                 =   getlocalData.radio;
                tempState.isChecked             =   getlocalData.isChecked;
                tempState.stripeId              =   stripeId
                // Pritam Amends
                tempState.loading = true;
                this.setState(tempState,()=>{
                const employer = {};
                employer.businessname       =   tempState.radio;
                employer.email              =   tempState.email;
                employer.companies          =   [tempState.companyName];
                employer.companyType        =   tempState.companyType;
                tempState.getCompanyName    =   [tempState.companyName];
                tempState.isChecked         =   getlocalData.isChecked;
                employer.stripeId           =   tempState.stripeId;

                employer.type = constants.CLUSTER_EMPLOYER;
                authFunctions.createEmployerUser(tempState.email, tempState.psw1, employer, this.successSignup, this.errorSignup);
                });
                localStorage.removeItem('session');
            }
        }            
    }

    companyStripeConnect = () =>{
        const tempState = utils.deepCopy(this.state);
        tempState.step = 7;
        delete tempState.apiCompanyName;
        //console.log(tempState);
        let session     =   JSON.stringify(tempState);
        localStorage.setItem('session', session);
        window.location.assign('https://dashboard.stripe.com/oauth/authorize?response_type=code&client_id=ca_FPl1s22wpJgCIUacHACu2Oi1HFj3CkQo&scope=read_write');
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
        if(!tempStateThree.getCompanyName || tempStateThree.getCompanyName.trim() === ""){
            tempStateThree.errors.getCompanyName = true;
            checkThree = false;
        }
        this.setState(tempStateThree);
        return checkThree;
    }

    checkErrorStepFour = () =>{
        const tempStateFour = utils.deepCopy(this.state);
        let checkFour = true;
        tempStateFour.errors.message = null;
        if(!tempStateFour.soletraderName || tempStateFour.soletraderName.trim() === ""){
            tempStateFour.errors.soletraderName = true;
            checkFour = false;
        }
        else if(!tempStateFour.websiteName || tempStateFour.websiteName.trim() === ""){
            tempStateFour.errors.websiteName = true;
            checkFour = false;

        }
        else if(!tempStateFour.utrName || tempStateFour.utrName.trim() === ""){
            tempStateFour.errors.utrName = true;
            checkFour = false;
        }
        else if(!tempStateFour.addressTradeName || tempStateFour.addressTradeName.trim() === ""){
            tempStateFour.errors.addressTradeName = true;
            checkFour = false;
        }
        else if(!tempStateFour.cityName || tempStateFour.cityName.trim() === ""){
            tempStateFour.errors.cityName = true;
            checkFour = false;
        }
        else if(!tempStateFour.postcodeName || tempStateFour.postcodeName.trim() === ""){
            tempStateFour.errors.postcodeName = true;
            checkFour = false;
        }
        else if(!tempStateFour.contactMobileName || tempStateFour.contactMobileName.trim() === ""){
            tempStateFour.errors.contactMobileName = true;
            checkFour = false;
        }        
        else if(tempStateFour.websiteName !== "")
        {
            let regexp =  /^(?:(?:https?|ftp):\/\/)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:\/\S*)?$/;
            if (!regexp.test(tempStateFour.websiteName))
            {
                tempStateFour.errors.websiteName = true;
                //tempStateFour.errors.message = strings.stringsSignup.errors.ERROR_WEBSITE_URL;
                checkFour = false;
            }
        }
        this.setState(tempStateFour);
        return checkFour;

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
        //For Stripe Payment
        if(this.props.location.search!=""){
            let params = this.props.location.search.split("&");
            let values = params[1].split("=");
            let stripeId = values[1];
            //console.log("Stripe Id: "+stripeId);
            //alert("Stripe Connected Successfully, Your Stripe ID: "+stripeId);
            const tempState = utils.deepCopy(this.state);
            tempState.step = 7;
            tempState.onBackButton = this.onBackButtonTwo;
            this.setState(tempState);
            // console.log(tempState);
            //localStorage.removeItem('session');
            /*console.log('CHECK ' +  getlocalData.radio);*/
        }else{
            const tempState = utils.deepCopy(this.state);
            tempState.onBackButton = this.goToSignin;
            this.setState(tempState);
        }        
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
        this.setState({submitting: !this.state.submitting});
    }

    getCompanyDetails = (e) =>{
        //console.log('Hello Soumyajeet');        
        const tempState = utils.deepCopy(this.state);
        let url    =   constants.COMPANYHOUSEAPIURL+tempState.getCompanyName;        
        fetch(url)
        .then((response) => response.json())
        .then((findresponse) => this.setState({apiCompanyName : findresponse.company}));
    }

    stripeLogin = (e) =>{
        window.location.assign('https://dashboard.stripe.com/oauth/authorize?response_type=code&client_id=ca_FPl1s22wpJgCIUacHACu2Oi1HFj3CkQo&scope=read_write');
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
                                                //defaultChecked={this.state.checked}
                                            onChange={this.onRadioButtonChange}
                                            //onClick={this.onRadioButtonChange}
                                            checked={this.state.selected == 'Limited Company'}
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
                                                checked={this.state.selected == 'Sole Trader'}
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
                                        //error={this.state.errors.addressTradeName}
                                        error={this.state.errors.addressTradeName}
                                        label={strings.stringsSignup.SUBTITLE_STEP_3}
                                        value={this.state.addressTradeName}
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
                                    onClick={this.submitStepFour}/>


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
                                    name={"getCompanyName"}
                                    error={this.state.errors.getCompanyName}
                                    value={this.state.getCompanyName}
                                    className={"searchField GetSeratch"}                                                                        
                                    placeholder={strings.stringsSignup.PLACEHOLDER_STEP_COMPANY}/>
                                    <button className={"searchButton SearchBtnClass"} disabled={!this.state.getCompanyName} onClick = {this.getCompanyDetails}>Get Details</button>
                            </div>
                            <div className="companydatalist">
                                    {this.state.apiCompanyName.map((p,i)=>
                                    <Col xs={12} className="companyData">                                    
                                        <Col md={1} xs={2}>
                                            <span><i class="material-icons Oval cmpi">work</i></span>
                                        </Col>      
                                        <Col md={5} className="hidden-xs">  
                                            <p>{p.title}<br/>
                                            {p.company_number}</p>
                                        </Col>
                                        <Col xs={5} className="hidden-xs">
                                            <p>{p.address_snippet}</p>
                                        </Col>
                                        <Col xs={9} className="hidden-md hidden-lg">
                                            <p>{p.title}, {p.company_number}<br/>{p.address_snippet}</p>
                                        </Col>
                                        <Col xs={1}>
                                            <Input type={"radio"}
                                                    className={'Oval-Copy'}
                                                    name={"registedbusinessname"}
                                                    value={p.title}
                                                    defaultChecked={this.state.checked}
                                                onChange={this.onRadioButtonChange}
                                                onClick={this.onRadioButtonChange}
                                                error={this.state.errors.radio}/>
                                        </Col>
                                    </Col>)
                                    }
                            </div>
                            {/* <div className={"withPadding companydatalist_btn"}>
                                <button className={"button-bg"} onClick={this.submitManually}>ENTER COMPANY DETAILS MANUALLY </button>
                            </div> */}
                            <div className={"wrapperSignup withPadding companydatalist_btn"}>

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
                                        textButton={strings.stringsSignup.BTN_SUBMIT}
                                        disabled={this.state.submitting}
                                        // onClick={this.companyStripeConnect}
                                        onClick = {this.submitStepThree}                                        
                                        />
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
                        <p className={"subtitle"}>{strings.stringsSignup.PAYMENT_SUBTITLE}</p>
                    </div>
                    <div className={"wrapperSignup  withPaddingSubtitle"}>                        
                    </div>
                    <div className={"wrapperSignup"}>
                            <div className={"separatorStep1"}/>
                    </div>
                    <div className={"wrapperSignup withPaddingCustom"}>
                        <Row className={"wrapperCheckbox checkbox-wrapper"} style={{marginTop:20}}>

                            <Col lg={2} xs={2} style={{marginTop:20}}>

                                <span className={'Oval'} style={{paddingLeft:12,paddingRight:12}}>
                                    <i className={'fa fa-shopping-bag Shape'} style={{color:"white"}}></i> 
                                </span> 
                            </Col>
                            <Col lg={10} xs={10}>
                                <h4>Connect your business</h4>
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
                            <a href="#" className="stripe_btn" onClick={this.stripeLogin}><img src={stripeButton}/></a>
                        </div>
                        <div className={"wrapperButtons"}>
                            {/* <AsyncButton
                                className={"btnSubmitStepTwo"}
                                loading={this.state.loading}
                                textButton={strings.stringsSignup.BTN_STEP_1}
                                onClick={this.submitStepTwo}/> */}
                        </div>
                    </div>
                </Wrapper> 
                :this.state.step === 7?
                <Wrapper className={"withButton"}>
                    <div className={"withPadding"}>
                        <p className={"title headerText"}>{strings.stringsSignup.TITLE_STEP_6}</p>
                        <p className={"subtitle"}>{strings.stringsSignup.PAYMENT_SUBTITLE}</p>
                    </div>
                    <div className={"wrapperSignup  withPaddingSubtitle"}>                        
                    </div>
                    <div className={"wrapperSignup"}>
                            <div className={"separatorStep1"}/>
                    </div>
                    <div className={"wrapperSignup withPaddingCustom"}>
                        <Row className={"wrapperCheckbox checkbox-wrapper"} style={{marginTop:20}}>

                            <Col lg={2} xs={3} style={{marginTop:20}}>
                            <img src={stripeIconES}/>
                            </Col>
                            <Col lg={10} xs={9}>
                                <h4>Connect your business</h4>
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
                       <div className={"wrapperButtons"}><a href="#" onClick={this.stripeLogin}><img src={linkBtnES}/></a></div>
                        <div className={"wrapperButtons"}>
                            <AsyncButton
                                className={"btnSubmitStepTwo"}
                                loading={this.state.loading}
                                textButton={strings.stringsSignup.BTN_STEP_1}
                                onClick={this.finalSubmitForSignUp}/>


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
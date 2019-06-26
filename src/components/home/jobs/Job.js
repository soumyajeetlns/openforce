import React, {Component} from 'react';
import HomeContainer from "../HomeContainer";
import * as strings from "../../../utils/Strings";
import * as utils from "../../../utils/Utils";
import * as jobsFunctions from "../../../functions/JobsFunctions";
import * as css from './Job.css';
import Wrapper from "../../wrapper/Wrapper";
import Loader from "../../loader/Loader";
import {Col, Row} from "react-flexbox-grid";
import Input from "../../input/Input";
import AutocompleteInput from "../../autocompleteInput/AutocompleteInput";
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';
import DatePicker from 'react-datepicker';
import moment from 'moment';
import 'react-datepicker/dist/react-datepicker.css';
import HocJob from "../../../utils/hoc/jobs/HocJob";
import AsyncButton from "../../asyncButton/AsyncButton";
import * as constants from "../../../utils/Constants";
import Popup from "../../popup/Popup";
import firebase from 'firebase'
import icon_job_role from '../../../assets/img/job_role.svg';
import icon_job_how_many from '../../../assets/img/job_many.svg';
import icon_job_time from '../../../assets/img/job_time.svg';

class Job extends Component {
    constructor(args) {
        super(args);
        this.state = {
            loading:false,
            loadingDraft:false,
            boxOpened:0,
            job:{},
            errors :{
                noRoles:false,
                noGoogleLocation:false,
                noEmployee:false,
                noDate:false
            },
            confirmArchive:false,
            loadingArchiveJob:false,
        }
        this.state.rehire = {

        }
    }
    createSliderWithTooltip = Slider.createSliderWithTooltip;
    SliderTooltip = this.createSliderWithTooltip(Slider);

    rangeMarkerStyle = {
        width: "14px",
        height: "14px",
        backgroundColor: "#fed91c",
        border:"0"
    }

    trackStyle ={
        backgroundColor: "#fed91c",
    }

    openBox = (index) => {
        const tempState = utils.deepCopy(this.state);
        if (tempState.boxOpened === index) tempState.boxOpened = 0;
        else tempState.boxOpened = index;
        this.setState(tempState);
    }

    componentDidMount = () =>{
        const tempState = utils.deepCopy(this.state);

        tempState.job = this.props.job?this.props.job:{};
        this.setState(tempState);
    }

    onJobRuleChoosed = (jobRole) => {
        const tempState = utils.deepCopy(this.state);
        tempState.job.jobRole = jobRole;
        this.setState(tempState);
    }

    onJobRuleDeleted = () =>{
        const tempState = utils.deepCopy(this.state);
        tempState.job.jobRole = null;
        this.setState(tempState);
    }

    onJobDescrChange = (e) =>{
        const tempState = utils.deepCopy(this.state);
        tempState.job.description = e.target.value;
        this.setState(tempState);
    }

    onSlideValueChange = (value) =>{
        const tempState = utils.deepCopy(this.state);
        tempState.job.requiredEmployees = value;
        this.setState(tempState);
    }

    handleChangeDate = (field,value) =>{
        const tempState = utils.deepCopy(this.state);
        const day = moment(value).date();
        const month = moment(value).month();
        const year = moment(value).year();
        const tempDate =  Date.UTC(year, month, day,
            0, 0, 0);
        tempState.job[field] = tempDate;
        this.setState(tempState);
    }

    onGooglePlaceSelected = (address) =>{
        const tempState = utils.deepCopy(this.state);
        tempState.job.address = address.address;
        tempState.job.latitude = address.latitude;
        tempState.job.longitude = address.longitude;
        tempState.job.coordinates = new firebase.firestore.GeoPoint( address.latitude,address.longitude );
        this.setState(tempState);
    }

    confirmArchive = () =>{
        const tempState = utils.deepCopy(this.state);
        tempState.confirmArchive = true;
        this.setState(tempState);
    }

    closeConfirmArchive = () =>{
        const tempState = utils.deepCopy(this.state);
        tempState.confirmArchive = false;
        this.setState(tempState);
    }

    confirmReHire = () =>{
        //console.log("Hello Soumyajeet");
        const tempState = utils.deepCopy(this.state.rehire);
        tempState.confirmReHire = true;
        this.setState(tempState);
    }

    closeconfirmReHire = () =>{
        const tempState = utils.deepCopy(this.state);
        tempState.confirmReHire = false;
        this.setState(tempState);
    }

    archiveJob = () =>{
        const tempState = utils.deepCopy(this.state);
        const jobId =  tempState.job.id;
        tempState.loadingArchiveJob = true;
        this.setState(tempState,()=>{
            jobsFunctions.archiveJob(jobId,()=>{
                tempState.loadingArchiveJob = false;
                tempState.confirmArchive = false;
                this.setState(tempState);
            },()=>{
                tempState.loadingArchiveJob = false;
                this.setState(tempState);
            })
        })
    }


    checkErrors = () =>{
        const tempState = utils.deepCopy(this.state);
        let check = true;

        tempState.errors.noRoles = false;
        tempState.errors.noGoogleLocation = false;
        tempState.errors.noEmployee = false;
        tempState.errors.noDate = false;

        if(!tempState.job.jobRole || !tempState.job.jobRole.name || tempState.job.jobRole.name.trim().length === 0){
            tempState.errors.noRoles = true;
            utils.showError(strings.stringsJobPopup.errors.NO_ROLE_SELECTED);
            check = false;
        } else if(tempState.job.address == null || tempState.job.latitude == null || tempState.job.longitude == null ){
            tempState.errors.noGoogleLocation = true;
            utils.showError(strings.stringsJobPopup.errors.NO_LOCATION);
            check = false;
        } else if(tempState.job.requiredEmployees == null || tempState.job.requiredEmployees <=0 ){
            tempState.errors.noEmployee = true;
            utils.showError(strings.stringsJobPopup.errors.NO_EMPLOYEE);
            check = false;
        } else if(tempState.job.startDate == null || tempState.job.endDate == null ){
            tempState.errors.noDate = true;
            utils.showError(strings.stringsJobPopup.errors.NO_DATES);
            check = false;
        } else if(this.getTotalWorkDays() === 0){
            tempState.errors.noDate = true;
            utils.showError(strings.stringsJobPopup.errors.WRONG_DATES);
            check = false;
        }
        this.setState(tempState);

        return check;
    }

    saveJob = (isDraft) =>{
        if(this.checkErrors()){
            const tempState = utils.deepCopy(this.state);
            if(isDraft){
                tempState.loadingDraft = true;
            }else{
                tempState.loading = true;
            }
            this.setState(tempState,()=>{
                const job = utils.deepCopy(tempState.job);
                if(!job.id)job.creationDate = new Date().getTime(); // save the creation date only the first time
                if(isDraft){
                    job.status = constants.JOBS_DRAFT;
                }else {
                    job.status = constants.JOBS_ACTIVE;
                    job.postedDate = new Date().getTime();
                }
                if(!job.employerID && this.props.employerID)job.employerID = this.props.employerID;
                if(!job.employerName && this.props.employerName)job.employerName = this.props.employerName;

                jobsFunctions.saveJob(job,()=>{
                    tempState.loading = false;
                    tempState.loadingDraft = false;
                    this.setState(tempState,()=>{
                        this.props.onClosePopup();
                    });
                },(error)=>{
                    tempState.loading = false;
                    tempState.loadingDraft = false;
                    this.setState(tempState);
                })
            });
        }
    }

    getTotalWorkDays = () =>{
        const tempState = utils.deepCopy(this.state);
        if(tempState.job.startDate && tempState.job.startDate){
            const a = moment(tempState.job.startDate);
            const b = moment(tempState.job.endDate);
            const diff = b.diff(a, 'days');
            return diff>0?diff:0;
        }else{
            return 0;
        }
    }
    
    popUpTitle = () =>{
        
        if(this.state.job.status === 'archive')
        {
            return strings.stringsJobPopup.LBL_EDIT_TITLE
        }
        else
        {
            return strings.stringsJobPopup.LBL_TITLE
        }                
    }

    render() {
        return (
            <Wrapper>
                <div className={"myShadow"}/>

                <div className={"wrapperJob"}>
                    {
                        this.state.confirmReHire?
                        <Popup
                            titleText={strings.stringsJobMap.POPUP_CONFIRM_RE_HIRE_TITLE}
                            bodyText={strings.stringsJobMap.POPUP_CONFIRM_RE_HIRE_BODY}
                            btnAccept={strings.stringsJobMap.POPUP_CONFIRM_RE_HIRE_ACCEPT}
                            btnCancel={strings.stringsJobMap.POPUP_CONFIRM_RE_HIRE_CANCEL}
                            loading={this.state.loadingArchiveJob}
                            onConfirmClick={this.saveJob.bind(this,false)}
                            width={550}
                            height={330}
                            onDeclineClick={this.closeconfirmReHire}/>
                        :
                        this.state.confirmArchive?
                            <Popup
                                titleText={strings.stringsJobMap.POPUP_CONFIRM_END_JOB_TITLE}
                                bodyText={strings.stringsJobMap.POPUP_CONFIRM_END_JOB_BODY}
                                btnAccept={strings.stringsJobMap.POPUP_CONFIRM_BTN_ACCEPT}
                                btnCancel={strings.stringsJobMap.POPUP_CONFIRM_BTN_CANCEL}
                                loading={this.state.loadingArchiveJob}
                                onConfirmClick={this.archiveJob}
                                width={550}
                                height={330}
                                onDeclineClick={this.closeConfirmArchive}/>
                            :
                            <div className={"bodyJob"}>
                                <Row>
                                    <Col xs={8}>
                                        <p className={"title"}>
                                            {/* {strings.stringsJobPopup.LBL_TITLE} */}
                                            { this.popUpTitle() }
                                        </p>
                                    </Col>
                                    <Col xs={4} style={{textAlign:"right"}}>
                                        <button className={"closePopupJob"} onClick={this.props.onClosePopup}>
                                            <i className="material-icons">
                                                close
                                            </i>
                                        </button>
                                    </Col>

                                    <Col xs={12} className={"wrapperBox"}>
                                        <Row>
                                            <Col xs={12} className={"box"} onClick={this.openBox.bind(this,1)}>
                                                <Row>
                                                    <Col xs={1}>
                                                        <img className={"iconWrapperBox"} src={icon_job_role}/>
                                                    </Col>
                                                    <Col xs={11}>
                                                        {strings.stringsJobPopup.box_1.LBL_BOX_TITLE_1}
                                                    </Col>
                                                </Row>
                                            </Col>
                                            <Col xs={12} className={"subBox"} style={this.state.boxOpened === 1?{display:"block"}:null}>
                                                <Row>
                                                    <Col xs={11} className={"box_1"} style={{marginTop:"15px"}}>
                                                        <AutocompleteInput
                                                            className={"defaultInput customAutocomplete"}
                                                            dataset={this.props.jobRoles}
                                                            readOnly={this.state.job.status === "active"}
                                                            disabled={this.state.job.status === "archive"}
                                                            width={355}
                                                            onChoosed={this.onJobRuleChoosed}
                                                            shouldClearInputAfterChoose={true}
                                                            shouldHideAfterChoose={true}
                                                            googleMaterialIcon={"search"}
                                                            placeholder={strings.stringsJobPopup.box_1.PLACEHOLDER_INPUT_BOX_1}/>

                                                        <div className={"wrapperChoosedJobRoles"}>
                                                            {this.state.job.jobRole && <button className={"baloonRole"} disabled={this.state.job.status === "active"} onClick={this.onJobRuleDeleted}>{this.state.job.jobRole.name}</button>}
                                                        </div>

                                                    </Col>

                                                    <Col xs={12} style={{marginTop:"30px"}}>
                                                        <div className={"separator"}/>
                                                    </Col>

                                                    <Col xs={1}/>
                                                    <Col xs={11} className={"box_1"} style={{marginTop:"15px"}}>
                                                        <p className={"subBoxTitle"}>
                                                            {strings.stringsJobPopup.box_1.LBL_BOX_TITLE_2}
                                                        </p>
                                                        <p className={"subBoxSubTitle"}>
                                                            {strings.stringsJobPopup.box_1.LBL_BOX_SUBTITLE_2}
                                                        </p>
                                                        <textarea className={"defaultInput customTextarea"} value={this.state.job.description} onChange={this.onJobDescrChange}/>
                                                    </Col>

                                                    <Col xs={1}/>
                                                    <Col xs={11} className={"box_1"} style={{marginTop:"35px"}}>
                                                        <p className={"subBoxTitle"}>
                                                            {strings.stringsJobPopup.box_1.LBL_BOX_TITLE_3}
                                                        </p>
                                                        <div className={"inputContainer"}>
                                                            <Input googleMaterialIcon={"search"}
                                                                   type={"google"}
                                                                   readOnly={this.state.job.status === "active"}
                                                                   initialValue={this.state.job.address}
                                                                   error={this.state.errors.noGoogleLocation}
                                                                   onGooglePlaceSelected={this.onGooglePlaceSelected}
                                                                   placeholder={strings.stringsJobPopup.box_1.PLACEHOLDER_INPUT_BOX_2}/>
                                                        </div>
                                                    </Col>
                                                </Row>
                                            </Col>

                                            <Col xs={12} className={"box"} onClick={this.openBox.bind(this,2)}>
                                                <Row>
                                                    <Col xs={1}>
                                                        <img className={"iconWrapperBox"} src={icon_job_how_many}/>
                                                    </Col>
                                                    <Col xs={11}>
                                                        {strings.stringsJobPopup.box_2.LBL_BOX_TITLE_2}
                                                    </Col>
                                                </Row>
                                            </Col>
                                            <Col xs={12} className={"subBox"} style={this.state.boxOpened === 2?{display:"block"} : {}}>
                                                <Row>
                                                    <Col xs={1}/>
                                                    <Col xs={11}>
                                                        <div className="wrapperChoosedJobRoles">
                                                            {
                                                                <Wrapper>
                                                                    {this.state.job.jobRole ? <p>{this.state.job.jobRole.name}</p> : "Job role not selected"}
                                                                    <div className={"wrapperSlider"}>
                                                                        <this.SliderTooltip
                                                                            min={0}
                                                                            max={20}
                                                                            onChange={this.onSlideValueChange}
                                                                            handleStyle={[this.rangeMarkerStyle,this.rangeMarkerStyle]}
                                                                            trackStyle={[this.trackStyle]}
                                                                            value={this.state.job.requiredEmployees}
                                                                            tipFormatter={value => `${value}`}
                                                                            className={"rangeSlider"}/>
                                                                    </div>
                                                                    <span className={"lblWorkers"}>
                                                                {(this.state.job.requiredEmployees ? this.state.job.requiredEmployees : 0) + " "}
                                                                        {strings.stringsJobPopup.LBL_WORKER + (this.state.job.requiredEmployees && this.state.job.requiredEmployees > 1 ? "s" : "")}
                                                            </span>
                                                                </Wrapper>
                                                            }
                                                        </div>
                                                    </Col>
                                                </Row>
                                            </Col>



                                            <Col xs={12} className={"box"} onClick={this.openBox.bind(this,3)}>
                                                <Row>
                                                    <Col xs={1}>
                                                        <img className={"iconWrapperBox"} src={icon_job_time}/>
                                                    </Col>
                                                    <Col xs={11}>
                                                        {strings.stringsJobPopup.box_3.LBL_BOX_TITLE_3}
                                                    </Col>
                                                </Row>
                                            </Col>
                                            <Col xs={12} className={"subBox subBox3"} style={this.state.boxOpened === 3?{display:"block"}:null}>
                                                <Row>
                                                    <Col xs={1}/>
                                                    <Col xs={11}>
                                                        {
                                                            <Wrapper>
                                                                <Row>
                                                                    <Col xs={4}  className={"title"}>
                                                                        <p>{strings.stringsJobPopup.LBL_START_WORK}</p>
                                                                    </Col>
                                                                    <Col xs={4} className={"title"}>
                                                                        <p>{strings.stringsJobPopup.LBL_END_WORK}</p>
                                                                    </Col>
                                                                    <Col xs={4}>&nbsp;</Col>
                                                                </Row>
                                                                <Row>
                                                                    <Col xs={4}>
                                                                        <DatePicker
                                                                            utcOffset="0"
                                                                            dateFormat="DD/MM/YYYY"
                                                                            customInput={<button role={"btnDatePicker"}>{this.state.job.startDate?moment(this.state.job.startDate).format('DD/MM/YYYY'):strings.stringsJobPopup.LBL_CHOOSE_DATE}</button>}
                                                                            selected={moment(this.state.job.startDate)}
                                                                            disabled={this.state.job.status === "active" || this.state.job.status === "archive"}
                                                                            minDate={moment.utc().add(1, "days")}
                                                                            onChange={this.handleChangeDate.bind(this,"startDate")} />
                                                                    </Col>
                                                                    <Col xs={4}>
                                                                        <DatePicker
                                                                            utcOffset="0"
                                                                            dateFormat="DD/MM/YYYY"
                                                                            customInput={<button role={"btnDatePicker"}>{this.state.job.endDate?moment(this.state.job.endDate).format('DD/MM/YYYY'):strings.stringsJobPopup.LBL_CHOOSE_DATE}</button>}
                                                                            selected={moment(this.state.job.endDate)}
                                                                            disabled={this.state.job.status === "active"}
                                                                            minDate={moment.utc().add(1, "days")}
                                                                            onChange={this.handleChangeDate.bind(this,"endDate")} />
                                                                    </Col>
                                                                </Row>
                                                            </Wrapper>
                                                        }
                                                    </Col>
                                                </Row>
                                            </Col>
                                        </Row>

                                    </Col>
                                </Row>
                                <Row>
                                    {this.state.job.status !== constants.JOBS_ARCHIVED &&
                                        <Col xs={12} className={"footer"}>
                                            {
                                                this.state.job.status === constants.JOBS_ACTIVE ?
                                                    <AsyncButton
                                                        className={"btnSaveDraft"}
                                                        loading={this.state.loadingDraft}
                                                        enabled={!this.state.loadingDraft && !this.state.loading}
                                                        textButton={strings.stringsJobPopup.BTN_ARCHIVE}
                                                        spinnerColor={"#000"}
                                                        onClick={this.confirmArchive}/>
                                                    :
                                                    <AsyncButton
                                                        className={"btnSaveDraft"}
                                                        loading={this.state.loadingDraft}
                                                        enabled={!this.state.loadingDraft && !this.state.loading}
                                                        textButton={strings.stringsJobPopup.BTN_SAVE_DRAFT}
                                                        spinnerColor={"#000"}
                                                        onClick={this.saveJob.bind(this,true)}/>
                                            }

                                            <AsyncButton
                                                className={"btnSave"}
                                                loading={this.state.loading}
                                                enabled={!this.state.loadingDraft && !this.state.loading}
                                                textButton={strings.stringsJobPopup.BTN_SAVE}
                                                spinnerColor={"#fff"}
                                                onClick={this.saveJob.bind(this,false)}/>
                                        </Col>
                                    }
                                    {this.state.job.status === constants.JOBS_ARCHIVED &&
                                        <Col xs={12} className={"footer"}>
                                            <AsyncButton
                                                className={"btnCancel"}
                                                loading={this.state.loadingDraft}
                                                enabled={!this.state.loadingDraft && !this.state.loading}
                                                textButton={strings.stringsJobPopup.BTN_CANCEL}
                                                spinnerColor={"#000"}
                                                onClick={this.props.onClosePopup}/>
                                            <AsyncButton
                                                className={"btnRehire"}
                                                loading={this.state.loading}
                                                enabled={!this.state.loadingDraft && !this.state.loading}
                                                textButton={strings.stringsJobPopup.BTN_REHIRE}
                                                spinnerColor={"#fff"}
                                                onClick={this.confirmReHire}/>
                                        </Col>
                                    }
                                </Row>
                            </div>
                    }

                </div>



            </Wrapper>
        )
    }
}

export default Job;
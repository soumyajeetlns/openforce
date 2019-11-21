import React, {Component} from 'react';
import HomeContainer from "../HomeContainer";
import * as strings from "../../../utils/Strings";
import * as utils from "../../../utils/Utils";
import * as jobsFunctions from "../../../functions/JobsFunctions";
import * as css from './Map.css';
import Wrapper from "../../wrapper/Wrapper";
import {compose, withProps, withStateHandlers} from "recompose"
import {GoogleMap, Marker, withGoogleMap, withScriptjs, InfoWindow, OverlayView} from "react-google-maps"
import JobItem from "../jobs/JobItem";
import {Col, Row} from "react-flexbox-grid";
import JobItemOverlay from "./JobItemOverlay";
import * as constants from "../../../utils/Constants";
import Rightbar from "./Rightbar";
import EmployeePopup from "./employeePopup/EmployeePopup";
import {connect} from "react-redux";
import BaloonLocationJob from "./BaloonLocationJob";
import * as employerFuctions from '../../../functions/EmployerFunctions';
import * as mapStyles from './mapStyle';
import HiredEmployeePopup from "./employeePopup/HiredEmployeePopup";
import AsyncButton from "../../asyncButton/AsyncButton";
import Popup from "../../popup/Popup";

const getPixelPositionOffset = (width, height) => ({
    x: -(width + 150),
    y: -(height / 2),
})
const defaultMapOptions = {
    styles: mapStyles,
    streetViewControl: false,
    scaleControl: false,
    mapTypeControl: false,
    panControl: false,
    zoomControl: false,
    rotateControl: false,
    fullscreenControl: false,
    draggable: false,

};
const MyMapComponent = compose(
    withProps({
        googleMapURL: "https://maps.googleapis.com/maps/api/js?key=" + constants.GOOGLE_MAPS_API_KEY + "&libraries=places",
        loadingElement: <div style={{height: '100%'}}/>,
        containerElement: <div className={"MapBodyDiv"} style={{height: '850px'}}/>,
        mapElement: <div style={{height: '100%'}}/>,
    }),
    withScriptjs,
    withGoogleMap,
    withStateHandlers(() => ({
        isOpen: false,
        isArchiveOpened:false,
        loadingArchiveJob:false

    }), {
        onToggleOpen: ({isOpen}) => () => ({
            //isOpen: !isOpen,
        }),
    }),
)((props) =>
    <GoogleMap
        defaultZoom={16}
        defaultCenter={{lat: props.job.latitude, lng: props.job.longitude}}
        options={defaultMapOptions}>
        {
            <OverlayView
                key={Math.random()}
                position={{lat: props.job.latitude, lng: props.job.longitude}}
                mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}>
                <BaloonLocationJob address={props.job.address} onClick={props.onToggleOpen}/>
            </OverlayView>
        }

        <OverlayView onCloseClick={props.onToggleOpen}
                     position={{lat: props.job.latitude, lng: props.job.longitude}}
                     mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
                     getPixelPositionOffset={getPixelPositionOffset}>
            <Row><JobItemOverlay hoc={props.job} onArchiveOpen={props.onArchiveOpen} onArchiveClosed={props.onArchiveClose} /></Row>
        </OverlayView>
        {props.children}
    </GoogleMap>
)

class Map extends Component {
    constructor(args) {
        super(args);
        this.state = {
            job: null,
            sectionTitle: strings.stringsJobMap.LBL_HIRED,
            loadingApplications: false,
            employeePopupOpened: false,
            hiredEmployeePopupOpened: false,
            swipeClass: null,
            rightBarOptions: {
                visible: false,
                loadingOtherItems: false
            },
            confirmEndJobPopup: false,
            selectedEmployee: {}, //the employee selected from the right bar
            loadingArchiveJob:false,
            archiveOpened:false,
        }
    }

    componentDidMount = () => {
        if (this.props.match.params.id) {
            const jobID = this.props.match.params.id;
            jobsFunctions.getJobsById(jobID, true, (job, paymentReqCount) => {
                const tempState = utils.deepCopy(this.state);
                tempState.job = job;
                tempState.isPayment = false;
                tempState.job.paymentReqCount = paymentReqCount;
                console.log(tempState.job.paymentReqCount);
                this.setState(tempState);
            }, () => {
                this.props.history.push(constants.NOT_FOUND_PAGE)
            });
        } else {
            //404:
            this.props.history.push(constants.NOT_FOUND_PAGE)
        }
    }

    chooseTab = (sectionTitle, status) => {
        const tempState = utils.deepCopy(this.state);
        if (tempState.job) {
            if (!tempState.rightBarOptions.visible || tempState.sectionTitle !== sectionTitle) {
                tempState.rightBarOptions.visible = true;
            } else {
                tempState.rightBarOptions.visible = false;
            }
            tempState.sectionTitle = sectionTitle;
            tempState.rightBarOptions.loadingOtherItems = true;
            tempState.loadingApplications = true;

            if(sectionTitle == strings.stringsJobMap.LBL_PAYMENT){
                this.setState(tempState, () => {
                    jobsFunctions.getPaymentRequest(tempState.job.id, status, (employees) => {
                        const tempState = utils.deepCopy(this.state);
                        console.log(JSON.stringify(employees));
                        tempState.job.applications = employees;
                        tempState.rightBarOptions.loadingOtherItems = false;
                        tempState.loadingApplications = false;
                        tempState.isPayment = true;
                        this.setState(tempState);
                    });
                });
            }else{
                this.setState(tempState, () => {
                    jobsFunctions.getApplyForJobByStatus(tempState.job.id, status, (employees) => {
                        const tempState = utils.deepCopy(this.state);
                        tempState.job.applications = employees;
                        tempState.rightBarOptions.loadingOtherItems = false;
                        tempState.loadingApplications = false;
                        tempState.isPayment = false;
                        this.setState(tempState);
                    });
                });

            }


        }

    }

    onOpenEmployeePopup = (employeeID) => {

        if(this.state.isPayment==false){
            const tempState = utils.deepCopy(this.state);
            tempState.employeePopupOpened = true;
            if (tempState.job.applications) {
                const employeeApply = tempState.job.applications.find((apply) => apply.uid === employeeID);
                if (employeeApply && employeeApply.user) {
                    tempState.selectedEmployee = employeeApply.user;
                }
            }
            this.setState(tempState);
        }

    }

    onCloseEmployeePopup = () => {
        const tempState = utils.deepCopy(this.state);
        tempState.employeePopupOpened = false;
        this.setState(tempState);
    }

    onOpenHiredEmployeePopup = (employeeID) => {
        if(this.state.isPayment==false){
            const tempState = utils.deepCopy(this.state);
            tempState.hiredEmployeePopupOpened = true;
            if (tempState.job.applications) {
                const employeeApply = tempState.job.applications.find((apply) => apply.uid === employeeID);
                if (employeeApply && employeeApply.user) {
                    tempState.selectedEmployee = employeeApply.user;
                }
            }
            this.setState(tempState);
        }

    }

    onCloseHiredEmployeePopup = () => {
        const tempState = utils.deepCopy(this.state);
        tempState.hiredEmployeePopupOpened = false;
        this.setState(tempState);
    }

    onNextAppliedEmployee = () => {
        const tempState = utils.deepCopy(this.state);
        tempState.swipeClass = "transition-slide-right";
        tempState.selectedEmployee = tempState.job.applications[this.getCurrentEmployeeIndex() + 1].user;
        this.setState(tempState);
    }
    onPrevAppliedEmployee = () => {
        const tempState = utils.deepCopy(this.state);
        tempState.swipeClass = "transition-slide-left";
        tempState.selectedEmployee = tempState.job.applications[this.getCurrentEmployeeIndex() - 1].user;
        this.setState(tempState);
    }
    getCurrentEmployeeIndex = () => {
        const tempState = utils.deepCopy(this.state);
        if (tempState.job.applications && tempState.job.applications.length > 0 && tempState.selectedEmployee) {
            //get the index of current selected employee:
            return tempState.job.applications.findIndex((apply) => apply.uid === tempState.selectedEmployee.uid);
        }
    }

    setStatusEmployee = (hire, jobId, employeeUID) => {
        const tempState = utils.deepCopy(this.state);
        tempState.selectedEmployee.employeeLoading = true;

        this.setState(tempState, () => {
            if (hire) {
                employerFuctions.hireEmployee(jobId, employeeUID, () => {
                    tempState.selectedEmployee.employeeLoading = false;
                    this.setState(tempState, () => {
                        this.onHiredOrDismissedEmployee();
                    });
                }, (error) => {
                    tempState.selectedEmployee.employeeLoading = false;
                    this.setState(tempState)
                    console.log(error);
                });
            } else {
                employerFuctions.dismissEmployee(jobId, employeeUID, () => {
                    tempState.selectedEmployee.employeeLoading = false;
                    this.setState(tempState, () => {
                        this.onHiredOrDismissedEmployee();
                    });
                }, (error) => {
                    tempState.selectedEmployee.employeeLoading = false;
                    this.setState(tempState)
                    console.log(error);
                });
            }
        });
    }

    onHiredOrDismissedEmployee = () => {
        //go to the next employee, if any, otherwise I'll go to the previous. if there isn't any prev,then I will close the modal:
        const tempState = utils.deepCopy(this.state);
        let currentEmployeeIndex = this.getCurrentEmployeeIndex();
        if (currentEmployeeIndex < tempState.job.applications.length - 1) {
            currentEmployeeIndex++;
            tempState.selectedEmployee = tempState.job.applications[currentEmployeeIndex].user;
        } else if (currentEmployeeIndex > 0) {
            currentEmployeeIndex--;
            tempState.selectedEmployee = tempState.job.applications[currentEmployeeIndex].user;
        } else {
            tempState.employeePopupOpened = false;
        }
        this.setState(tempState);
    }

    showConfirmEndJob = (employeeId, rate) => {
        const tempState = utils.deepCopy(this.state);
        tempState.hiredEmployeePopupOpened = false;
        tempState.confirmEndJobPopup = true;
        tempState.selectedEmployee.infosFromHiredEmployeeViewForEndJob = {};
        tempState.selectedEmployee.infosFromHiredEmployeeViewForEndJob.employeeId = employeeId;
        tempState.selectedEmployee.infosFromHiredEmployeeViewForEndJob.rate = rate;
        this.setState(tempState);
    }

    hideShowConfirmEndJob = (shouldHideHiredPopup, finalStep) => {
        const tempState = utils.deepCopy(this.state);
        tempState.hiredEmployeePopupOpened = !shouldHideHiredPopup;
        tempState.confirmEndJobPopup = !finalStep;
        this.setState(tempState);
    }

    endJobFinal = () => {
        const tempState = utils.deepCopy(this.state);
        if (tempState.selectedEmployee && tempState.selectedEmployee && tempState.selectedEmployee.infosFromHiredEmployeeViewForEndJob) {
            const jobID = this.props.match.params.id;
            const employeeId = tempState.selectedEmployee.infosFromHiredEmployeeViewForEndJob.employeeId;
            tempState.loadingEndJob = true;
            this.setState(tempState, () => {
                jobsFunctions.endJob(jobID, employeeId, () => {
                    tempState.hiredEmployeePopupOpened = true;
                    tempState.confirmEndJobPopup = false;
                    tempState.loadingEndJob = false;
                    this.setState(tempState);
                }, (error) => {
                    tempState.hiredEmployeePopupOpened = true;
                    tempState.confirmEndJobPopup = false;
                    tempState.loadingEndJob = false;
                    this.setState(tempState);
                });
            });

        }
    }

    onArchiveOpen = () =>{
        const tempState = utils.deepCopy(this.state);
        tempState.archiveOpened = true;
        this.setState(tempState)
    }

    onArchiveClose = () =>{
        const tempState = utils.deepCopy(this.state);
        tempState.archiveOpened = false;
        this.setState(tempState)
    }

    archiveJob = () =>{
        const tempState = utils.deepCopy(this.state);
        tempState.loadingArchiveJob = true;
        this.setState(tempState,()=>{
            const jobId =  tempState.job.id;
            jobsFunctions.archiveJob(jobId,()=>{
                tempState.loadingArchiveJob = false;
                tempState.archiveOpened = false;
                this.setState(tempState,()=>{
                    this.props.history.push(constants.HOME)
                });
            },()=>{
                tempState.loadingArchiveJob = false;
                this.setState(tempState);
            })
        })
    }

    render() {
        return (
            <div className={"mapContainer"}>

                {this.state.archiveOpened &&
                <Wrapper>
                    <div className={"myShadow"}/>
                    <Popup
                        titleText={strings.stringsJobMap.POPUP_CONFIRM_END_JOB_TITLE}
                        bodyText={strings.stringsJobMap.POPUP_CONFIRM_END_JOB_BODY}
                        loading={this.state.loadingArchiveJob}
                        onConfirmClick={this.archiveJob}
                        width={550}
                        height={330}
                        onDeclineClick={this.onArchiveClose}/>
                </Wrapper>}


                {this.state.job &&
                <MyMapComponent job={this.state.job} onArchiveOpen={this.onArchiveOpen} onArchiveClose={this.onArchiveClose}>
                    <button className={"btnBack"} onClick={() => this.props.history.push(constants.HOME)}>
                        <i className="material-icons">
                            arrow_back
                        </i>
                    </button>

                    {this.state.rightBarOptions.visible &&
                    <Rightbar
                        loadingOtherItems={this.state.rightBarOptions.loadingOtherItems}
                        sectionTitle={this.state.sectionTitle}
                        loading={this.state.loadingApplications}
                        payment={this.state.isPayment}
                        onOpenEmployeePopup={this.onOpenEmployeePopup}
                        onOpenHiredEmployeePopup={this.onOpenHiredEmployeePopup}
                        applications={this.state.job.applications}/>}

                    {this.state.employeePopupOpened ?
                        <EmployeePopup
                            employee={this.state.selectedEmployee}
                            job={this.state.job}
                            loading={this.state.selectedEmployee.employeeLoading}
                            onNextAppliedEmployee={this.onNextAppliedEmployee}
                            onPrevAppliedEmployee={this.onPrevAppliedEmployee}
                            swipeClass={this.state.swipeClass}
                            haveNext={this.state.job.applications ? this.getCurrentEmployeeIndex() < this.state.job.applications.length - 1 : false}
                            havePrev={this.getCurrentEmployeeIndex() > 0}
                            hireEmployee={this.setStatusEmployee.bind(this, true, this.state.job.id, this.state.selectedEmployee.uid)}
                            dismissEmployee={this.setStatusEmployee.bind(this, false, this.state.job.id, this.state.selectedEmployee.uid)}
                            onCloseEmployeePopup={this.onCloseEmployeePopup}/>
                        :
                        this.state.hiredEmployeePopupOpened ?
                            <HiredEmployeePopup
                                employee={this.state.selectedEmployee}
                                job={this.state.job}
                                onNextAppliedEmployee={this.onNextAppliedEmployee}
                                onPrevAppliedEmployee={this.onPrevAppliedEmployee}
                                swipeClass={this.state.swipeClass}
                                haveNext={this.getCurrentEmployeeIndex() < this.state.job.applications.length - 1}
                                havePrev={this.getCurrentEmployeeIndex() > 0}
                                confirmEndJob={this.showConfirmEndJob}
                                onCloseHiredEmployeePopup={this.onCloseHiredEmployeePopup}/>
                            :
                            this.state.confirmEndJobPopup ?
                                <div className={"wrapperConfirmEndJob"}>
                                    <div className={"body"}>
                                        <p className={"title"}>{strings.stringsJobMap.POPUP_CONFIRM_END_JOB_TITLE}</p>
                                        <p className={"textBody"}>{strings.stringsJobMap.POPUP_CONFIRM_END_JOB_BODY}</p>
                                        <div className={"wrapperButtons"}>
                                            <AsyncButton
                                                loading={this.state.loadingEndJob}
                                                textButton={"Yes"}
                                                onClick={this.endJobFinal}/>
                                            <button disabled={this.state.loadingEndJob}
                                                    onClick={this.hideShowConfirmEndJob.bind(this, false, false)}>No
                                            </button>
                                        </div>
                                    </div>
                                </div>
                                : null
                    }
                    <div className={"footer"}>
                        <Row>
                            <Col xs={2} xsOffset={6}
                                 className={this.state.sectionTitle === strings.stringsJobMap.LBL_APPLIED ? "tab active" : "tab"}
                                 onClick={this.chooseTab.bind(this, strings.stringsJobMap.LBL_APPLIED, constants.STATUS_EMPLOYEE_APPLIED)}>
                                <Row>
                                    <Col xs={2}>

                                    </Col>
                                    <Col xs={8}>
                                        <div className={"labelDynamic"}>{this.state.job.applied}</div>
                                        <div className={"label"}>{strings.stringsJobMap.LBL_APPLIED}</div>
                                    </Col>
                                </Row>
                            </Col>
                            <Col xs={2}
                                 className={this.state.sectionTitle === strings.stringsJobMap.LBL_HIRED ? "tab active" : "tab"}
                                 onClick={this.chooseTab.bind(this, strings.stringsJobMap.LBL_HIRED, constants.STATUS_EMPLOYEE_HIRED)}>
                                <Row>
                                    <Col xs={2}>

                                    </Col>
                                    <Col xs={8}>
                                        <div className={"labelDynamic"}>{this.state.job.hired}</div>
                                        <div className={"label"}>{strings.stringsJobMap.LBL_HIRED}</div>
                                    </Col>
                                </Row>
                            </Col>
                            <Col xs={2}
                                 className={this.state.sectionTitle === strings.stringsJobMap.LBL_PAYMENT ? "tab active" : "tab"}
                                 onClick={this.chooseTab.bind(this, strings.stringsJobMap.LBL_PAYMENT, constants.STATUS_EMPLOYEE_HIRED)}>
                                <Row>
                                    <Col xs={2}>

                                    </Col>
                                    <Col xs={8}>
                                        <div className={"labelDynamic"}>{this.state.job.paymentReqCount}</div>
                                        <div className={"label"}>{strings.stringsJobMap.LBL_PAYMENT}</div>
                                    </Col>
                                </Row>
                            </Col>
                        </Row>
                    </div>
                </MyMapComponent>}

            </div>
        )
    }
}

const mapStateToProps = state => {
    return {
        ctr: state
    }
}
const mapDispatchToProps = dispatch => {
    return {
        getJobRoles: () => {
            dispatch({type: constants.REDUX_GET_JOB_ROLES_STATE})
        },
        getEmployer: () => {
            dispatch({type: constants.REDUX_GET_USER_EMPLOYER_STATE})
        }
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(Map);
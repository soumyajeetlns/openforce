import * as css from './HiredEmployeePopup.css';
import {Row, Col} from "react-flexbox-grid";
import StarRatings from 'react-star-ratings';
import * as localization from "../../../../utils/Strings";
import * as utils from "../../../../utils/Utils";
import React, {Component} from 'react';
import * as chatFunctions from "../../../../functions/ChatFunctions";
import BaloonLocationJob from "../BaloonLocationJob";
import ChatBaloon from "../../chat/ChatBaloon";

import approveIcon from '../../../../assets/img/approve-icon.svg';
import endJobIcon from '../../../../assets/img/end-job-icon.svg';
import autoApproveIcon from '../../../../assets/img/auto-approve-icon.svg';
import autoApproveIconOff from '../../../../assets/img/auto-approve-icon-off.svg';
import * as checkinFunctions from "../../../../functions/CheckinFunctions";
import * as jobsFunctions from "../../../../functions/JobsFunctions";
import moment from "moment/moment";
import Wrapper from "../../../wrapper/Wrapper";
import Loader from "../../../loader/Loader";
import InfiniteScroll from 'react-infinite-scroller';
import * as constants from "../../../../utils/Constants";
import EmployeeRating from './employeeRating/EmployeeRating'

class HiredEmployeePopup extends Component {
    constructor(args) {
        super(args);
        this.state = {
            chat:{},
            endJobClicked:false,
            ratingEndJob:0,
            apply:{},
            loadingCheckins:false,
            loadingChat:false,
            lastChatsLoaded:null,
            generalLoader:false
        }
    }

    componentDidMount = () =>{
       this.loadApply();
    }

    loadApply = () =>{
        const tempState = utils.deepCopy(this.state);
        const employerID = this.props.job.employerID;
        const employeeID = this.props.employee.uid;
        const jobID = this.props.job.id;
        tempState.loadingCheckins = true;
        tempState.loadingChat = true;

        //clear checkins and chats:
        tempState.chat = null;
        if(tempState.apply)tempState.apply.checkins = null;

        this.setState(tempState,()=>{
            jobsFunctions.getApplyByJob(employerID, employeeID, jobID, 0, (apply)=>{
                tempState.apply = apply;
                tempState.loadingCheckins = false;
                this.setState(tempState,()=>{
                    this.loadChats(tempState);
                });
            });
        });
    }

    componentWillReceiveProps = () =>{
        this.loadApply();
    }

    loadChats = (tempState) =>{
        const employerID = this.props.job.employerID;
        const employeeID = this.props.employee.uid;
        const jobID = this.props.job.id;
        this.setState(tempState,()=>{
            chatFunctions.getChatByJob(employerID,employeeID,jobID, null ,(chat)=>{
                tempState.chat = chat;
                //tempState.lastChatsLoaded = chat.lastSnapShot;
                tempState.loadingChat = false;
                this.setState(tempState);
            });
        });
    }

    rateEmployee = () =>{
        const tempState = utils.deepCopy(this.state);
        //todo
        this.setState(tempState)
    }

    endJobStep1 = () =>{
        const tempState = utils.deepCopy(this.state);
        const employeeID = this.props.employee.uid;
        this.props.confirmEndJob(employeeID,tempState.ratingEndJob);
    }

    changeRatingEndJob = (newRating) =>{
        const tempState = utils.deepCopy(this.state);
        tempState.ratingEndJob = newRating;
        this.setState(tempState)
    }

    approveAllCheckins = () =>{
        const tempState = utils.deepCopy(this.state);
        const hocApply = tempState.apply;
        tempState.generalLoader = true;

        this.setState(tempState,()=>{
            jobsFunctions.approveAllCheckins(hocApply, (checkInsUpdated)=>{
                if(tempState.apply && tempState.apply.checkins){
                    //search the updated hoc and change the flag:
                    if(checkInsUpdated){
                        checkInsUpdated.forEach((updatedHoc)=>{
                            tempState.apply.checkins.forEach((checkInState, index)=>{
                                if(checkInState.id === updatedHoc.id){
                                    tempState.apply.checkins[index] = updatedHoc;
                                }
                            })
                        })

                    }
                }
                tempState.generalLoader = false;
                this.setState(tempState);
                //todo: message done
            },(error)=>{
                tempState.generalLoader = false;
                this.setState(tempState);
            });
        })
    }

    setAutoApprove = () =>{
        const tempState = utils.deepCopy(this.state);
        const employeeID = this.props.employee.uid;
        const jobID = this.props.job.id;
        const autoApprove = !tempState.apply.autoApprove;
        tempState.generalLoader = true;

        this.setState(tempState,()=>{
            jobsFunctions.setAutoApprove(jobID, employeeID, autoApprove,()=>{
                tempState.apply.autoApprove = autoApprove;
                tempState.generalLoader = false;
                this.setState(tempState)
            },(error)=>{
                tempState.generalLoader = false;
                this.setState(tempState)
            });
        })

    }

    onSuccessfullyRating = () =>{
        const tempState = utils.deepCopy(this.state);
        tempState.apply.employerHasReviewed = true;
        this.setState(tempState)
    }

    render() {
        return (
            <div className={"employeePopupWrapper"}>

                <button className={"btnClose"} onClick={this.props.onCloseHiredEmployeePopup.bind(true)}>
                    <i className="material-icons">
                        close
                    </i>
                </button>
                <div className={"hiredEmployeePopupBody " + this.props.swipeClass}>
                    <Loader loading={this.state.generalLoader}/>
                    <div className={"left"}>
                        <div className={"header"}>
                            <img
                                className={"profileImg"}
                                src={this.props.employee.profileImg}/>

                            <div className={"infoEmployee"} style={{verticalAlign:"bottom"}}>
                                <div className={"employeeName"}>
                                    {this.props.employee.firstName + " " + this.props.employee.lastName}
                                </div>
                                <div className={"rating"}>
                                    <StarRatings
                                        rating={this.props.employee.rating}
                                        starRatedColor="black"
                                        numberOfStars={5}
                                        starDimension="10px"
                                        starSpacing="2px"
                                        name='rating'/>
                                    {"  " + this.props.employee.rating}
                                </div>
                            </div>

                            <div className={"wrapperIcons"}>
                                <div className={"infoEmployee"}>
                                    <p className={"lblRate"}>{localization.stringsHiredEmployeePopup.LBL_RATE}</p>
                                    <p className={"rate"}>{this.props.job.jobRole.dailyPay}</p>
                                </div>

                                {this.state.apply && !this.state.apply.ended &&
                                    <Wrapper>
                                        <div className={"infoEmployee center"} onClick={this.setAutoApprove}>
                                            <img src={this.state.apply.autoApprove?autoApproveIconOff:autoApproveIcon} className={"icon"}/>
                                            <p className={"lblRate"}>{localization.stringsHiredEmployeePopup.LBL_AUTO_APPROVE}</p>
                                        </div>

                                        <div className={"infoEmployee center"} onClick={this.approveAllCheckins}>
                                            <img src={approveIcon} className={"icon"}/>
                                            <p className={"lblRate"}>{localization.stringsHiredEmployeePopup.LBL_APPROVE}</p>
                                        </div>

                                        <div className={"infoEmployee center"}>
                                            <img src={endJobIcon} className={"icon"} onClick={this.endJobStep1}/>
                                            <p className={"lblRate"}>{localization.stringsHiredEmployeePopup.LBL_END_JOB}</p>
                                        </div>
                                    </Wrapper>
                                }
                            </div>

                        </div>
                        <div className={"wrapperCheckins"}>
                            <Row className={"headerCheckins aligned-left"}>
                                <Col xs={3}>
                                    {localization.stringsHiredEmployeePopup.TABLE.LBL_DATE}
                                </Col>
                                <Col xs={3}>
                                    {localization.stringsHiredEmployeePopup.TABLE.LBL_CHECKIN}
                                </Col>
                                <Col xs={4}>
                                    {localization.stringsHiredEmployeePopup.TABLE.LBL_STATUS}
                                </Col>
                                <Col xs={2}>&nbsp;</Col>
                            </Row>
                            <Wrapper>
                                <Loader className={"customLoader"} loading={this.state.loadingCheckins}/>
                                {
                                    this.state.apply && this.state.apply.checkins && this.state.apply.checkins.map((checkin,index)=>
                                        <Row key={index} className={index%2===0?"aligned-left checkin gray-striped":"aligned-left checkin"}>
                                            <Col xs={3}>{checkin.date}</Col>
                                            <Col xs={3}>{moment(checkin.timestamp).format('HH:mm')}</Col>
                                            <Col xs={4}>{checkin.approved?localization.stringsHiredEmployeePopup.LBL_APPROVED:localization.stringsHiredEmployeePopup.LBL_NOT_APPROVED}</Col>
                                            <Col xs={2}>&nbsp;</Col>
                                        </Row>
                                    )
                                }
                            </Wrapper>

                        </div>
                    </div>

                    <div className={"right"}>
                        {
                            this.state.apply && this.state.apply.ended && !this.state.apply.employerHasReviewed?
                                <EmployeeRating
                                    employee={this.props.employee}
                                    jobId={this.state.apply.jobId}
                                    onSuccessfullyRating={this.onSuccessfullyRating}/>
                            :

                            <Wrapper>
                                <Loader className={"customLoader"} loading={this.state.loadingChat}/>
                                {this.state.chat && this.state.chat.messages && this.state.chat.messages.map((message)=>
                                    <ChatBaloon key={message.timestamp} message={message} fromEmployer={message.senderId === this.props.job.employerID}/>
                                )}
                            </Wrapper>
                        }
                    </div>


                    <button className={this.props.havePrev && !this.state.loadingChat && !this.state.loadingCheckins?"btnMove prev":"btnMove prev disabled-button"}
                            onClick={this.props.onPrevAppliedEmployee} disabled={!this.props.havePrev || this.state.loadingChat || this.state.loadingCheckins}>
                        <i className="material-icons">
                            chevron_left
                        </i>
                    </button>
                    <button className={this.props.haveNext && !this.state.loadingChat && !this.state.loadingCheckins?"btnMove next":"btnMove next disabled-button"}
                            onClick={this.props.onNextAppliedEmployee} disabled={!this.props.haveNext || this.state.loadingChat || this.state.loadingCheckins}>
                        <i className="material-icons">
                            chevron_right
                        </i>
                    </button>
                </div>
            </div>
        )
    }
}


export default HiredEmployeePopup;

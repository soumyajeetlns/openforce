import * as css from './EmployeePopup.css';
import {Row, Col} from "react-flexbox-grid";
import StarRatings from 'react-star-ratings';
import * as localization from "../../../../utils/Strings";
import profileCover from '../../../../assets/img/cover_img.jpg';

import React, {Component} from 'react';
import Loader from "../../../loader/Loader";
import * as constants from "../../../../utils/Constants";
import * as utils from "../../../../utils/Utils";
import * as jobsFunctions from "../../../../functions/JobsFunctions";
import LastEmployeeJobs from "./LastEmployeeJobs";



class EmployeePopup extends Component {
    constructor(args) {
        super(args);
        this.state = {
            lastEmployeeJob:[]
        }
    }

    getRate = (skillsOfEmployee, jobRole) =>{
        if(skillsOfEmployee){
            const tempSkills = skillsOfEmployee.filter((skill)=> {return skill.id === jobRole.id});
            if(tempSkills && tempSkills.length>0){
                return tempSkills[0].payRate;
            }
        }
    }
    getJobDays = (job) =>{
        //exclude sat and sun:
        if(job && job.startDate && job.endDate){
            return utils.workingDaysBetweenDates(new Date(job.startDate),new Date(job.endDate));
        }
        return 0;
    }

    componentWillReceiveProps = () => {
        const tempState = utils.deepCopy(this.state);
        jobsFunctions.getLastEmployeeJobs(this.props.employee.uid, this.props.job.id,(lastJobs)=>{
            if(lastJobs && lastJobs.jobs) {
                tempState.lastEmployeeJob = lastJobs.jobs
                this.setState(tempState);
            };
        });
    }

    render() {
        return (
            <div className={"employeePopupWrapper"}>
                <button className={"btnClose"} onClick={this.props.onCloseEmployeePopup}>
                    <i className="material-icons">
                        close
                    </i>
                </button>
                <div className={"employeePopupBody"}>
                    <Loader loading={this.props.loading}/>

                    <div className={"left"}>
                        <div className={"profile"}>
                        <Col xs={12} className={"profileBox"} style={{backgroundImage: `url(${profileCover})`}}>
                        <Col xs={2}><img src={this.props.employee.profileImg}/></Col>
                        <Col xs={9} className={"employeeNameDiv"}><div className={"employeeName"}>
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
                            </div></Col>
                            </Col>
                            <div className={"MyProfileBoxs"}>
                            <Col xs={6} className={"CscsCardDiv"}>
                                <div className={"CardInner"}>
                                
                                </div>
                                <div className={"CardInnerName"}>
                                CSCS Card
                                </div>
                            </Col>
                            <Col xs={6} className={"ResumeDiv"}> 
                            <div className={"CardInner"}>
                                
                                </div>
                                <div className={"CardInnerName"}>
                                Resume
                                </div>
                            </Col>
                            </div>
                        </div>
                        <Col xs={12} className="MobileSlideBtn hidden-lg hidden-md">
                        <button className={this.props.havePrev?"btnMove prev":"btnMove prev disabled-button"} onClick={this.props.onPrevAppliedEmployee}
                            disabled={!this.props.havePrev || this.props.loading}>
                        <i className="material-icons">
                            chevron_left
                        </i>
                        </button>
                        <button className={this.props.haveNext?"btnMove next":"btnMove next disabled-button"} onClick={this.props.onNextAppliedEmployee}
                            disabled={!this.props.haveNext || this.props.loading}>
                        <i className="material-icons">
                            chevron_right
                        </i>
                        </button>
                    </Col> 
                    <Col xs={12}>
                    {this.props.job.status === constants.JOBS_ACTIVE &&
                            <div className={"containerBtnOperations hidden-xl hidden-md"}>
                                <button className={"btnOperations decline"} onClick={this.props.dismissEmployee}
                                        disabled={this.props.loading}>
                                    <i className="material-icons">
                                        close
                                    </i>
                                </button>
                                <button className={"btnOperations accept"} onClick={this.props.hireEmployee}
                                        disabled={this.props.loading}>
                                    <i className="material-icons">
                                        done
                                    </i>
                                </button>
                            </div>
                        }
                    </Col>                                    
                    </div>
                    <div className={"right"}>
                    <div className={"sectionContainer"}>
                    <p className={"lblTitle HistoryTop"}>History</p>
                        <LastEmployeeJobs jobs={this.state.lastEmployeeJob} />
                        </div>
                        <div className={"sectionContainer"}>
                            
                            <p className={"lblTitle"}>{localization.stringsEmployeePopup.LBL_SKILLS}</p>
                            {this.props.employee.skills ? this.props.employee.skills.map((skill, index) =>
                                    <button className={"baloonRole"} key={skill.id}>{skill.name}</button>
                                )
                                : "-"}
                        </div>
                        
                        <div className={"sectionContainer RateSection"}>
                            <p className={"lblTitle"}>{localization.stringsEmployeePopup.LBL_RATE}</p>
                            <Row style={{marginTop: "22px"}}>
                                <Col xs={3} className={"lblTitleRating"}>
                                    {localization.stringsEmployeePopup.LBL_DAY_RATE}
                                </Col>
                                <Col xs={3} className={"lblTitleRating"}>
                                    {localization.stringsEmployeePopup.LBL_PROJECT_RATE}
                                </Col>
                                <Col xs={3} className={"lblTitleRating rightText"}>
                                    {localization.stringsEmployeePopup.LBL_OF_RATE}
                                </Col>
                                <Col xs={3} className={"lblTitleRating rightText"}>
                                    {localization.stringsEmployeePopup.LBL_TOTAL_COST}
                                </Col>
                                <Col xs={3}>
                                    {this.getRate(this.props.employee.skills, this.props.job.jobRole)}
                                </Col>
                                <Col xs={3} className={"rightText"}>
                                    {(((this.getRate(this.props.employee.skills, this.props.job.jobRole) * this.getJobDays(this.props.job)) / 100) * constants.DEFAULT_OF_RATE) +
                                    this.getRate(this.props.employee.skills, this.props.job.jobRole) * this.getJobDays(this.props.job)}
                                </Col>
                                <Col xs={3} className={"rightText"}>
                                    -{constants.DEFAULT_OF_RATE}%
                                </Col>
                                <Col xs={3} className={"rightText"}>
                                    {this.getRate(this.props.employee.skills, this.props.job.jobRole) * this.getJobDays(this.props.job)}
                                </Col>
                            </Row>
                        </div>

                        {this.props.job.status === constants.JOBS_ACTIVE &&
                            <div className={"containerBtnOperations hidden-xs"}>
                                <button className={"btnOperations decline"} onClick={this.props.dismissEmployee}
                                        disabled={this.props.loading}>
                                    <i className="material-icons">
                                        close
                                    </i>
                                </button>
                                <button className={"btnOperations accept"} onClick={this.props.hireEmployee}
                                        disabled={this.props.loading}>
                                    <i className="material-icons">
                                        done
                                    </i>
                                </button>
                            </div>
                        }

                    </div>

                    <div className={"hidden-xs"}>
                    <button className={this.props.havePrev?"btnMove prev":"btnMove prev disabled-button"} onClick={this.props.onPrevAppliedEmployee}
                            disabled={!this.props.havePrev || this.props.loading}>
                        <i className="material-icons">
                            chevron_left
                        </i>
                    </button>
                    <button className={this.props.haveNext?"btnMove next":"btnMove next disabled-button"} onClick={this.props.onNextAppliedEmployee}
                            disabled={!this.props.haveNext || this.props.loading}>
                        <i className="material-icons">
                            chevron_right
                        </i>
                    </button>
                    </div>
                </div>
            </div>
        )
    }
}



export default EmployeePopup;

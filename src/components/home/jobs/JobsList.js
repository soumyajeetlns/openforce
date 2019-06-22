import React, {Component} from 'react';
import HomeContainer from "../HomeContainer";
import * as strings from "../../../utils/Strings";
import * as utils from "../../../utils/Utils";
import * as jobsFunctions from "../../../functions/JobsFunctions";
import * as css from './JobsList.css';
import Wrapper from "../../wrapper/Wrapper";
import Loader from "../../loader/Loader";
import Job from "./Job";
import {connect} from "react-redux";
import * as constants from "../../../utils/Constants";
import JobItem from "./JobItem";
import {Row} from "react-flexbox-grid";

class JobsList extends Component {
    constructor(args) {
        super(args);
        this.state = {
            section:this.props.match.params.section?this.props.match.params.section:strings.stringsHomeContainer.LBL_ACTIVE,
            jobs:[],
            loading:false,
            jobPopupOpened:false,
            editedJob:null,//this is the selcted job for edit
        }
    }

    createNewJob = () =>{
        const tempState = utils.deepCopy(this.state);
        tempState.editedJob = null;
        tempState.jobPopupOpened = !tempState.jobPopupOpened;
        this.setState(tempState);
    }

    editJob = (indexJob) =>{
        const tempState = utils.deepCopy(this.state);
        tempState.editedJob = tempState.jobs[indexJob];
        tempState.jobPopupOpened = true;
        this.setState(tempState);
    }

    componentWillReceiveProps(nextProps){
        this.getJobsInternal(nextProps);
    }

    componentDidMount = () =>{
        this.getJobsInternal(this.props);
    }

    getJobsInternal = (props) =>{
        const section = props.match.params.section;
        const tempState = utils.deepCopy(this.state);

        if(section && (
            section.toLowerCase() === strings.stringsHomeContainer.LBL_ACTIVE.toLowerCase()
            || section.toLowerCase() === strings.stringsHomeContainer.LBL_ARCHIVE.toLowerCase()
            || section.toLowerCase() === strings.stringsHomeContainer.LBL_DRAFT.toLowerCase())){
            tempState.section = section;
            tempState.loading = true;

            this.setState(tempState,()=>{
                jobsFunctions.getJobsByStatusWithPending(this.props.ctr.user.uid,section, (_jobs)=>{
                    tempState.jobs = _jobs;
                    tempState.loading = false;
                    this.setState(tempState);
                },(e)=>{
                    tempState.loading = false;
                    this.setState(tempState);
                });
            });
        }else{
            this.props.history.push(constants.JOBS + "/" + constants.JOBS_ACTIVE);
        }
    }

    render() {
        return (
            <Wrapper>
                {this.state.jobPopupOpened && <Job onClosePopup={this.createNewJob}
                                                   job={this.state.editedJob}
                                                   employerID = {this.props.ctr.user?this.props.ctr.user.uid:null}
                                                   employerName = {this.props.ctr.user?this.props.ctr.user.companies[0]:null}
                                                   jobRoles={this.props.ctr.jobRoles}/>}
                <HomeContainer selectedTab={this.state.section} onJobAdd={this.createNewJob}>
                    <div className={"wrapperJobs"}>
                        <Loader loading={this.state.loading}/>
                        <div className={this.state.loading?"goneClass":""}>
                        {
                            this.state.jobs.length === 0?
                                <Wrapper>
                                    <p className={"noJobs"}>{this.state.section.toLowerCase() !== "archive"?strings.stringsJobs.LBL_NO_JOBS:strings.stringsJobs.LBL_NO_ARCHIVED_JOBS}</p>

                                    {this.state.section.toLowerCase() !== "archive" &&
                                    <div className={"wrapperBtnAdd"}  onClick={this.createNewJob}>
                                        <button className={"btnAddJob"}>{strings.stringsJobs.BTN_ADD_JOB}</button>
                                    </div>
                                    }

                                </Wrapper>
                            :
                            <Row className={"containerJobs"}>
                                {this.state.jobs.map((el,index)=>
                                    <JobItem key={index} hoc={el} onEdit={this.editJob.bind(this,index)} history={this.props.history}/>
                                )}
                            </Row>

                            
                        }
                        </div>
                    </div>
                </HomeContainer>
            </Wrapper>
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
        }
    }
}
export default  connect(mapStateToProps,mapDispatchToProps)(JobsList);
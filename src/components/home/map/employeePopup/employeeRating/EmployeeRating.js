import * as css from './EmployeeRating.css';
import {Row, Col} from "react-flexbox-grid";
import StarRatings from 'react-star-ratings';
import * as localization from "../../../../../utils/Strings";
import React, {Component} from 'react';
import Loader from "../../../../loader/Loader";
import * as utils from "../../../../../utils/Utils";
import AsyncButton from "../../../../asyncButton/AsyncButton";
import * as jobsFunctions from "../../../../../functions/JobsFunctions";


class EmployeeRating extends Component {
    ratingQuestion = [localization.stringsHiredEmployeePopup.RATING_QUESTION_1,localization.stringsHiredEmployeePopup.RATING_QUESTION_2,
        localization.stringsHiredEmployeePopup.RATING_QUESTION_3,localization.stringsHiredEmployeePopup.RATING_QUESTION_4,
        localization.stringsHiredEmployeePopup.RATING_QUESTION_5];
    constructor(args) {
        super(args);
        this.state = {
            ratingEndJob:[-1,-1,-1,-1,-1],
            selectedRating:0,
            loadingRating:false,
            isSelectable:true,
        }
    }

    changeRatingPage = (rating) =>{
        const tempState = utils.deepCopy(this.state);
        tempState.ratingEndJob[tempState.selectedRating] = rating;
        if(tempState.selectedRating<4) tempState.selectedRating++;
        this.setState(tempState);
    }

    haveUnratedPage = () =>{
        const tempState = utils.deepCopy(this.state);
        let check = false;
        tempState.ratingEndJob.forEach((_rating)=>{
            if(_rating<0) check = true;
        })
        return check;
    }

    saveRating = () =>{
        const tempState = utils.deepCopy(this.state);
        const jobId = this.props.jobId;
        const employeeId = this.props.employee.uid;
        const review1 = tempState.ratingEndJob[0];
        const review2 = tempState.ratingEndJob[1];
        const review3 = tempState.ratingEndJob[2];
        const review4 = tempState.ratingEndJob[3];
        const review5 = tempState.ratingEndJob[4];

        tempState.loadingRating = true;
        tempState.isSelectable = false;
        this.setState(tempState,()=>{
            jobsFunctions.rateEmployeeByApply(jobId, employeeId, review1, review2, review3, review4, review5,()=>{
                tempState.loadingRating = false;
                tempState.isSelectable = false;
                this.setState(tempState,()=>{

                    this.props.onSuccessfullyRating()
                });
            },()=>{
                tempState.loadingRating = false;
                tempState.isSelectable = true;
                this.setState(tempState);
            });
        });
    }

    skipQuestion = () =>{
        this.changeRatingPage(0);
    }

    render() {
        return (
            <div className={"wrapperEndJob"}>
                <p className={"lblEndJob"}>{localization.stringsHiredEmployeePopup.LBL_END_JOB_2 + this.props.employee.firstName + " " + this.props.employee.lastName}</p>
                <div className={"wrapperRating"}>
                    <div>
                        <p className={"lblConfirmRate"}>{this.ratingQuestion[this.state.selectedRating]}</p>
                        <p className={"rating"}>{this.state.selectedRating+1 + "/" + 5}</p>
                    </div>
                    <StarRatings
                        rating={this.state.ratingEndJob[this.state.selectedRating]}
                        starRatedColor="black"
                        disabled={!this.state.isSelectable}
                        numberOfStars={5}
                        changeRating={this.changeRatingPage}
                        starDimension="25px"
                        starSpacing="10px"
                        name='rating'/>

                    <button className={"btnSkipQuestion"} onClick={this.skipQuestion}>
                        {localization.stringsHiredEmployeePopup.BTN_SKIP_QUESTION}
                    </button>
                </div>


                <AsyncButton
                    className={"btnEndJob"}
                    loading={this.state.loadingRating}
                    spinnerColor={"#000"}
                    disabled={this.haveUnratedPage()}
                    textButton={localization.stringsHiredEmployeePopup.BTN_END_JOB}
                    onClick={this.saveRating}/>
            </div>
        )
    }
}
export default EmployeeRating;

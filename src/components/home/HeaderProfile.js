import React, {Component} from 'react';
import {Col, Row} from "react-flexbox-grid";
import {Link} from "react-router-dom";
import * as constants from "../../utils/Constants";
import * as css from './HeaderProfile.css';
import {connect} from "react-redux";
import * as utils from "../../utils/Utils";
import {withRouter} from "react-router";
import {getImageUrlWithDimension} from "../../utils/ImageUtils";

class HeaderProfile extends Component {
    constructor(args) {
        super(args);
        this.state = {
            companyNameProfile:null
        }
    }

    componentDidMount = () =>{
        if(this.props.ctr.user && this.props.ctr.user.companies[0]){
            const tempState = utils.deepCopy(this.state);
            tempState.companyNameProfile = utils.getCompanyNameFormatted(this.props.ctr.user.companies[0]);
            this.setState(tempState);
        }
    }

    getImage = () =>{
        const img = getImageUrlWithDimension(this.props.ctr.user.publicID, 33, 33, 33); ;
        return img;
    }

    render() {
        return (
            <div className={"wrapperProfile"} onClick={()=> this.props.history.push(constants.PROFILE_EMPLOYER)}>
                {
                    this.props.ctr.user && this.props.ctr.user.profileImage?
                        <img className={"profileImg"} src={this.getImage()}/>
                        :
                        <div className={"profileImgPlaceholder"}>
                            {this.state.companyNameProfile}
                        </div>
                }
                <div className={"companyName"}>
                    {this.props.ctr.user?this.props.ctr.user.companies[0]:null}
                </div>
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
        }
    }
}
export default  connect(mapStateToProps,mapDispatchToProps)(withRouter(HeaderProfile));

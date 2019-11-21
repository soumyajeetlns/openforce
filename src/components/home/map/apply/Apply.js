import * as css from './Apply.css';
import {Col, Row} from "react-flexbox-grid";
import moment from 'moment';
import StarRatings from 'react-star-ratings';
import LaddaButton, { XL, EXPAND_LEFT, XS } from 'react-ladda';
import StripeCheckout from 'react-stripe-checkout';
import * as jobsFunctions from "../../../../functions/JobsFunctions";


import React from 'react';

class Apply extends React.Component{

    onToken = (token) => {
        console.log(JSON.stringify(token));
        this.createPayment(token.id);
      }

    createPayment(token){
        const params = {
            amount: parseFloat(this.props.apply.payRate),
            email: this.props.apply.user.email,
            id: token
        }
        console.log(JSON.stringify(params));
        fetch('http://lnsel.co.in:3001/stripecharge',{
            method: 'post',
            body: {
                amount: parseFloat(this.props.apply.payRate),
                email: this.props.apply.user.email,
                id: token
            },
        }).then((response) => response.json()).then((responseJson) => {
            console.log(JSON.stringify(responseJson));
        }).catch((error) => {
            console.error(error);
        });
    }

    rejectPayment = (jobId, employeeId) => {
        console.log('Reject Payment>>>>'+jobId+'>>>'+employeeId);
        jobsFunctions.rejectPayment(jobId, employeeId, (payment) => {
            console.log(JSON.stringify(payment));
        });
    }


    render() {
        return (

    <div className={"applyContainer"} onClick={this.props.apply.status === "applied"?this.props.onOpenEmployeePopup:this.props.onOpenHiredEmployeePopup}>
    {this.props.payment==false?    
    <Row>
            <Col xs={2}>
                <img src={this.props.apply.user?this.props.apply.user.profileImg:null}/>
            </Col>
            <Col xs={10}>
                <div className={"infosContainer"}>
                    <div>
                        <span className={"bold"}>
                            {this.props.apply.user.firstName + " " + this.props.apply.user.lastName}
                        </span>
                        <span className={"applyDate"}>
                            {this.props.apply.applicationDate}
                        </span>
                    </div>
                    <div>
                        <span className={"bold"}>
                            <StarRatings
                                 rating={this.props.apply.user.rating}
                                 starRatedColor="black"
                                 numberOfStars={5}
                                 starDimension="10px"
                                 starSpacing="2px"
                                 name='rating'/>
                            {" " + this.props.apply.user.rating}
                        </span>
                        <span className={"applyPrice"}>
                            {"asdasfdsa"}
                        </span>
                    </div>
                </div>
            </Col>
        </Row>
        :null}
        {this.props.payment==true?
        <Row>
        <Col xs={2}>
            <img src={this.props.apply.user?this.props.apply.user.profileImg:null}/>
        </Col>
        <Col xs={6}>
            <div className={"infosContainer"}>
                <div>
                    <span className={"bold"}>
                        {this.props.apply.user.firstName + " " + this.props.apply.user.lastName}
                    </span>
                </div>
                <div>
                    <span className={"bold"}>
                        {"£"+this.props.apply.payRate}
                    </span>
                </div>
            </div>
        </Col>
        {this.props.apply.status=='applied'?
        <Col xs={4}>
            <div>

        <StripeCheckout
        token={this.onToken}
        name="OpenForce"
        email={this.props.apply.user.email}
        amount={parseFloat(this.props.apply.payRate+'00')}
        currency="GBP"
        stripeKey="pk_test_QLf1rrRSybWAIJPhuvJqVgDG00bR4hELho"
      >
      <button className="btn btn-success btnAccept">
      Accept
    </button>
      </StripeCheckout>
            </div>
            <div>
            <button className="btn btn-danger btnReject" onClick={this.rejectPayment.bind(this, this.props.apply.jobId, this.props.apply.employeeId)}>
      Reject
    </button>
            </div>
        </Col>
        :<Col xs={4}>
            <h4 className="paymentAccept">{this.props.apply.status.toUpperCase()}</h4>
        </Col>
    }
    </Row>
    :null}

    </div>
);

        }
    }



export default Apply;
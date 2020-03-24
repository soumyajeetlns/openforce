import * as css from './Apply.css';
import {Col, Row} from "react-flexbox-grid";
import moment from 'moment';
import StarRatings from 'react-star-ratings';
import LaddaButton, { XL, EXPAND_LEFT, XS } from 'react-ladda';
import StripeCheckout from 'react-stripe-checkout';
import * as jobsFunctions from "../../../../functions/JobsFunctions";
import * as employerFunctions from "../../../../functions/EmployerFunctions";
import qs from 'querystring'
import Invoice from "./invoice/Invoice";
import Popup from "reactjs-popup";
import * as utils from "../../../../utils/Utils";


import React from 'react';

class Apply extends React.Component{
    constructor(args) {
        super(args);
        this.state = {
            job: null
        }
    }

    componentDidMount = () => {
            const jobID = this.props.apply.jobId;
            jobsFunctions.getJobsById(jobID, true, (job, paymentReqCount) => {
                console.log("myjob: "+JSON.stringify(job));
                const tempState = utils.deepCopy(this.state);
                tempState.job = job;
                this.setState(tempState);
            });

            const paymentID = this.props.apply.uid;
            jobsFunctions.getPaymentRequestData(jobID, paymentID, (payment) => {
                console.log("mypayment: "+JSON.stringify(payment));
                const tempState = utils.deepCopy(this.state);
                tempState.payment = payment;
                this.setState(tempState);
            });

    }
    

    onToken = (token, addresses) => {
        console.log({token, addresses});
        console.log(JSON.stringify(this.props.apply));
        this.createPayment(token.id);
      }

    getEmployerInfo(id){
        employerFunctions.getEmployerStripe(id,(employer)=>{
            console.log("STRIPE: "+JSON.stringify(employer));
            return employer.user_id;

        },(error)=>{
            console.log("ERR: "+error);
        });
    }

                // function
encodeFormData = (data) => {
    return Object.keys(data)
        .map(key => encodeURIComponent(key) + '=' + encodeURIComponent(data[key]))
        .join('&');
}



    createPayment(token){
        employerFunctions.getEmployerStripe(this.props.apply.uid,(employer)=>{
            console.log("STRIPE: "+JSON.stringify(employer));
            const params = {
                amount: this.props.apply.payRate,
                email: this.props.apply.user.email,
                id: token,
                stripeId: employer.user_id
            }

            var data = new FormData();
            data.append('amount', this.props.apply.payRate);
            data.append('email', this.props.apply.user.email);
            data.append('id', 'token');
            data.append('stripeId', employer.user_id);

            console.log(JSON.stringify(params));



            fetch('http://lnsel.co.in:3001/stripecharge',{
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
                  },
                body: qs.stringify(params)

                // body: {
                //     amount: this.props.apply.payRate,
                //     email: this.props.apply.user.email,
                //     id: token,
                //     currency: "GBP",
                //     stripeId: employer.user_id
                // }
            }).then((response) => {
                console.log(response);
                this.updatePaymentStatus(this.props.apply.jobId, this.props.apply.employeeId, 'accepted');
            });
            // .then((responseJson) => {
            //     console.log(JSON.stringify(responseJson));
            //     alert(JSON.stringify(responseJson));
            // }).catch((error) => {
            //     console.error(error);
            // });

        },(error)=>{
            console.log("ERR: "+error);
        });

        

    }

    updatePaymentStatus = (jobId, employeeId, status) => {
        console.log('Payment Status>>>>'+jobId+'>>>'+employeeId+'>>>'+status);
        jobsFunctions.updatePaymentStatus(jobId, employeeId, status, (payment) => {
            console.log(JSON.stringify(payment));
            this.props.apply.status = status;
        });
    }

    checkjob = (data, data2) => {
        console.log("datajob: "+JSON.stringify(data));
        console.log("datajob2: "+JSON.stringify(data2));
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
            <button className="btn btn-danger btnReject" onClick={this.updatePaymentStatus.bind(this, this.props.apply.jobId, this.props.apply.employeeId, 'rejected')}>
      Reject
    </button>
            </div>
        </Col>
        :<Col xs={4}>
        {this.props.apply.status=='accepted'?
        <div>
            <h4 className="paymentAccept">{this.props.apply.status.toUpperCase()}</h4>
            <Popup
            trigger={<button className="btn btn-danger btnReject"> Invoice</button>}
            modal
            closeOnDocumentClick
          >
            <Invoice job={this.state.job} employee={this.props.apply} />
          </Popup>
        </div>
            
            :<h4 className="paymentReject">{this.props.apply.status.toUpperCase()}</h4>}
        </Col>
    }
    </Row>
    :null}

    </div>
);

        }
    }



export default Apply;
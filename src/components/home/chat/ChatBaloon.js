import * as css from './ChatBaloon.css';
import React, {Component} from 'react';
import * as constants from "../../../utils/Constants";
import * as utils from "../../../utils/Utils";
import Wrapper from "../../wrapper/Wrapper";
import * as strings from "../../../utils/Strings";
import moment from "moment/moment";

class ChatBaloon extends Component {

    constructor(args) {
        super(args);
        this.state = {
            strTypeMessage : ""
        }
    }

    componentDidMount = () =>{
        if(this.props.message && this.props.message.body){
            const tempState = utils.deepCopy(this.state);
            const typeOfMessage = this.props.message.body.type;
            switch(typeOfMessage){
                case constants.TYPES_MESSAGE.TYPE_HIRED:
                    tempState.strTypeMessage = strings.stringsHiredEmployeePopup.CHAT.LBL_MESSAGE_HIRED;
                    break;
                case constants.TYPES_MESSAGE.TYPE_APPLIED:
                    tempState.strTypeMessage = strings.stringsHiredEmployeePopup.CHAT.LBL_MESSAGE_APPLIED;
                    break;
                case constants.TYPES_MESSAGE.TYPE_CHECK_IN:
                    tempState.strTypeMessage = strings.stringsHiredEmployeePopup.CHAT.LBL_MESSAGE_JOB_CHECK_IN;
                    break;
                case constants.TYPES_MESSAGE.TYPE_JOB_LOCATION:
                    tempState.strTypeMessage = strings.stringsHiredEmployeePopup.CHAT.LBL_MESSAGE_JOB_LOCATION;
                    break;
                case constants.TYPES_MESSAGE.TYPE_ENDED:
                    tempState.strTypeMessage = strings.stringsHiredEmployeePopup.CHAT.LBL_MESSAGE_ENDED;
                    break;
            }
            this.setState(tempState);
        }
    }

    getTypeMessage = () =>{
        let element = null;
        if(this.props.message && this.props.message.body){
            const typeOfMessage = this.props.message.body.type;

            switch(typeOfMessage){
                case constants.TYPES_MESSAGE.TYPE_HIRED:
                    element = (
                        <div className={"textMessage"}>
                            {this.props.message.body.text}
                        </div>
                    )
                    break;
                case constants.TYPES_MESSAGE.TYPE_APPLIED:
                    element = (
                        <div className={"textMessage"}>
                            {this.props.message.body.text}
                        </div>
                    )
                    break;
                case constants.TYPES_MESSAGE.TYPE_CHECK_IN:
                    element = (
                        <div className={"textMessage"}>
                            {moment(this.props.message.timestamp).format('DD/MM/YYYY - HH:mm')}
                        </div>
                    )
                    break;
                case constants.TYPES_MESSAGE.TYPE_JOB_LOCATION:
                    element = (
                        <div className={"textMessage"}>
                            {this.props.message.body.location.address}
                            <img className={"staticImg"} src={utils.getStaticMap(this.props.message.body.location.latitude,this.props.message.body.location.longitude,234,80)}/>
                        </div>
                    )
                    break;
                case constants.TYPES_MESSAGE.TYPE_ENDED:
                    element = (
                        <div className={"textMessage"}>
                            {moment(this.props.message.timestamp).format('DD/MM/YYYY - HH:mm')}
                        </div>
                    )
                    break;
                default:
                    element = <div>{typeOfMessage}</div>
            }
        }
        return element;
    }

    render() {
        return (
            <div className={this.props.fromEmployer?"wrapperChatBaloon":"wrapperChatBaloon fromEmployee"} style={this.props.fromEmployer?{float:"right"}:{float:"left"}}>
                <div className={"chatBaloon"}>
                    {this.getTypeMessage()}
                </div>
                <div className={"strTypeOfChatMessage"}>
                    {this.state.strTypeMessage}
                </div>
            </div>
        )
    }
}


export default ChatBaloon;

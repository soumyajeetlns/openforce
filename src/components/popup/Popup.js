import React, {Component} from 'react';
import * as css from './Popup.css';
import Wrapper from "../wrapper/Wrapper";
import * as strings from "../../utils/Strings";
import AsyncButton from "../asyncButton/AsyncButton";

class Popup extends Component {
    constructor(args) {
        super(args);
        this.state = {
        }
    }

    render() {
        return (
            <div className={"popupBody"} style={this.props.wrapperStyle}>
                <div className={"body"} style={{width:this.props.width?this.props.width:null, height:this.props.height?this.props.height:null}}>
                    <p className={"title"}>{this.props.titleText}</p>
                    <p className={"textBody"}>{this.props.bodyText}</p>
                    <div className={"wrapperButtons"}>
                        <div className={"buttons"} style={this.props.buttonsStyle}>
                            {this.props.children?
                                this.props.children
                            :
                                <Wrapper>
                                    <AsyncButton
                                        className={"btnAccept"}
                                        loading={this.props.loading}
                                        textButton={this.props.btnAccept}
                                        onClick={this.props.onConfirmClick}/>
                                    <button
                                        className={"btnCancel"} 
                                        disabled={this.state.loading}
                                        style={{verticalAlign: "bottom"}}
                                        onClick={this.props.onDeclineClick}>{this.props.btnCancel}
                                    </button>
                                </Wrapper>
                            }

                        </div>
                    </div>
                </div>

            </div>
        )
    }
}

export default Popup;
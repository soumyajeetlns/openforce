import React, {Component} from 'react';
import * as css from './Rightbar.css';
import {Row, Col} from "react-flexbox-grid";
import Loader from "../../loader/Loader";
import InfiniteScroll from 'react-infinite-scroller';
import * as utils from '../../../utils/Utils';
import Apply from "./apply/Apply";

class Rightbar extends Component {
    constructor(args) {
        super(args);
        this.state = {
            loadingOtherItems:this.props.loadingOtherItems
        }
    }

    componentWillReceiveProps(nextProps) {
        const tempState = utils.deepCopy(this.state);
        tempState.loadingOtherItems = nextProps.loadingOtherItems;
        console.log("Payment : "+this.props.payment);
        this.setState(tempState);
    }

    render() {
        return (
            <div className={"rightbarContainer"}>
                <div className={"rightBar"}>
                    <div className={"header"}>
                        <div className={"sectionTitle"}>
                            {this.props.sectionTitle}
                        </div>
                    </div>

                    <div className={"content"}>
                            <Loader className={"loaderForRightbar"} loading={this.state.loadingOtherItems}/>
                            {this.props.applications? this.props.applications.map((apply,index)=>
                                <Apply key={index}
                                       apply={apply}
                                       payment={this.props.payment}
                                       onOpenHiredEmployeePopup={this.props.onOpenHiredEmployeePopup.bind(this,apply.uid)}
                                       onOpenEmployeePopup={this.props.onOpenEmployeePopup.bind(this,apply.uid)}/>
                            ):null}
                    </div>
                </div>
            </div>
        )
    }
}

export default Rightbar;
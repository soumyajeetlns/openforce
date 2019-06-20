import React, {Component} from 'react';
import {  Row, Col } from 'react-flexbox-grid';
import css from './AutocompleteInput.css';
import * as utils from '../../utils/Utils';
import Input from "../input/Input";
import HocJobRole from "../../utils/hoc/jobs/HocJobRole";

class AutocompleteInput extends Component{
    styleNoBorderBottom = {
        "borderRadius": "10px 10px 0px 0px",
        "marginBottom": "-1px",
        "boxShadow": "0 6px 18px 0 rgba(144, 164, 183, 0.33)",
        "border" : "solid 1px #e9e9e9",
        "borderBottom":"0px"
    }

    styleHide = {
        display:"none"
    }

    componentDidMount() {
        const tempState = utils.deepCopy(this.state);
        tempState.valueInput = this.props.valueInput;
        this.setState(tempState);
    }

    constructor(args){
        super(args);
        this.state = {
            valueInput : "",
            dataset : this.props.dataset,
            style:null,
            shouldHide:true,
            tag_found:null,
            choosed_tag: this.props.choosed_tag,
            writed_tag:null
        }
    }

    componentWillReceiveProps(nextProps) {
        const tempState = JSON.parse(JSON.stringify(nextProps));
        this.close(tempState);
        this.setState(tempState);
    }

    onChangeHandler = (event) => {
        const tempState = JSON.parse(JSON.stringify(this.state));
        const value = event.target.value;

        tempState.valueInput = value;
        if(utils.isBlank(value)){
            tempState.shouldHide = true;
            tempState.style = null;
            tempState.tag_found = null;
            tempState.writed_tag = null;
            tempState.valueInput = "";
        }else{
            tempState.style = this.styleNoBorderBottom;
            tempState.shouldHide = false;
            tempState.tag_found = this.getAllTagIndexes(this.state.dataset,value);
            tempState.writed_tag = value;
            tempState.valueInput = value;
        }
        this.setState(tempState);
        if(this.props.change){
            this.props.change(event);
        }
    }

    close = (state) =>{
        if(!state) state = JSON.parse(JSON.stringify(this.state));
        if(this.props.shouldClearInputAfterChoose) state.valueInput = "";
        state.shouldHide = true;
    }

    onChooseInt = (el) =>{
        const tempState = JSON.parse(JSON.stringify(this.state));
        tempState.valueInput = el.name;
        if(this.props.shouldHideAfterChoose){
            this.close(tempState);
        }
        this.setState(tempState);
        if(this.props.onChoosed){
            this.props.onChoosed(el);
        }
    }

    getAllTagIndexes = (arr, val) => {
        let elements = [], i;
        if(arr){
            arr = arr.filter((item) => item !== null && item !== undefined);
            for(i = 0; i < arr.length; i++) {
                const choosedTag = new HocJobRole.getInstance(arr[i]);
                if (choosedTag.name.toLowerCase().indexOf(val.toLowerCase())>=0) {
                    elements.push(choosedTag);
                }
            }
        }
        return elements;
    }

    render() {
        return (

            <div>
                <p className="default-label">{this.props.label}</p>
                <div style={{position:"relative",width:this.props.width}}>
                    <Input type="text"
                           onChange={this.onChangeHandler.bind(this)}
                           readOnly={this.props.readOnly}
                           disabled={this.props.disabled}
                           style={this.props.width && {width:this.props.width}}
                           placeholder={this.props.placeholder}
                           googleMaterialIcon={this.props.googleMaterialIcon}
                           value={this.state.valueInput}
                           className={(this.props.className?this.props.className:"defaultInput") + " " + (this.props.error?"defaultInputError":"")}/>

                    <div className="panel-tag" style={this.state.shouldHide?this.styleHide:null}>
                        {this.state.tag_found!=null?this.state.tag_found.map((item,index)=>
                            <div className="body-tag" key={index} onClick={this.onChooseInt.bind(this,item)}>{"#" + item.name}</div>
                        ):""}
                    </div>
                </div>
            </div>
        )
    }
}

export default AutocompleteInput;
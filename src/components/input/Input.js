import React, {Component} from 'react';
import css from './Input.css';
import Wrapper from "../wrapper/Wrapper";
import PlacesAutocomplete from 'react-places-autocomplete';
import {
    geocodeByAddress,
    geocodeByPlaceId,
    getLatLng,
} from 'react-places-autocomplete';
import * as utils from "../../utils/Utils";

class Input extends Component {
    constructor(args) {
        super(args);
        this.state = {
            address : "",
            latLng:null
        }
    }

    onError = (status) => {
        console.log('Google Maps API returned error with status: ', status)
    }

    handleChange = (address) => {
        const tempState = utils.deepCopy(this.state);
        tempState.address = address;
        this.setState(tempState);
    };

    handleSelect = (selectedAddress) => {
        const tempState = utils.deepCopy(this.state);
        tempState.address = selectedAddress;
        this.setState(tempState,()=>{
            geocodeByAddress(selectedAddress)
                .then(results => getLatLng(results[0]))
                .then((latLng) => {
                    const obj = {};
                    obj.address = selectedAddress;
                    obj.latitude = latLng.lat;
                    obj.longitude = latLng.lng;
                    if(this.props.onGooglePlaceSelected) this.props.onGooglePlaceSelected(obj)
                })
                .catch(error => console.error('Error', error));
        });
    };

    render() {
        return (
            <div style={{position: "relative"}}>
                <div className={"customInput"} style={this.props.style}>
                    {this.props.googleMaterialIcon &&
                    <i className="custom-material-icons material-icons">{this.props.googleMaterialIcon}</i>}
                    {this.props.errorMessage && <p className={"globalErrorMessage"}>{this.props.errorMessage}</p>}
                    {this.props.label && <p className={"customLabel bold"}>{this.props.label}</p>}
                    {this.props.type === "google" ?
                        <PlacesAutocomplete
                            value={this.state.address?this.state.address:this.props.initialValue?this.props.initialValue:""}
                            onError={this.onError}
                            onChange={this.handleChange}
                            onSelect={this.handleSelect}>

                            {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
                                <Wrapper>
                                    <input
                                        {...getInputProps({
                                            placeholder: this.props.placeholder,
                                            readOnly:this.props.readOnly,
                                            disabled:this.props.disabled,
                                            className: this.props.className ? this.props.className : "defaultInput" + " " + (this.props.error ? "defaultInputError" : ""),
                                            style:this.props.googleMaterialIcon && {paddingLeft: "30px"},
                                            name:this.props.name
                                        })}
                                    />
                                    <div className="autocomplete-dropdown-container">
                                        {loading && <div className={"suggestion"}>Loading...</div>}
                                        {suggestions.map((suggestion,index) => {
                                            return (
                                                <div className={"suggestion"} key={index}>
                                                    <div {...getSuggestionItemProps(suggestion, {})} >
                                                        <strong>
                                                            {suggestion.formattedSuggestion.mainText}
                                                        </strong>{' '}
                                                        {suggestion.formattedSuggestion.secondaryText}
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </Wrapper>
                            )}
                        </PlacesAutocomplete>
                        :
                        <input
                            style={this.props.googleMaterialIcon && {paddingLeft: "30px"}}
                            type={this.props.type ? this.props.type : "text"}
                            onChange={this.props.onChange}
                            readOnly={this.props.readOnly}
                            disabled={this.props.disabled}
                            placeholder={this.props.placeholder}
                            value={this.props.value}
                            name={this.props.name}
                            className={(this.props.className ? this.props.className : "defaultInput") + " " + (this.props.error ? "defaultInputError" : "")}/>
                    }

                </div>
            </div>
        )
    }
}
export default Input;
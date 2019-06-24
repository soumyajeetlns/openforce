import { v4 } from 'uuid';
import {Moment} from "moment";
import {  toast } from 'react-toastify';
import * as constants from "./Constants";

export function getStaticMap(lat, long, width, height){
    return "http://maps.google.com/maps/api/staticmap?center="+lat+","+long+"&zoom=15&size="+width+"x"+height+"&sensor=false&key=" + constants.GOOGLE_MAPS_API_KEY;
}

export function getCompanyNameFormatted(companyName){
    let tempCompanyName = "";
    let wordsCompanyName = [];
    //take the first 2 letter of the company:
    wordsCompanyName = companyName.split(/\b\s+/);
    if(wordsCompanyName){
        for(let i=0;i<wordsCompanyName.length;i++){
            if(wordsCompanyName[i] && wordsCompanyName[i].length >0 && tempCompanyName.length<2){
                tempCompanyName += wordsCompanyName[i].charAt(0).toUpperCase();
            }
        }
    }
    return tempCompanyName;
}

export function logError(error){
    try{
        'use strict';
        console.log("Error:",JSON.stringify(error), "caller:", logError.caller);
    }catch(e){
        try{
            console.log("Error:",JSON.stringify(error));
        }catch (e2) { }
    }
}

export function workingDaysBetweenDates(startDate, endDate) {
    // Validate input
    if (endDate < startDate)
        return 0;
    // Calculate days between dates
    const millisecondsPerDay = 86400 * 1000; // Day in milliseconds
    startDate.setHours(0,0,0,1);  // Start just after midnight
    endDate.setHours(23,59,59,999);  // End just before midnight
    const diff = endDate - startDate;  // Milliseconds between datetime objects
    let days = Math.ceil(diff / millisecondsPerDay);

    // Subtract two weekend days for every week in between
    const weeks = Math.floor(days / 7);
    days = days - (weeks * 2);

    // Handle special cases
    const startDay = startDate.getDay();
    const endDay = endDate.getDay();

    // Remove weekend not previously removed.
    if (startDay - endDay > 1)
        days = days - 2;
    // Remove start day if span starts on Sunday but ends before Saturday
    if (startDay === 0 && endDay !== 6)
        days = days - 1
    // Remove end day if span ends on Saturday but starts after Sunday
    if (endDay === 6 && startDay !== 0)
        days = days - 1
    return days;
}

export function deepCopy(obj) {
    var copy;

    // Handle the 3 simple types, and null or undefined
    if (null == obj || "object" != typeof obj) return obj;

    // Handle Date
    if (obj instanceof Date) {
        copy = new Date();
        copy.setTime(obj.getTime());
        return copy;
    }

    if (obj._isAMomentObject) {
        copy = obj.clone();
        return copy;
    }

    // Handle Array
    if (obj instanceof Array) {
        copy = [];
        for (var i = 0, len = obj.length; i < len; i++) {
            copy[i] = deepCopy(obj[i]);
        }
        return copy;
    }

    // Handle Object
    if (obj instanceof Object) {
        copy = {};
        for (var attr in obj) {
            if (obj.hasOwnProperty(attr)) copy[attr] = deepCopy(obj[attr]);
        }
        return copy;
    }

    throw new Error("Unable to copy obj! Its type isn't supported.");
}

export function deepEqual(a,b)
{
    if( (typeof a === 'object' && a != null) &&
        (typeof b === 'object' && b != null) )
    {
        const count = [0,0];
        for( let key in a) count[0]++;
        for( let key in b) count[1]++;
        if( count[0]-count[1] !== 0) {return false;}
        for( let key in a)
        {
            if(!(key in b) || !deepEqual(a[key],b[key])) {return false;}
        }
        for( let key in b)
        {
            if(!(key in a) || !deepEqual(b[key],a[key])) {return false;}
        }
        return true;
    }
    else
    {
        return a === b;
    }
}

export function generateID(){
    return v4();
}

export function validateEmail(email) {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}

export function isBlank(str){
    if(!str || str.trim()==="") return true;
    return false;
}


export function showSuccess(message){
    toast.success(message);
    window.scrollTo(0, 0);
}
export function showError(message){
    toast.error(message);
    window.scrollTo(0, 0);
}
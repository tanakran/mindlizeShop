import moment from 'moment';


var hasOwnProperty = Object.prototype.hasOwnProperty;

export const isEmpty = (obj) =>{
    // null and undefined are "empty"
    if (obj == null) return true;

    // Assume if it has a length property with a non-zero value
    // that that property is correct.
    if (obj.length > 0)    return false;
    if (obj.length === 0)  return true;

    // If it isn't an object at this point
    // it is empty, but it can't be anything *but* empty
    // Is it empty?  Depends on your application.
    if (typeof obj !== "object") return true;

    // Otherwise, does it have any properties of its own?
    // Note that this doesn't handle
    // toString and valueOf enumeration bugs in IE < 9
    for (var key in obj) {
        if (hasOwnProperty.call(obj, key)) return false;
    }

    return true;
}

export const addDate = (date,unit,type='day') =>{
    let rs;
    try {
        rs = date.toDate();
    } catch (error) {
        rs = date;
    }
    rs = moment(rs).add(unit, type).format('MM/DD/YYYY');
    return rs;
}

export const stingToDate = (date,dateformat) =>{
    let rs;
    try {
        rs = new Date(moment(date, dateformat, true).format())
    } catch (error) {
        rs = date;
    }
    return rs
}


export const getIndex = (value, arr, prop) =>{
    for(var i = 0; i < arr.length; i++) {
        if(arr[i][prop] === value) {
            return i;
        }
    }
    return -1; //to handle the case where the value doesn't exist
}

export const mapDataToState = (data) =>{
    let result=[];
    if(data){
      data.map(item=>{
        result.push({...item})
      })
      return result
    }else{
      return result
    }
  }
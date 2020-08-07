import moment from 'moment';

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
import moment from 'moment';

const ShowDate = (date,SWCASE="") => {
    switch(SWCASE){
        case "Date" :
            return moment(date).format('DD MMM YYYY');

        case "Time" :
            return moment(date).format('h:mm a');

        default:
            return moment(date).format('DD MMM YYYY, h:mm a');
    }  
};

export default ShowDate;
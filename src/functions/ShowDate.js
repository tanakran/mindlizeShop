import moment from 'moment';

const ShowDate = (date,SWCASE="") => {
    switch(SWCASE){
        case "Date" :
            try {
                return moment(date.toDate()).format('DD MMM YYYY');
            } catch (error) {
                return moment(date).format('DD MMM YYYY');
            }
            

        case "Time" :
            try {
                return moment(date.toDate()).format('h:mm a');
            } catch (error) {
                return moment(date).format('h:mm a');
            }
            

        case "date" :
            try {
                return moment(date.toDate()).format('MM/DD/YYYY');
            } catch (error) {
                return moment(date).format('MM/DD/YYYY');
            }

        case "date_to_code" :
            try {
                return moment(date.toDate()).format('MMDDYYYY-h-mm-a');
            } catch (error) {
                return moment(date).format('MMDDYYYY-h-mm-a');
            }
            

        default:
            try {
                return moment(date.toDate()).format('DD MMM YYYY, h:mm a');
            } catch (error) {
                return moment(date).format('DD MMM YYYY, h:mm a');
            }
            
    }  
};

export default ShowDate;
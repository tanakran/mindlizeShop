import { toast } from 'react-toastify';

const Notify = (content,SWCASE="") => {
    switch(SWCASE){
        case "success" :
                toast.success(content, {
                    position: toast.POSITION.TOP_RIGHT
                  });    
        break;

        case "error" :
                toast.error(content, {
                    position: toast.POSITION.TOP_RIGHT
                  });
        break;

        case "warning" :
                toast.warn(content, {
                    position: toast.POSITION.TOP_RIGHT
                  });
        break;

        case "info" :
                toast.info(content, {
                    position: toast.POSITION.TOP_RIGHT
                  });
        break;

        default:
                toast(content, {
                    position: toast.POSITION.TOP_RIGHT,
                    className: 'foo-bar'
                  });
        break;
    }  
};

export default Notify;
import Notify from '../../library/Notify';
const customerReducer = (state = [],action) => {
    switch(action.type){
        case 'ADD_CUSTOMER_SUCCESS':
            Notify("เพิ่มข้อมูลสำเร็จ","success")
            return state;

        case 'UPDATE_CUSTOMER_SUCCESS':
            Notify("บันทึกการแก้ไขข้อมูล","warning")
            return state;

        case 'DELETE_CUSTOMER_SUCCESS':
            Notify("ลบข้อมูลสำเร็จ","error")
            return state;

        case 'CUSTOMER_ERR':
            Notify(action.err,"error")
            return state;
        default:
            return state;
    }

}
export default customerReducer;
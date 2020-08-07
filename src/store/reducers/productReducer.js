import Notify from '../../library/Notify';
const productReducer = (state = [],action) => {
    switch(action.type){
        case 'ADD_PRODUCT_SUCCESS':
            Notify("เพิ่มข้อมูลสำเร็จ","success")
            return state;

        case 'UPDATE_PRODUCT_SUCCESS':
            Notify("บันทึกการแก้ไขข้อมูล","warning")
            return state;

        case 'DELETE_PRODUCT_SUCCESS':
            Notify("ลบข้อมูลสำเร็จ","error")
            return state;

        case 'PRODUCT_ERR':
            Notify(action.err,"error")
            return state;
        default:
            return state;
    }

}
export default productReducer;
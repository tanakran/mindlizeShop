import Notify from '../../library/Notify';
const saleReducer = (state = [],action) => {
    switch(action.type){
        case 'ADD_SALE_SUCCESS':
            Notify("บันทึกสรุปยอด","success")
            return state;

        case 'UPDATE_SALE_SUCCESS':
            Notify("บันทึกสำเร็จ","success")
            return state;

        case 'DELETE_SALE_SUCCESS':
            Notify("ลบข้อมูลสำเร็จ","error")
            state={
                oldSaleData:action.data,
            }
            return state;


        case 'CHECK_SALE':
            state={
                oldSaleData:action.data,
            }
            return state;


        case 'SALE_ERR':
            Notify(action.err,"error")
            return state;
        default:
            return state;
    }

}
export default saleReducer;
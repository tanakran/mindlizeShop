export const addCustomer = (dataset) => {
    return (dispatch, getState, {  getFirebase,getFirestore }) => {
        
        const firestore = getFirestore();
        firestore.collection("customer").add({
            ...dataset.data
        }).then(()=>{
            dispatch({type:'ADD_CUSTOMER_SUCCESS',data:dataset.data})
        }).catch((err)=>{
            console.log(err)
            dispatch({type:'CUSTOMER_ERR',err:err})
        })
        
    }
}

export const updateCustomer = (dataset) => {
    return (dispatch, getState, {  getFirebase,getFirestore }) => {
        const firestore = getFirestore();

        firestore.collection("customer").doc(dataset.id).update({
            ...dataset.data
        }).then(()=>{
            dispatch({type:'UPDATE_CUSTOMER_SUCCESS',data:dataset.data})
        }).catch((err)=>{
            dispatch({type:'CUSTOMER_ERR',err:err})
        })
        
    }
}

export const deleteCustomer = (dataset) => {
    return (dispatch, getState, {  getFirebase,getFirestore }) => {
        const firestore = getFirestore();
        firestore.collection("customer").doc(dataset.id).update({
            ...dataset.data
        }).then(()=>{
            dispatch({type:'DELETE_CUSTOMER_SUCCESS',data:dataset.data})
        }).catch((err)=>{
            dispatch({type:'CUSTOMER_ERR',err:err})
        })
        
    }
}
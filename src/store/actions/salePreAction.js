export const addSalePre = (dataset) => {
    return (dispatch, getState, {  getFirebase,getFirestore }) => {
        
        const firestore = getFirestore();
        firestore.collection("sale").add({
            ...dataset.data
        }).then(()=>{
            dispatch({type:'ADD_SALE_SUCCESS',data:dataset.data})
        }).catch((err)=>{
            console.log(err)
            dispatch({type:'SALE_ERR',err:err})
        })
        
    }
}

export const updateSalePre = (dataset) => {
    return (dispatch, getState, {  getFirebase,getFirestore }) => {
        const firestore = getFirestore();

        firestore.collection("sale").doc(dataset.id).update({
            ...dataset.data
        }).then(()=>{
            dispatch({type:'UPDATE_SALE_SUCCESS',data:dataset.data})
        }).catch((err)=>{
            dispatch({type:'SALE_ERR',err:err})
        })
        
    }
}


export const checkOldBilPre = (dataset) => {
    return (dispatch, getState, {  getFirebase,getFirestore }) => {
        
        const firestore = getFirestore();
        firestore.collection("sale")
        .where("cus_id", '==', dataset.data.cus_id)
        .where("lot_id", '==', dataset.data.lot_id)
        .get().then(querySnapshot => {
            let oldData = {
            }
            querySnapshot.forEach(doc => {
                oldData={
                    bil_id:doc.id,
                    ...doc.data(),
                }
            })
            dispatch({type:'CHECK_SALE',data:oldData})
        }).catch((err)=>{
            console.log(err)
            dispatch({type:'SALE_ERR',err:err})
        })
        
    }
}

export const deleteSalePre = (dataset) => {
    return (dispatch, getState, {  getFirebase,getFirestore }) => {
        const firestore = getFirestore();

        firestore.collection("sale").doc(dataset.id).delete().then(()=>{
            dispatch({type:'DELETE_SALE_SUCCESS',data:dataset.data})
        }).catch((err)=>{
            dispatch({type:'SALE_ERR',err:err})
        })
        
    }
}
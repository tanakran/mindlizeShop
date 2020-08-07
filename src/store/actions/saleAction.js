export const addSale = (dataset) => {
    return (dispatch, getState, {  getFirebase,getFirestore }) => {
        
        const firestore = getFirestore();
        const datadetail=dataset.data.detail;

        datadetail.map(item=>{
            firestore.collection("product").doc(item.id).get().then(function(doc) {
                let newAmount = Number.parseFloat(doc.data().pd_in_stock)-Number.parseFloat(item.amount)
                doc.ref.update({
                    pd_in_stock:newAmount,
                });
            });
        })


        firestore.collection("sale_stock").add({
            ...dataset.data
        }).then(()=>{
            dispatch({type:'ADD_SALE_SUCCESS',data:dataset.data})
        }).catch((err)=>{
            console.log(err)
            dispatch({type:'SALE_ERR',err:err})
        })
        
    }
}

export const updateSale = (dataset) => {
    return (dispatch, getState, {  getFirebase,getFirestore }) => {
        const firestore = getFirestore();

        firestore.collection("sale_stock").doc(dataset.id).update({
            ...dataset.data
        }).then(()=>{
            dispatch({type:'UPDATE_SALE_SUCCESS',data:dataset.data})
        }).catch((err)=>{
            dispatch({type:'SALE_ERR',err:err})
        })
        
    }
}


export const checkOldBil = (dataset) => {
    return (dispatch, getState, {  getFirebase,getFirestore }) => {
        
        const firestore = getFirestore();
        firestore.collection("sale_stock")
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

export const deleteSale = (dataset) => {
    return (dispatch, getState, {  getFirebase,getFirestore }) => {
        const firestore = getFirestore();

        firestore.collection("sale_stock").doc(dataset.id).delete().then(()=>{
            dispatch({type:'DELETE_SALE_SUCCESS',data:dataset.data})
        }).catch((err)=>{
            dispatch({type:'SALE_ERR',err:err})
        })
        
    }
}
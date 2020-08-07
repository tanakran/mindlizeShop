export const addProduct = (dataset) => {
    return (dispatch, getState, {  getFirebase,getFirestore }) => {
        
        const firestore = getFirestore();
        /*firestore.collection("product").get().then(function(querySnapshot) {
            querySnapshot.forEach(function(doc) {
                
                if(!doc.data().pd_price_stock){
                    if(doc.data().pd_price==120){
                        doc.ref.update({
                            pd_price_stock:140,
                            pd_in_stock:0,
                        });
                    }else if(doc.data().pd_price==260){
                        doc.ref.update({
                            pd_price_stock:280,
                            pd_in_stock:0,
                        });
                    }else{
                        doc.ref.update({
                            pd_price_stock:150,
                            pd_in_stock:0,
                        });
                    }
                }
            });
        });*/
        firestore.collection("product").add({
            ...dataset.data
        }).then(()=>{
            dispatch({type:'ADD_PRODUCT_SUCCESS',data:dataset.data})
        }).catch((err)=>{
            console.log(err)
            dispatch({type:'PRODUCT_ERR',err:err})
        })
        
    }
}

export const updateProduct = (dataset) => {
    return (dispatch, getState, {  getFirebase,getFirestore }) => {
        const firestore = getFirestore();

        firestore.collection("product").doc(dataset.id).update({
            ...dataset.data
        }).then(()=>{
            dispatch({type:'UPDATE_PRODUCT_SUCCESS',data:dataset.data})
        }).catch((err)=>{
            dispatch({type:'PRODUCT_ERR',err:err})
        })
        
    }
}

export const deleteProduct = (dataset) => {
    return (dispatch, getState, {  getFirebase,getFirestore }) => {
        const firestore = getFirestore();
        firestore.collection("product").doc(dataset.id).update({
            ...dataset.data
        }).then(()=>{
            dispatch({type:'DELETE_PRODUCT_SUCCESS',data:dataset.data})
        }).catch((err)=>{
            dispatch({type:'PRODUCT_ERR',err:err})
        })
        
    }
}
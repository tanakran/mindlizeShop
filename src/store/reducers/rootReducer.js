import customerReducer from './customerReducer';
import productReducer from './productReducer';
import saleReducer from './saleReducer';


import { combineReducers } from 'redux';
import { firestoreReducer } from 'redux-firestore';
import { firebaseReducer, FirebaseReducer } from 'react-redux-firebase';

const rootReducer = combineReducers({

    customer: customerReducer,
    product: productReducer,
    sale:saleReducer,

    firestore:firestoreReducer,
    firebase:firebaseReducer,
});

export default rootReducer;
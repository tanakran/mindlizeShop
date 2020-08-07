import firebase from 'firebase/app'
import 'firebase/firestore'
import config from './config'

//console.log(config)
//firebase.initializeApp(config);

export default firebase.apps[0] || firebase.initializeApp(config);
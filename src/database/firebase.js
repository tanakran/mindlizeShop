import app from 'firebase/app';
import "firebase/storage";
const config_sub = {
  apiKey: "AIzaSyCgvLjsKmkbBTbnD8wBx3t0lHoahinhHMA",
  authDomain: "mindlize-shop.firebaseapp.com",
  databaseURL: "https://mindlize-shop.firebaseio.com",
  projectId: "mindlize-shop",
  storageBucket: "mindlize-shop.appspot.com",
  messagingSenderId: "877495020328",
  appId: "1:877495020328:web:b70f01e7a76b1f2c72be1d"
  }

const config_main = {
  apiKey: "AIzaSyCgvLjsKmkbBTbnD8wBx3t0lHoahinhHMA",
  authDomain: "mindlize-shop.firebaseapp.com",
  databaseURL: "https://mindlize-shop.firebaseio.com",
  projectId: "mindlize-shop",
  storageBucket: "mindlize-shop.appspot.com",
  messagingSenderId: "877495020328",
  appId: "1:877495020328:web:b70f01e7a76b1f2c72be1d"
  }
class Firebase {
  constructor() {
    app.initializeApp(config_main);
    
  }
}
export default Firebase;
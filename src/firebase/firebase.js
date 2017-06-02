import * as firebase from "firebase";

class Firebase {

    /**
     * Initialises Firebase
     */
    static initialise() {
        firebase.initializeApp({
            apiKey: "AIzaSyD-TT0LkgFHo5GELk07xeA2y5UvNcyUkRU",
            authDomain:  "sayumm-11293da7c.firebaseapp.com",
            databaseURL: "https://sayumm-1129.firebaseio.com",
            storageBucket: "sayumm-1129.appspot.com"
        });
    }

}

module.exports = Firebase;
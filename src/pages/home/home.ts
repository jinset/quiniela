import { Component } from '@angular/core';
import { NavParams, NavController, IonicPage } from "ionic-angular";
import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';
import firebase from 'firebase';
declare var FCMPlugin;
@IonicPage()
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})

export class HomePage {
  firestore = firebase.database().ref('/pushtokens');
  firemsg = firebase.database().ref('/messages');

  constructor(public navCtrl: NavController, public afd: AngularFireDatabase, public navParams: NavParams) {
    this.tokensetup().then((token) => {
      this.storetoken(token);
    })
    let uid = navParams.get('uid');

    console.log(uid);
  }
  ionViewDidLoad() {
    FCMPlugin.onNotification(function (data) {
      if (data.wasTapped) {
        //Notification was received on device tray and tapped by the user.
        alert(JSON.stringify(data));
      } else {
        //Notification was received in foreground. Maybe the user needs to be notified.
        alert(JSON.stringify(data));
      }
    });

    FCMPlugin.onTokenRefresh(function (token) {
      console.log(token);
    });
  }
  tokensetup() {
    var promise = new Promise((resolve, reject) => {
      FCMPlugin.getToken(function (token) {
        resolve(token);
      }, (err) => {
        reject(err);
      });
    })
    return promise;
  }

  storetoken(t) {
    this.afd.list("users/").update(firebase.auth().currentUser.uid,{
      devtoken: t
    }).then(() => {
      console.log('Token stored');
    })

    /*this.afd.list(this.firemsg).push({
      sendername: firebase.auth().currentUser.displayName,
      message: 'hello'
    }).then(() => {
      alert('Message stored');
    })*/
  }
}

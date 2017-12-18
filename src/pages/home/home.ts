import { Component } from '@angular/core';
import { NavParams, NavController, IonicPage, LoadingController  } from "ionic-angular";
import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';
//import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
import * as moment from 'moment';
import { Storage } from '@ionic/storage';

import { Observable } from 'rxjs/Observable';
import firebase from 'firebase';
declare var FCMPlugin;
@IonicPage()
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})

export class HomePage {
  //firestore = firebase.database().ref('/pushtokens');
  //firemsg = firebase.database().ref('/messages');
  items: Observable<any[]>;
  li: Observable<any[]>;
  myDate: Date;
  
  
  constructor(public storage: Storage, public navCtrl: NavController, public afd: AngularFireDatabase, public navParams: NavParams, public loadingCtrl: LoadingController) {
    this.tokensetup().then((token) => {
      this.storetoken(token);
    })    
    this.storage.get('isLogged').then(logged =>{
      this.items = afd.list('betPerUser/'+ logged + "/" + moment(this.myDate).format('DD-MM-YYYY')).valueChanges();
    })

    let loading = this.loadingCtrl.create({
      content: 'Please wait...'
    });
  }

  async checkDate(date){
    date = moment(date,'YYYY-MM-DD').format('DD-MM-YYYY');
    await this.storage.get('isLogged').then(logged =>{
      this.addBets(date, logged);
    })

  
  }

  async addBets(date, user){
    return new Promise((resolve, reject) =>{
      this.li = this.afd.list('scorePerGames/'+date).valueChanges();
      this.li.subscribe(li =>{
        li.forEach(element =>{
          console.log(element);
          //console.log('Item:', element.scoreA);
          this.afd.list("betPerUser/"+user+"/"+date).update(element.teamA+"-"+element.teamB,{
            scoreA:0,
            scoreB:0,
            teamA: element.teamA,
            teamB: element.teamB,
          })
        })
        this.items = this.afd.list('betPerUser/'+ user + "/" + date).valueChanges();
      })
    })
  }




  /**tokens */
  ionViewDidLoad() {
    FCMPlugin.onNotification(function (data) {
      if (data.wasTapped) {
        alert("tapped");
        //alert(JSON.stringify(data));
      } else {
        alert("in background");
        //alert(JSON.stringify(data));
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
  presentLoadingDefault() {
    let loading = this.loadingCtrl.create({
      content: 'Please wait...'
    });
  
    loading.present();
    loading.dismiss();
    
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

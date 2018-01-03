import { Component } from '@angular/core';
import { NavParams, NavController, IonicPage, LoadingController  } from "ionic-angular";
import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';
//import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
import * as moment from 'moment';
import { Storage } from '@ionic/storage';

import { Observable } from 'rxjs/Observable';
import firebase from 'firebase';

import { SportmonksApi } from 'sportmonks';

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
  private modelScoreA= 0;
  private modelScoreB= 0;

  //public sportmonks = new SportmonksApi("RgrjgSdEE4WjSUCfkrsHYvVfbC2JgKyeGddTc8CeXf7scEk8oYsLnnhc0N0A");
  
  constructor(public storage: Storage, public navCtrl: NavController, public afd: AngularFireDatabase, public navParams: NavParams, public loadingCtrl: LoadingController) {
    this.tokensetup().then((token) => {
      this.storetoken(token);
    })    
    this.storage.get('isLogged').then(logged =>{
      this.addBets(moment(this.myDate).format('DD-MM-YYYY'), logged);
    })

    
  }

  get self() {
    return this;
  }

  public loading = this.loadingCtrl.create({
    content: "Cargando...",
  });
  async checkDate(date){
    date = moment(date,'YYYY-MM-DD').format('DD-MM-YYYY');
    await this.storage.get('isLogged').then(logged =>{
      this.addBets(date, logged);
    })  
  }

  async addBets(date, user){
    return new Promise((resolve, reject) =>{
      this.loading.present();
      this.li = this.afd.list('scorePerGames/'+date).valueChanges();
      this.li.subscribe(li =>{
        li.forEach(element =>{
          console.log(element);
          //console.log('Item:', element.scoreA);
          let check = firebase.database().ref("betPerUser/"+user+"/"+date +"/"+element.teamA+"-"+element.teamB);
          check.once("value").then(snap =>{
            console.log(snap.exists())
            if(!snap.exists()){
              this.afd.list("betPerUser/"+user+"/"+date).set(element.teamA+"-"+element.teamB,{
                scoreA:0,
                scoreB:0,
                teamA: element.teamA,
                teamB: element.teamB,
                status: false
              })
            }
          })

        })
        this.loading.dismissAll();
        this.items = this.afd.list('betPerUser/'+ user + "/" + date).valueChanges();
      })
    })
  }


  bet(a,b){
    alert(a +"   "  + b);
  }

  /**tokens */
  ionViewDidLoad() {

  /**this.sportmonks.get('v2.0/countries/{id}', {id:13,competitions:true}).then(function(resp){
    console.log(resp);
  })*/

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

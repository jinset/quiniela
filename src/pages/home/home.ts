import { Component } from '@angular/core';
import { NavParams, NavController, IonicPage } from "ionic-angular";
@IonicPage()
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  constructor(private navParams: NavParams, public navCtrl: NavController) {
    let uid = navParams.get('uid');

    console.log(uid);
  }

}

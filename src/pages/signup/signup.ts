import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { User } from "../../models/user";
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';

import { LoginPage } from '../login/login';

/**
 * Generated class for the SignupPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-signup',
  templateUrl: 'signup.html',
})
export class SignupPage {
  user = {} as User;
  constructor(private afd: AngularFireDatabase, private afAuth: AngularFireAuth,public navCtrl: NavController, public navParams: NavParams) {
  }

  async register(user: User) {
    try {
      if (user.password == user.password2) {
        const result = await this.afAuth.auth.createUserWithEmailAndPassword(
          user.email,
          user.password
        ).then(data =>{
          console.log()
          let info = {user: user.user, name: user.name, email: user.email, admin: false, points: 0}
          this.afd.list("users/").update(data.uid,info);
          this.navCtrl.setRoot(LoginPage);
        });
      }else{
        alert("contrase;a no coicide");
      }
    } catch (e) {
      if (e.code == "auth/invalid-email") {
        alert("correo invalido");
      }else{
        alert("Contrase;a debil");
      }
    }
  }

}

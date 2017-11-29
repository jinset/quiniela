import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController  } from 'ionic-angular';
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
  constructor(private toastCtrl: ToastController, private afd: AngularFireDatabase, private afAuth: AngularFireAuth,public navCtrl: NavController, public navParams: NavParams) {
  }

  async register(user: User) {
    try {
      let check = await this.checkUser(user.user);
      if (!check) {
        if (user.password == user.password2) {
          const result = await this.afAuth.auth.createUserWithEmailAndPassword(
            user.email,
            user.password
          ).then(data =>{
            console.log()
            let info = {user: user.user, name: user.name, email: user.email, admin: false, points: 0, token: ""};
            this.afd.list("users/").update(data.uid,info);
            this.navCtrl.setRoot(LoginPage);
          });
        }else{
          this.presentToast("contraseñas no coicide");
        }
      } else{
        this.presentToast("Nombre de usuario ya existe");
      }
    } catch (e) {
      if (e.code == "auth/invalid-email") {
        this.presentToast("correo invalido");
      }else{
        this.presentToast("Contraseña debil");
      }
    }
  }

  async checkUser(user){
    return new Promise((resolve, reject) =>{
      var nickExits = this.afd.database.ref('users/').orderByChild("user").equalTo(user);
      nickExits.once('value', function(snap){
        console.log(snap.exists());
        resolve(snap.exists());
      })
    })
  }

  presentToast(msj) {
    let toast = this.toastCtrl.create({
      message: msj,
      duration: 3000,
      position: 'bottom'
    });
  
    toast.onDidDismiss(() => {
      console.log('Dismissed toast');
    });
  
    toast.present();
  }

}

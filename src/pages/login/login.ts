import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, ToastController  } from 'ionic-angular';
import { User } from "../../models/user";
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';
import { Storage } from '@ionic/storage';
import { SignupPage } from '../signup/signup';
import { HomePage } from '../home/home';
/**
 * Generated class for the LoginPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {
  user = {} as User;
  constructor(public storage: Storage, private toastCtrl: ToastController, private afd: AngularFireDatabase, private afAuth: AngularFireAuth,
    public navCtrl: NavController, public navParams: NavParams, public loadingCtrl: LoadingController) {
  }

  public loading = this.loadingCtrl.create({
    content: "Cargando...",
  });
  
  async login(user: User) {
    this.loading.present();
    try {
      const result = await this.afAuth.auth.signInWithEmailAndPassword(user.email, user.password).then(data =>{
        this.storage.set('isLogged', data.uid);
        this.navCtrl.setRoot(HomePage, {uid: data.uid});
        this.loading.dismiss();
      });
    }
    catch (e) {
      this.loading.dismiss();
      console.error(e);
      this.presentToast("Correo electronico o contraseña no es valida");
      
    }
  }

  signup(){
    this.navCtrl.push(SignupPage);
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

import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NavController, MenuController, ToastController, AlertController, LoadingController } from '@ionic/angular';
import { LoginService } from 'src/app/services/login.service';
import { Events } from '@ionic/angular';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  public onLoginForm: FormGroup;
  registerUsers:any = [];
  public Logged: boolean = false;

  constructor(
    public navCtrl: NavController,
    public menuCtrl: MenuController,
    public toastCtrl: ToastController,
    public alertCtrl: AlertController,
    public loadingCtrl: LoadingController,
    private formBuilder: FormBuilder,
    public LoginService: LoginService,
    public Events: Events
  ) { 
    Events.subscribe('user:logged', (check) => {
      // user and time are the same arguments passed in `events.publish(user, time)`
      if(check){
        console.log('Welcome');
        this.goToHomeNow();
      }});
  }

  ionViewWillEnter() {
    this.menuCtrl.enable(false);
  }

  ngOnInit() {
    this.getUsers();

    this.onLoginForm = this.formBuilder.group({
      'email': [null, Validators.compose([
        Validators.required
      ])],
      'password': [null, Validators.compose([
        Validators.required
      ])]
    });
  }

  async forgotPass() {
    const alert = await this.alertCtrl.create({
      header: 'Forgot Password?',
      message: 'Enter you email address to send a reset link password.',
      inputs: [
        {
          name: 'email',
          type: 'email',
          placeholder: 'Email'
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Confirm Cancel');
          }
        }, {
          text: 'Confirm',
          handler: async () => {
            const loader = await this.loadingCtrl.create({
              duration: 2000
            });

            loader.present();
            loader.onWillDismiss().then(async l => {
              const toast = await this.toastCtrl.create({
                showCloseButton: true,
                message: 'Email was sended successfully.',
                duration: 3000,
                position: 'bottom'
              });

              toast.present();
            });
          }
        }
      ]
    });

    await alert.present();
  }

  // // //
  goToRegister() {
    this.navCtrl.navigateRoot('/register');
  }

  getUsers() {
    this.LoginService.getUsers().subscribe(
      data => {
        this.registerUsers = data;
        console.log(data);
      }
    )
  }

  goToHome() {
    
     this.Logged = this.LoginService.getLogin({'email' : this.onLoginForm.value.email , 'password' : this.onLoginForm.value.password});
   // console.log(typeof(this.Logged));
    if (this.Logged) {
        console.log(this.onLoginForm.value);
        console.log("home");
      this.navCtrl.navigateRoot('/home-results');
  }
}

  goToHomeNow(){
    this.navCtrl.navigateRoot('/home-results');
  }

}

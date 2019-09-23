import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NavController} from '@ionic/angular';
import { LoginService } from 'src/app/services/login.service';
import { ImagePicker } from '@ionic-native/image-picker/ngx';
import { File, FileEntry } from '@ionic-native/file/ngx';
import {HttpClient} from '@angular/common/http';
import {Camera} from '@ionic-native/camera/ngx';
import { HttpHeaders } from '@angular/common/http';
import {
  ActionSheetController,
  AlertController,
  LoadingController,
  ModalController,
  ToastController
} from '@ionic/angular';



@Component({
  selector: 'app-sell',
  templateUrl: './sell.page.html',
  styleUrls: ['./sell.page.scss'],
})

export class SellPage implements OnInit {
  public onCarListForm: FormGroup;
  public serverURL = 'https://51.75.76.50:3030';
  imageResponse: any;
  options: any;

  userId: number = null;
  baseUrl: string = 'https://51.75.76.50:3030';
  pageTitle: string = 'upload';

  public loading;
  public myPhoto: any;
  public realUrl: string;
   
  

  constructor(
    public navCtrl: NavController,
    private formBuilder: FormBuilder,
    private loginService: LoginService,
    private imagePicker: ImagePicker,
    public http: HttpClient,
    public file: File,
    public alertCtrl: AlertController,
    public toastCtrl: ToastController,
    public camera: Camera,
    public loadingCtrl: LoadingController,
    public modalCtrl: ModalController,
    public actionSheetCtrl: ActionSheetController
  ) { }

   

  ngOnInit() {
    this.onCarListForm = this.formBuilder.group({
      'model': [null, Validators.compose([
        Validators.required
      ])],
      'location': [null, Validators.compose([
        Validators.required
      ])],
      'year': [null, Validators.compose([
        Validators.required
      ])],
      'startDate': [null, Validators.compose([
        Validators.required
      ])],
      'endDate': [null, Validators.compose([
        Validators.required
      ])],
      'description': [null, Validators.compose([
        Validators.required
      ])]
    });
  }

  onPublish() {
    console.log(this.onCarListForm.value);
    this.loginService.getRegisterCar(this.onCarListForm.value, this.realUrl);
    this.navCtrl.navigateForward('/home-results');
  }

  getImages() {
    this.fromGallery();
  }

  
  private fromGallery(): void {
    this.camera.getPicture({
      sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
      destinationType: this.camera.DestinationType.FILE_URI,
      quality: 50,
      targetWidth: 360,
      targetHeight: 360,
      encodingType: this.camera.EncodingType.PNG,
      allowEdit: true
    }).then(imageData => {
      this.myPhoto = imageData;
      this.uploadPhoto(imageData);
    }, error => {
      console.log(JSON.stringify(error));
    });
  }

  private uploadPhoto(imageFileUri: any): void {
  
    this.file.resolveLocalFilesystemUrl(imageFileUri)
      .then(entry => (<FileEntry>entry).file(file => this.readFile(file)))
      .catch(err => console.log(err));
  }


  private readFile(file: any) {
    const reader = new FileReader();
    console.log('reading file', file);
    reader.onloadend = () => {
      const formData = new FormData();
      const imgBlob = new Blob([reader.result], {type: file.type});
      formData.append('file', imgBlob,     Math.floor(Math.random() * 50000)  + file.name );
      this.postData(formData);
    };
    reader.readAsArrayBuffer(file);
  }

  private postData(formData: FormData) {
    this.uploadImage(formData, this.userId);
  }

  private uploadImage(formData, userId) {
    return new Promise((resolve, reject) => {
      this.post('upload', formData
      ).subscribe(response => {
        this.realUrl = response["realUrl"];
        console.log(this.realUrl);
        resolve(response);
      }, err => {
        console.log(err);
        reject(err);
      });
    })
  }

  private post(endpoint: string, body: any = null) {

   

    return this.http.post(this.baseUrl + '/' + endpoint , body);
  }

  
 
}








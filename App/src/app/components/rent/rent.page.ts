import { Component, OnInit } from '@angular/core';
import { LoginService } from 'src/app/services/login.service';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-rent',
  templateUrl: './rent.page.html',
  styleUrls: ['./rent.page.scss'],
})
export class RentPage implements OnInit {

  searchKey: string;
  array: any = [];
  cars: any = [];
  toast: any;

  constructor(private service: LoginService,private toastController: ToastController
  ) { }

  ngOnInit() {
    this.getData();
  }

  getData() {
    this.service.getCars().subscribe(
      data => {
        console.log(data);
        this.array = data;
        this.getCars();
      }
    );
  }
    onClickToast2() {
        this.toast = this.toastController.create({
            message: 'BOOKED',
            duration: 3000
        }).then((toastData) => {
            console.log(toastData);
            toastData.present();
        });
    }

  getCars() {
    this.cars = [];
    for (let i = 0; i < this.array.length; i ++ ) {
      // let ol:any = Object.keys(this.array[i]);
      if (this.array[i].model !== undefined) {
       
        this.cars.push(this.array[i]);
      }
    }
    console.log(this.cars);
  }
  onClickToast() {


    console.log(this.cars);
  }
  onSearch(){
    console.log('search key =' + this.searchKey);
    this.service.getQueryCars(this.searchKey).subscribe(
      data => {
        console.log(data);
        this.array = data;
        this.getCars();
      }
    );

  }
  onClickDelToast(brId){
      console.log(brId);

      this.service.getBuyCars(brId).subscribe(
        data => {
          console.log(data);
          this.array = data;
          this.getCars();
        }
      );
      this.onClickToast2();

  }

}

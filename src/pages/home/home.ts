import { Component } from '@angular/core';
import { NavController, ToastController } from 'ionic-angular';
import { ZebpayService } from '../services/zebpayService';
import { LocalStorage } from '../storage/localStorage'
@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
  providers: [ZebpayService, LocalStorage,ToastController]
})
export class HomePage {
  public change = false;
  public resultsDisplay = false;
  public currentStake: number;
  public currency = 'INR';
  public currencyKeys: any;
  public currencyList: any;
  public currentSellingValue: number;
  public currentSellRate: number;
  constructor(public navCtrl: NavController, public zebpay: ZebpayService, public storage: LocalStorage, public toastCtrl: ToastController) {

  }

  ngOnInit() {
    var me = this;
    me.storage.getAttr('currentStake')
      .then(result => {
        me.currentStake = result;
        if (!me.change && me.currentStake > 0) {
          me.getBitcoinRates();
        }
      })
      .catch(err => {
        me.change = true;
      });
    me.storage.getAttr('currency')
      .then(result => {
        me.currency = result;
      })
      .catch(err => {
        me.change = true;
      });
    this.zebpay.getCurrencyJson()
      .then(result => {
        me.currencyList = result;
        me.currencyKeys = Object.keys(result);
      })
      .catch(err => {
        me.presentToast();
      });

    setInterval(function () {
      if (!me.change && me.currentStake > 0) {
        me.getBitcoinRates();
      }
    }, 10000);
  }

  getBitcoinRates(callback?: any) {
    var me = this;
    if (me.currentStake > 0) {
      me.zebpay.getBitCoinRates(me.currency)
        .then(result => {
          me.resultsDisplay = true;
          me.currentSellRate = result.sell;
          me.currentSellingValue = Math.round(result.sell * me.currentStake);
          if (callback) {
            callback();
          }
        })
        .catch(err => {
          me.presentToast();
          me.resultsDisplay = false;
          if (callback) {
            callback();
          }
        });
    }
  }

  updateValues() {
    var me = this;
    me.change = true;
  }

  saveValues() {
    var me = this;
    me.change = false;
    me.getBitcoinRates();
    //save the values
    me.storage.setAttr("currentStake", me.currentStake);
    me.storage.setAttr("currency", me.currency);
  }

  doRefresh(refresher) {
    var me = this;
    me.getBitcoinRates(function () {
      refresher.complete();
    })
  }

  presentToast() {
    let toast = this.toastCtrl.create({
      message: 'Check connectivity.',
      duration: 3000,
      position: 'bottom'
    });

    toast.present();
  }

}

import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/toPromise';
import { currencyJson } from '../storage/currencyJson';
//const currencyJson = "https://api.myjson.com/bins/6egf5";
const bitcoinRate = "https://api.zebpay.com/api/v1/ticker?currencyCode=";

@Injectable()
export class ZebpayService {
    constructor(public http: Http) {

    }

    getCurrencyJson(): Promise<any> {
        var me = this;
        return new Promise((resolve,reject) => {
            resolve(currencyJson);
        });
    }

    getBitCoinRates(currency) {
        var me = this;
        return me.http.get(bitcoinRate + currency)
            .toPromise()
            .then(result => {
                return JSON.parse(result['_body']);
            })
            .catch(err => {
                return null;
            });
    }
}
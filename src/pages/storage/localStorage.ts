import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage'
@Injectable()
export class LocalStorage {
    constructor(public storage: Storage) {

    }

    getAttr(attr):Promise<any> {
        var me = this;
        return me.storage.get(attr).then((val) => {
            return val;
        });
    }

    setAttr(attr, val):Promise<any> {
        var me = this;
        return me.storage.set(attr,val);
    }
}
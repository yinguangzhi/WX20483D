export default class BaseSigleton<T> {
    // static get Instance(): T {
    //     if (!this._i) {

    //         this._i = this.i()//this._i = new this(); return this._i;
    //         this._i as T
    //     }

    //     return this._i;
    // }

    static Instance<T extends {}>(this: new () => T): T {
        if (!(<any>this)._i) {
            (<any>this)._i = new this();
        }
        return (<any>this)._i;
    }
    private static _i;
}
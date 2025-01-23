//Copyright (c) 2020-2030 Flamenco Qian. All rights reserved.


/**
 * 简单字典
 */
export default class Dictionary<T extends { id: number | string }> {

    private _datas: any;
    private _length: number;

    constructor(datas?: T[]) {
        this._datas = {};
        this._length = 0;

        datas && this.add(datas);
    }

    get length(): number {
        return this._length;
    }

    get values(): Array<T> {
        const list: Array<T> = [];
        for (let key in this._datas) {
            list.push(this._datas[key]);
        }
        return list;
    }


    /**
     * 添加
     * @param datas 
     */
    add(datas: T | T[]): void {
        const action = (t: T) => {
            const key = t.id;
            if (this._datas[key]) {
                console.error("存在相同键值：", key);
            } else {
                this._datas[key] = t;
                this._length++;
            }
        };

        if (datas instanceof Array) {
            for (const data of datas) {
                action(data);
            }
        } else {
            action(datas);
        }
    }


    /**
     * 删
     * @param key 
     */
    delete(key: number | string): void {
        if (this._datas[key]) {
            delete this._datas[key];
            this._length--;
        } else {
            console.error("元素不存在");
        }
    }


    /**
     * 查找
     * @param condition 条件
     * @returns 
     */
    find(condition: number | string | ((t: T) => boolean)): T {
        if (typeof condition == "string" || typeof condition == "number") {
            return this._datas[condition];
        } else if (typeof condition == "function") {
            for (let key in this._datas) {
                if (condition(this._datas[key])) {
                    return this._datas[key];
                }
            }
        }
        return null!;
    }


    /**
     * 筛选
     * @param c 过滤条件
     * @returns 
     */
    filter(c: (t: T) => boolean): Array<T> {
        const list: Array<T> = [];
        for (let key in this._datas) {
            if (c(this._datas[key])) {
                list.push(this._datas[key]);
            }
        }
        return list;
    }


    /**
     * 清空
     */
    clear(): void {
        this._datas = {};
    }


    toString(): string {
        return JSON.stringify(this._datas);
    }

}
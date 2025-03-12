import { _decorator, Component, Node } from 'cc';

const { ccclass, property } = _decorator;

@ccclass('ArrayHelper')
export class ArrayHelper{
    
    /** 是否在数组内 */
    static isInArray(arr : any[],val : any)
    {
        return arr.indexOf(val) >= 0;
    }

    static discardManyFromArray(array: any[],deleteArr: any[])
    {
        if (!array) return;
        if (array.length == 0) return;

        if (!deleteArr) return;
        if (deleteArr.length == 0) return;

        while (true)
        {
            let k = deleteArr[0];
            this.discardFromArray(array, k);
            deleteArr.splice(0, 1);

            if (deleteArr.length == 0) break;
        }
    }

    /** 从列表中移除某个元素 */
    static discardFromArray(arr: any[],obj : any,_setNull = false)
    {
        if (!arr) return false;

        if (arr.length == 0) return false; 

        let _idx = arr.indexOf(obj);
        if (_idx == -1) return false;

        if (_setNull)
        {
            arr[_idx] = null;
        }
        else
        {
            arr.splice(_idx, 1);
        }    
        return true;
    }


    /** 随机排序 */
    static sort(list: any[],_isRandom : boolean = true)
    {
        list.sort(() => {
            return Math.random() > 0.5 ? 1 : -1;
        });
    }

    static addItem(_array : any[],_item : any,_checkExists = true)
    {
        let _idx = _array.indexOf(_item)
        if (_checkExists)
        {
            if(_idx == -1)
            {
                _array.push(_item);
            }
        }
        else
        {
            _array.push(_item);
        }
        
    }
}



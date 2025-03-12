/*
 * @Author: shaoshude yinhuanhuan@31724753.onaliyun.com
 * @Date: 2025-02-12 22:35:32
 * @LastEditors: shaoshude yinhuanhuan@31724753.onaliyun.com
 * @LastEditTime: 2025-03-02 21:24:27
 * @FilePath: \ColorSlider\assets\scripts\helper\FrequencyHelper.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('FrequencyHelper')
export class FrequencyHelper extends Component {
    
    static isEmpty (obj : any) {
        
        return obj === '' || obj === null || obj === undefined;
    }

    static sks = ["a","b","c","d","e","f","g","h","i","j","k","l","m","n","o","p","q","r","s","t","u","v","w","x","y","z"]
    static ks = ["A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z"]
    static getV(_value : number,_small : boolean)
    {
        if(_value >= this.sks.length)
        {
            console.warn("overly ks");
            return "";
        }
        
        if(_small) return this.sks[_value];
        else return this.ks[_value]
    }

    
    /** 克隆2 */
    static copy(from : any)
    {
        let arg = JSON.stringify(from);
        
        let arg2 = JSON.parse(arg);
        return arg2;
    }

    
    static getEnumNameByValue<T extends string | number>(enumObj: T, value: T[keyof T]): keyof T {
        return (Object.keys(enumObj) as (keyof T)[]).find(key => enumObj[key] === value);
      }
}



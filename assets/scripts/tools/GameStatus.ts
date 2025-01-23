
/**
 * Predefined variables
 * Name = GameStatus
 * DateTime = Sun Dec 05 2021 01:47:03 GMT+0800 (中国标准时间)
 * Author = Flamenco
 */


export module GameStatus {


    export enum CubeType {
        Normal = 0,
        Any = 1,
        Bomb = 2,
    }


    export enum grid {
        idle = 0,
        active,
        select,
        recycle,
    }


    export enum ball {
        idle = 0,
        fall,
        select,
        recycle,
    }



}
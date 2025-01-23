import { Vec2, Vec3, v2, v3 } from "cc";

export class MathUtil {

    //#region 向量
    public static readonly D2G = 180 / Math.PI;
    //法线向量
    public static getNormalV2(ori: Vec2 | Vec3) {
        return v2(-ori.y, ori.x);
    }

    public static getNormalV3(a: Vec3, b: Vec3) {
        let x = a.y * b.z - a.z * b.y;
        let y = a.z * b.x - a.x * b.z;
        let z = a.x * b.y - a.y * b.x;
        return v3(x, y, z);
    }

    //向量1在向量2上的投影
    public static getProjectV2(a: Vec2 | Vec3, b: Vec2 | Vec3) {
        var dotProduct = a.x * b.x + a.y * b.y;
        var v1MagnitudeSquared = a.x * a.x + a.y * a.y;
        var scaleFactor = dotProduct / v1MagnitudeSquared;
        return v2(scaleFactor * a.x, scaleFactor * a.y);
    }

    public static getProjectV3(a: Vec3, b: Vec3) {
        var dotProduct = a.x * b.x + a.y * b.y + a.z * b.z;
        var v1MagnitudeSquared = a.x * a.x + a.y * a.y + a.z * a.z;
        var scaleFactor = dotProduct / v1MagnitudeSquared;
        return v3(scaleFactor * a.x, scaleFactor * a.y, scaleFactor * a.z);
    }


    // 二维向量旋转向量，归一化返回
    public static getRotateDirV2(vector: Vec2 | Vec3, angle: number) {
        angle /= this.D2G;
        var cosAngle = Math.cos(angle);
        var sinAngle = Math.sin(angle);

        // 二维旋转矩阵
        var rotationMatrix = [
            [cosAngle, -sinAngle],
            [sinAngle, cosAngle]
        ];

        // 应用旋转矩阵
        var rotatedV2 = v2(
            rotationMatrix[0][0] * vector.x + rotationMatrix[0][1] * vector.y,
            rotationMatrix[1][0] * vector.x + rotationMatrix[1][1] * vector.y
        );

        return this.normalizeV2(rotatedV2);
    }
    // 归一化
    public static normalizeV2(a: Vec2) {
        var magnitude = Math.sqrt(a.x * a.x + a.y * a.y);
        return v2(a.x / magnitude, a.y / magnitude);
    }

    //extend
    public static extendV2() {
        Vec2["prototype"]["toV3"] = function () {
            return v3(this.x, this.y);
        }
    }

    public static extendV3() {
        Vec3["prototype"]["toV2"] = function () {
            return v2(this.x, this.y);
        }
    }
    //#endregion

    public static bezierV3(c1: Vec3, c2: Vec3, c3: Vec3, t: number) {
        return v3(
            (1 - t) * (1 - t) * c1.x + 2 * t * (1 - t) * c2.x + t * t * c3.x,
            (1 - t) * (1 - t) * c1.y + 2 * t * (1 - t) * c2.y + t * t * c3.y,
            (1 - t) * (1 - t) * c1.z + 2 * t * (1 - t) * c2.z + t * t * c3.z
        )
    }

    /**
    *  二阶贝塞尔曲线 运动
    * @param target
    * @param {number} duration
    * @param {} c1 起点坐标
    * @param {} c2 控制点
    * @param {Vec3} to 终点坐标
    * @param opts
    * @returns {any}
    */
    public static bezierV2(t: number, p1: Vec3, cp: Vec3, p2: Vec3) {
        let x = (1 - t) * (1 - t) * p1.x + 2 * t * (1 - t) * cp.x + t * t * p2.x;
        let y = (1 - t) * (1 - t) * p1.y + 2 * t * (1 - t) * cp.y + t * t * p2.y;
        return v3(x, y, 0);
    }

}


; (() => {
    MathUtil.extendV2();
    MathUtil.extendV3();
})();
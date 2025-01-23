
import { _decorator, Component, Node, RigidBody, v3, Vec3, BoxCollider, ICollisionEvent, CCInteger, isValid, tween, ParticleSystem, randomRangeInt, Animation } from 'cc';
import { GameControl } from './GameControl';
import { GameObjPool } from "./GameObjPool";
import { GameStatus } from './tools/GameStatus';
import { DataManager } from './tools/DataManager';
import { ALHelper } from './tools/ALHelper';
import { AUDIO_NAME, AudioMgr } from './tools/AudioMgr';


const { ccclass, property } = _decorator;


class UnitAbout {
    id: number;
    unit: Unit;
    normalVec: Vec3;

    constructor(_id: number, _unit: Unit, _normalVec: Vec3) {
        this.id = _id;
        this.unit = _unit;
        this.normalVec = _normalVec;
    }

    public isIDVaild() {
        return this.id == this.unit.UnitID;
    }
    public IsBindVaild() {
        return this.unit.couldBind;
    }
}

@ccclass('Unit')
export class Unit extends Component {
    public id: number = 0;
    public set UnitID(_id: number) {
        this.id = _id;
    }
    public get UnitID() {
        return this.id;
    }

    @property(CCInteger)
    public value = 2;

    public upPower = 480;
    private connectList: Array<UnitAbout> = [];

    checkDead = false;
    @property(RigidBody)
    public rigidbody: RigidBody = null;

    @property(BoxCollider)
    public collider: BoxCollider = null;

    public couldBind: Boolean = true;

    isForceing = false;
    isFree = false;

    public lightTran: Node;
    private type : GameStatus.CubeType = GameStatus.CubeType.Normal;

    start() {
        this.upPower = 560;
        this.collider.on('onCollisionExit', this.onCollisionExit, this);
        this.collider.on('onCollisionEnter', this.onCollisionEnter, this);
    }

    update(deltaTime: number) {
        
        if (this.checkDead && this.isCouldDead()) {
            // this.checkDead = false;
            GameControl.Instance.GameOverAction();
        }
        
        if (this.isForceing) {

            let velocity = v3();
            this.rigidbody.getLinearVelocity(velocity);

            if (velocity.y < 0.02) {

                this.isForceing = false;

                let find = null;
                if (randomRangeInt(0, 100) >= 30) find = GameControl.Instance.getConnectUnit(this);
                
                if (find) {
                    let pos2 = new Vec3(find.node.position.x, find.node.position.y, find.node.position.z);//find.node.worldPosition; //
                    let otherDir = pos2.subtract(this.node.position);
                  
                    otherDir.y = 0;
                    otherDir.normalize();
                    // console.log(otherDir);

                    this.rigidbody.applyForce(otherDir.multiplyScalar(200));
                }
                
                tween(this.node)
                    .to(0.18, { scale: new Vec3(1.5, 1.5, 1.5) })
                    .to(0.18, { scale: new Vec3(1, 1, 1) })
                    .call(() => {
                        if (!this.couldBind) {

                            this.couldBind = true;

                            this.unschedule(this.delayEnableBind);
                        }
                    })
                    .start();
            }

        }

        if (!this.couldBind) return;

        if (this.connectList.length == 0) return;

        if (!this.connectList[0].isIDVaild()) {

            this.connectList.splice(0, 1);
            return;
        }

        if (!this.connectList[0].IsBindVaild()) {

            this.connectList.splice(0, 1);
            return;
        }

        this.collisionAction(this.connectList[0]);
        this.connectList.splice(0, 1);
    }

    setCompleteData(val: number) {

        GameControl.Instance.setSkin(this.node, val,this.type);
        this.rigidbody.isKinematic = false;

        this.checkDead = true;
        this.couldBind = true;
        this.isFree = true;

        this.value = val;
    }

    setData(val: number,fromBind : boolean,type : GameStatus.CubeType = GameStatus.CubeType.Normal) {
        GameControl.Instance.setSkin(this.node, val,type);
        this.rigidbody.isKinematic = false;
        this.checkDead = false;
        this.isFree = fromBind;
        
        this.value = val;
        this.type = type;

        let _delayTime = fromBind ? 0.8 : 0.2;
        this.scheduleOnce(this.delayEnableBind, _delayTime)
    }

    MoveForward(power: number) {
        if (!this.node.activeInHierarchy) return;

        let forceVec = new Vec3(0, 0, -power);
        // this.rigidbody.applyForce(forceVec);
        this.rigidbody.setLinearVelocity(new Vec3(0, 0, -25));
        this.isFree = true;

        this.scheduleOnce(this.delayCheckDead, 1.2)

    }

    delayEnableBind() {
        this.couldBind = true;
    }

    delayCheckDead() {
        if (isValid(this)) this.checkDead = true;
    }

    delayAddForce(torVec: Vec3) {
        this.scheduleOnce(() => {

            // let find = GameControl.Instance.getConnectUnit(this);
            // if (find) {
            //     let pos2 = new Vec3(find.node.position.x, find.node.position.y, find.node.position.z);
            //     this.scheduleOnce(() => {
            //         if (this.isForceing) {

            //             let otherDir = pos2.subtract(this.node.position);
            //             otherDir.y = 0;
            //             console.log(otherDir);

            //             this.rigidbody.applyForce(otherDir.multiplyScalar(200));
            //         }
            //     }, 0.2);
            // }

            let forceVec = new Vec3(0, this.upPower, 0);

            this.rigidbody.applyForce(forceVec);



            // let torVec = new Vec3(100, 100, 100);
            // this.rigidbody.applyTorque(torVec.multiplyScalar(10));

            this.delayGetVelocity();
        }, 0.01)
    }

    delayGetVelocity() {
        this.scheduleOnce(() => {
            let velocity = v3();
            this.rigidbody.getLinearVelocity(velocity);
            this.isForceing = velocity.y > 0.03;
            
            if (!this.isForceing) { 
                this.couldBind = true;
            }

        }, 0)

    }

    Hide() {
        this.unschedule(this.delayCheckDead);
        this.unschedule(this.delayEnableBind);

        this.value = 0;
        this.UnitID = 0;
        this.isFree = false;
        this.couldBind = true;
        this.checkDead = false;
        this.connectList.length = 0;
        this.rigidbody.isKinematic = true;

        GameControl.Instance.restoreNote(this);
    }



    isLife() {
        return this.id != 0 && this.isFree && !this.isCouldDead();
    }

    isCouldDead() {
        return this.node.position.z + this.node.parent.position.z > 2.5;
    }

    couldRevive() {
        return this.value > 0 && this.node.position.z + this.node.parent.position.z > 2;
    }

    isCouldRecord() {
        return this.couldBind && this.connectList.length == 0 && this.type == GameStatus.CubeType.Normal;
    }

    isAny()
    {
        return this.type == GameStatus.CubeType.Any;
    }


    collisionAction(ua: UnitAbout) {
        if (GameControl.Instance.isRealGameOver) {
            return;
        }

        AudioMgr.Instance().playAudio(AUDIO_NAME.bindAudio);

        GameControl.Instance.refreshScore(this.value * 2, false);

        ua.unit.Hide();

        this.couldBind = false;
        this.setData(this.value * 2,true);
        this.scheduleOnce(this.delayCheckDead, 1.2)

        this.delayAddForce(ua.normalVec);

        let effect = GameObjPool.Instance().get("effect");
        if (!effect) return;

        effect.parent = this.node.parent;
        effect.position = this.node.position;

        let temps = effect.getComponentsInChildren(ParticleSystem);
        for (let i = 0; i < temps.length; i++) { 
            temps[i].clear();
            
            temps[i].stop();
            temps[i].play();
        }

        let tempAnimas : Animation[] = effect.getComponentsInChildren(Animation);
        for (let i = 0; i < tempAnimas.length; i++) { 
            tempAnimas[i].play();
        }

        this.scheduleOnce(() => { 
            GameObjPool.Instance().put("effect",effect);
        }, 0.8)
        
        if (DataManager.Instance().userData.vibrate == 1) ALHelper.Instance().vibrateAction(0.006);
    }

    onCollisionEnter(event: ICollisionEvent) {

        if (this.value == 0) return;

        if (this.value >= GameControl.Instance.topValue) return;
        
        if (this.type == GameStatus.CubeType.Any) return;

        if (event.otherCollider.node.layer != 1) return;
        
        
        let tarUnit = event.otherCollider.node.getComponent(Unit);

        if (tarUnit == null || tarUnit.value == 0) return;

        if (this.type == GameStatus.CubeType.Bomb)
        {
            let effect = GameObjPool.Instance().get("effect");
            effect.parent = this.node.parent;
            effect.position = this.node.position;

            let temps = effect.getComponentsInChildren(ParticleSystem);
            for (let i = 0; i < temps.length; i++) { 
                temps[i].clear();
                
                temps[i].stop();
                temps[i].play();
            }

            let tempAnimas : Animation[]= effect.getComponentsInChildren(Animation);
            for (let i = 0; i < tempAnimas.length; i++) { 
                tempAnimas[i].play();
            }

            setTimeout(() => {
                GameObjPool.Instance().put("effect", effect);
            }, 800);
            
                
            GameControl.Instance.addToBomb(this,tarUnit);
            return;
        } 

        if (tarUnit.value != this.value )
        {
            if(!tarUnit.isAny())
            {
                return;
            }
        } 

        let normalVec = new Vec3(0, 0, 0);
        event.contacts[0].getWorldNormalOnA(normalVec);
        // console.log(normalVec);

        this.connectList.push(new UnitAbout(tarUnit.id, tarUnit, normalVec));
    }

    onCollisionExit(event: ICollisionEvent) {
        if (event.otherCollider.node.layer != 1) return;
        let tarUnit = event.otherCollider.node.getComponent(Unit);
        if (tarUnit == null) return;

        let ua = this.connectList.find(element => element.unit == tarUnit);
        if (ua != null) {
            let _idx = this.connectList.indexOf(ua);
            this.connectList.splice(_idx, 1);
        }
    }
}

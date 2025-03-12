
import { _decorator, Component, Node, UITransform, v3, Vec3, Widget } from 'cc';
const { ccclass, property } = _decorator;

/**
 * @description 根节点类,自动产生常规ui界面的父物体，弹窗父物体，提示窗父物体
 */
@ccclass('Root')
export class Root extends Component {

    /** 常规ui界面的父物体 */
    private __uiContent: Node;
    get uiContent(): Node
    {
        if (!this.__uiContent)
        {
            let _arg = this.node.getChildByName("UIContent");
            
            if(_arg) this.__uiContent = _arg;
            else this.__uiContent = this.generateContent("UIContent");    
        }
        return this.__uiContent;
    }

    /** 弹窗父物体 */
    private __popContent: Node;
    get popContent(): Node
    {
        if (!this.__popContent)
        {
            this.__popContent = this.generateContent("PopContent");    
        }
        return this.__popContent;
    }

    /** 提示窗父物体 */
    private __hintContent: Node;
    get hintContent(): Node
    {
        if (!this.__hintContent)
        {
            this.__hintContent = this.generateContent("HintContent");    
        }
        return this.__hintContent;
    }

    onLoad(): void {
        
    }

    start() {

    }

    update(deltaTime: number) {
        
    }

    generateContent(str : string)
    {
        let note = new Node();
        note.name = str;

        this.node.addChild(note);
        note.position = v3();
        
        let ut = note.addComponent(UITransform);
        // ut.width = Config.width;
        // ut.height = Config.height;
        let widget = ut.addComponent(Widget);
        widget.isAlignLeft = true;
        widget.isAlignRight = true;
        widget.isAlignTop = true;
        widget.isAlignBottom = true;
        widget.left = 0;
        widget.right = 0;
        widget.top = 0;
        widget.bottom = 0;

        return note;
    }
}



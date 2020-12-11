// Learn cc.Class:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] https://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    properties: {
        //最大高度
        jumpHeight: 0,
        //上跳持续时间
        jumpDuration: 0,
        //最大速度
        maxMoveSpeed: 0,
        //加速度
        accel: 0,
        jumpAudio: {
            default: null,
            type: cc.AudioClip
        }

    },

    playJumpSound () {
        //调用引擎播放声音
       cc.audioEngine.playEffect(this.jumpAudio); 
    },

    setJumpAction () {
        let scale1 = cc.scaleTo(0.1, 1, 0.5);
        let scale2 = cc.scaleTo(0.1, 1, 1);
        let jumpUp = cc.moveBy(this.jumpDuration, cc.v2(0, this.jumpHeight)).easing(cc.easeCubicActionOut());
        let jumpDown = cc.moveBy(this.jumpDuration, cc.v2(0, -this.jumpHeight)).easing(cc.easeCubicActionIn());
        //添加一个回调函数
        let callBack = cc.callFunc(this.playJumpSound, this);
        return cc.repeatForever(cc.sequence(scale1, scale2, jumpUp, jumpDown, callBack));
    },

    onKeyDown (event) {
        switch(event.keyCode) {
            case cc.macro.KEY.a:
                this.accLeft = true;
                break;
            case cc.macro.KEY.d:
                this.accRight = true;
                break
            default:
                break;
        }
    },

    onKeyUp (event) {
        switch(event.keyCode) {
            case cc.macro.KEY.a:
                this.accLeft = false;
                break;
            case cc.macro.KEY.d:
                this.accRight = false;
                break;
            default:
                break;
        }
    },

    playJumpAction () {
        this.node.runAction(this.setJumpAction());
    },

    
    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        // this.leftDirec = false;
        // this.rightDirec = false;
        //跳跃动作
        // this.jumpAction = this.setJumpAction();
        // this.node.runAction(this.jumpAction);
        //加速度开关
        this.accLeft = false;
        this.accRight = false;
        //主角当前水平方向移动速度
        this.xSpeed = 0;
        //注册键盘监听事件
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_UP, this.onKeyUp, this);
    },

    start () {

    },

    updatePerFrame (dt) {
        //根据加速度更新速度
        if (this.accLeft) {
            this.xSpeed -= this.accel * dt;
        } else if (this.accRight) {
            this.xSpeed += this.accel * dt;
        }
        //不能超过最大速度
        if ( Math.abs(this.xSpeed) > this.maxMoveSpeed) {
            this.xSpeed = this.maxMoveSpeed * this.xSpeed / Math.abs(this.xSpeed);
        }
        //更新节点坐标，不能超过屏幕宽度
        let posx = this.node.x + this.xSpeed * dt;
        if (Math.abs(posx) > (this.node.getParent().width/2 - this.node.width/2)) {
            posx = (this.node.getParent().width/2 - this.node.width/2) * posx / Math.abs(posx);
            //到达边界时，速度将为0
            this.xSpeed = 0
        }
        this.node.x = posx;
    },

    onDestroy () {
        //取消键盘监听
        cc.systemEvent.off(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
        cc.systemEvent.off(cc.SystemEvent.EventType.KEY_UP, this.onKeyUp, this);
    }
});
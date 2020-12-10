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
        //主角和星星之间的距离如果小于改距离时，就算成功收集
        pickRadius: 0
    },

    getPlayerDistance () {
        //获取player的坐标
        let playerPos = this.game.player.getPosition();
        //根据两点位置计算两点距离
        let distance = this.node.position.sub(playerPos).mag();
        return distance;
    },

    onPicked () {
        //重新创建新的星星
        this.game.spawnNewStar();
        //当前星星节点销毁
        this.node.destroy();
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {
        
    },

    update (dt) {

        //每帧判断player和star之间的距离，如果小于设定的就收集成功
        if(this.getPlayerDistance() < this.pickRadius) {
            this.onPicked();
            //分数更新
            this.game.gainScore();
            return;
        }

        //更新星星的透明度
        let opcityRatio = 1 - this.game.timer/this.game.starDuration;
        let minOpacity = 50;
        this.node.opacity = minOpacity + Math.floor(opcityRatio * (255 - minOpacity));

        //更新星星头顶进度条
        let progress = this.node.getChildByName('progressBar');
        if (progress) {
            let bar = progress.getComponent(cc.ProgressBar);
            if (bar) {
                // console.log('progress  ', bar.progress);
                bar.progress = opcityRatio;
            }
        }
    },
});

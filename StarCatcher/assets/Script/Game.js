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
        //星星预制体
        starPrefab: {
            default: null,
            type: cc.Prefab
        },
        //星星消失的时间随机范围
        maxStarDuration: 0,
        minStarDuration: 0,
        //地面节点，确定星星生成的高度
        ground: {
            default: null,
            type: cc.Node
        },
        //player 节点，获取弹跳高度，控制主角行动开关
        player: {
            default: null,
            type: cc.Node
        },
        scoreDisplay: {
            default: null,
            type: cc.Label
        },
        scoreAudio: {
            default: null,
            type: cc.AudioClip
        }
    },

    getNewStarPosition () {
        //根据地面高度以及弹跳高度获取一个随机y坐标
        let randY = this.groundY + Math.random() * this.player.getComponent('Player').jumpHeight + 50;
        //根据屏幕的宽度获取一个x坐标
        let maxWidth = this.node.width/2;
        let randX = (Math.random() - 0.5) * 2 * maxWidth;
        return cc.v2(randX, randY);
    },

    spawnNewStar () {
        //使用预制体创建星星
        let newStar = cc.instantiate(this.starPrefab);
        this.node.addChild(newStar);
        //随机坐标
        newStar.setPosition(this.getNewStarPosition());
        newStar.getComponent('Star').game = this;

        //重置计时器，更具当前小时时间范围随机一个时间
        this.starDuration = this.minStarDuration + Math.random() * (this.maxStarDuration - this.minStarDuration);
        this.timer = 0;
    },

    // LIFE-CYCLE CALLBACKS:
    
    onLoad () {
        //测试组件 一下数值相等
        // let d1 = this.player.getComponent('Player').jumpHeight;
        // console.log('d1 : ', d1);
        // let d2 = this.node.getChildByName('player').getComponent('Player').jumpHeight;
        // console.log('d2 : ', d2);

        //初始化计时器
        this.timer = 0;
        this.starDuration = 0;
        //游戏是否开始的标示
        // this.bStartGame = false;

        //获取地面y坐标
        let groundY = this.ground.y + this.ground.height/2;
        this.score = 0;
        //游戏是否开始的标志
        this.gameStart = false;
    },

    start () {

    },

    update (dt) {
        if(!this.bStartGame) {
            // console.log('游戏还没开始。。。');
            return;
        }
        //超过时间就失败
        if(this.timer > this.starDuration) {
            this.gameOver();
            return;
        }
        this.timer += dt;
        //player 刷新
        this.playerComponent.updatePerFrame(dt);
    },

    gainScore () {
        this.score += 1;
        this.scoreDisplay.string = 'Score:' + this.score;
        cc.audioEngine.playEffect(this.scoreAudio, false);
    },

    gameOver () {
        this.player.stopAllActions();
        cc.director.loadScene('game');
    },

    startGame (event) {
        // console.log('0000000000');
        this.bStartGame = true;
        this.node.getChildByName('btnStartGame').active = false;
        //生成新的星星
        this.spawnNewStar();
        //player跳跃动作
        this.playerComponent = this.player.getComponent('Player');
        if(this.playerComponent) {
            this.playerComponent.playJumpAction();
        }
    }
});

export default class LevelEX extends Phaser.Scene {
    
    constructor(){
        super('LevelEX');
        
    }
    init(options){
        this.soundStatus = options.soundStatus;
    }
    preload() {
        this.load.atlas('dude','assets/dude2.png','assets/dude2.json');
        this.load.image('danger','assets/exassets/exdanger.jpg');
        this.load.image('platform', 'assets/platformg.jpg');
        this.load.image('bg', 'assets/exassets/exbg.jpg');
        this.load.image('floor', 'assets//exassets/exfloor.png');
        this.load.image('goal', 'assets/exassets/exgoal.jpg');
        this.load.image('info', 'assets/text/textbox.jpg');
        this.load.image('coin', 'assets/exassets/excoin.png');
        this.load.audio('bgm', 'assets/exassets/exsong.mp3');
    }
create() {
    this.winText = "BUY DOGE COIN";
    this.jumpCount = 0;
    console.log("Sound status update:"+this.soundStatus);
    this.add.image(0, 0, 'bg').setOrigin(0);
    this.tutorialInfo = this.add.image(200,400,'info').setScale(2,1);
    this.coinBuy = this.add.image(200,100,'coin').setScale(.5,.5);
    this.coinBuy = this.add.image(1700,100,'coin').setScale(.5,.5);
    this.statusText = this.add.text(10, 330, this.winText, {color: 'white'});
    this.platforms = this.physics.add.staticGroup();
    this.deathLava = this.physics.add.staticGroup();
    this.goal = this.physics.add.staticGroup();

    this.platforms.create(1000, 1800, 'floor').setScale(1, 1).refreshBody();
    this.deathLava.create(500, 1000, 'danger').setScale(.5, 1).refreshBody();
    this.goal.create(1800, 850, 'goal').setScale(1, 1).refreshBody();

    this.player = this.physics.add.sprite(75, 485, 'dude');
    this.player.setScale(.75);
    this.player.setBounce(0);
    this.player.body.setCollideWorldBounds(true,2,2);
    if(this.soundStatus) {
        this.mainMusic = this.sound.add("bgm", {volume: .5});
        this.mainMusic.play();
    }


    this.physics.add.collider(this.platforms, this.player);
    this.physics.add.overlap(this.deathLava, this.player, this.death,null,this);
    this.physics.add.collider(this.goal, this.player, this.win,null,this);
   

    
    this.controls = this.input.keyboard.createCursorKeys();
    this.spaceBar = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    this.anims.create({
        key: 'move_right',
        frames: this.anims.generateFrameNames('dude', { prefix: 'walk',start:1, end: 4, zeroPad: 3}),frameRate: 10, repeat: -1});

    this.anims.create({
        key: 'standing',
        frames: this.anims.generateFrameNames('dude', { prefix: 'stand',start:1, end: 1, zeroPad: 3}), repeat: -1
    
    });
    this.anims.create({
        key: 'jumping',
        frames: this.anims.generateFrameNames('dude', { prefix: 'jump',start:1, end: 4, zeroPad: 3}), repeat: -1
    
    });
    this.anims.create({
        key: 'standing_jump',
        frames: this.anims.generateFrameNames('dude', { prefix: 'jump_standing_jet',start:1, end: 1, zeroPad: 3}), repeat: -1
    });
    this.anims.create({
        key: 'death',
        frames: this.anims.generateFrameNames('dude', { prefix: 'death',start:1, end: 5, zeroPad: 3})
    });
    this.anims.create({
        key: 'teleport',
        frames: this.anims.generateFrameNames('dude', { prefix: 'teleport',start:1, end: 11, zeroPad: 3})
    });
    this.anims.create({
        key: 'dash',
        frames: this.anims.generateFrameNames('dude', { prefix: 'dash',start:1, end: 2, zeroPad: 3})
    });


    
}

update() {
    //Evaluation constants (Just pressed a key, touching the floor, etc)
    const upPress = Phaser.Input.Keyboard.JustDown(this.controls.up);
    const rightPress = Phaser.Input.Keyboard.JustDown(this.controls.right);
    const leftPress = Phaser.Input.Keyboard.JustDown(this.controls.left);
    const touchFloor = this.player.body.touching.down;
    this.changeAnimations = false;

    //Gameover Check
    this.gameOver;
    if (this.gameOver) {
        this.changeAnimations = true;
        this.player.anims.play('death',true);
        this.time.addEvent({
            delay: 400,
            callback: () => {
                this.player.x = 9999;
                this.registry.destroy();
                this.events.off();
                this.scene.restart();
                this.gameOver = false;  
            }
          })

    }
    
    //Evaluate winstate for animation
    this.winState;
    if(this.winState)
    {
        this.physics.pause();
        this.changeAnimations = true;
        this.player.anims.play('teleport',true);
        this.time.addEvent({
            delay: 650, // in ms
            callback: () => {
                this.winState = false;
                this.player.x = 9999;
                this.mainMusic.stop();
                this.scene.start("primaryMenu");
            }
          })
    }
    //Basic Movement and animation binding
    if (this.controls.left.isDown) {
        this.player.setVelocityX(-160);
        this.player.flipX = true;
        if (!touchFloor) {
            if(!this.changeAnimations)
            this.player.anims.play('jumping', true);
        } else {
            if(!this.changeAnimations)
            this.player.anims.play('move_right', true);
        }
    }
    else if (this.controls.right.isDown) {
        this.player.setVelocityX(160);
        this.player.flipX = false;
        if (!touchFloor) {
            if (this.controls.right.isDown || this.controls.left.isDown) {
                if(!this.changeAnimations)
                this.player.anims.play('jumping', true);
            }
            else {
                if(!this.changeAnimations)
                this.player.anims.play('standing_jump', true);
            }
        } else {
            if(!this.changeAnimations)
            this.player.anims.play('move_right', true);
        }
    }
    else
    {
        this.player.setVelocityX(0);
        if(!this.changeAnimations)
        {
        this.player.anims.play('standing', true);
        }
    }

    //Double jump
    if (upPress && touchFloor) {
        this.player.setVelocityY(-220);
        this.jumpCount++;
    }
    if (upPress && (!touchFloor && this.jumpCount == 1)) {
        this.player.setVelocityY(-220);
        this.jumpCount++;
    }
    if (touchFloor && !upPress) {
        this.jumpCount = 0;
    }

    //Dash move has 2 second cooldown
    if (leftPress) {
        this.pressDelay = this.time.now - this.lastTime;
        this.lastTime = this.time.now;
        this.coolDownCheck = this.time.now - this.coolDown;
        if (this.pressDelay < 350 && leftPress && this.coolDownCheck > 2000) {
            this.player.anims.play('dash',true)
            this.player.setVelocityX(-4000);
            this.coolDown = this.time.now;
        }
    }
    if (rightPress) {
        this.pressDelay = this.time.now - this.lastTime;
        this.lastTime = this.time.now;
        this.coolDownCheck = this.time.now - this.coolDown;
        if (this.pressDelay < 350 && rightPress && this.coolDownCheck > 2000) {
            this.player.anims.play('dash',true)
            this.player.setVelocityX(4000);
            this.coolDown = this.time.now;
    }
}
}

//Win condition: land on end goal
win(player, goal) {
        this.winState = true;
}
//Lose condition: hit lava
death(player, deathLava) {
    this.physics.pause();
    this.gameOver = true;
}
}
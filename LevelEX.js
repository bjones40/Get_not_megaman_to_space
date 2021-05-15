export default class LevelEX extends Phaser.Scene {
    
    constructor(){
        super('LevelEX');
        
    }
    init(options){
        this.soundStatus = options.soundStatus;
        this.deathCount = options.dCount;
    }
    preload() {
        this.load.atlas('dude','assets/dude2.png','assets/dude2.json');
        this.load.image('danger','assets/exassets/exdangerr.jpg');
        this.load.image('platform', 'assets/exassets/explatform.webp');
        this.load.image('paper', 'assets/exassets/expaperhands.png');
        this.load.image('bg', 'assets/exassets/exbg.jpg');
        this.load.image('floor', 'assets//exassets/exfloor.png');
        this.load.image('goal', 'assets/exassets/exgoal.jpg');
        this.load.image('info', 'assets/text/textbox.jpg');
        this.load.image('coin', 'assets/exassets/excoin.png');
        this.load.image('arrow','assets/exassets/exarrow.png');
        this.load.audio('bgm', 'assets/exassets/exsong.mp3');
        this.load.audio('died', 'assets/audio/death.mp3');
        this.load.audio('jetpack', 'assets/audio/jetpack.mp3');
        this.load.audio('dash','assets/audio/dash.mp3');
    }
create() {
    //misc variables
    this.winText = "BUY DOGE COIN";
    this.jumpCount = 0;
    if(typeof(this.deathCount) === 'undefined')
    {
      this.deathCount = 0;
    }
    console.log("Sound status update:"+this.soundStatus);

    //bind world objects
    this.add.image(0, 0, 'bg').setOrigin(0);
    this.tutorialInfo = this.add.image(200,400,'info').setScale(2,1);
    this.coinBuy = this.add.image(200,100,'coin').setScale(.5,.5);
    this.coinBuy = this.add.image(1700,100,'coin').setScale(.5,.5);
    this.statusText = this.add.text(50, 380, this.winText, {color: 'white',fontSize: 36,fontStyle: 'bold'});
    this.platforms = this.physics.add.staticGroup();
    this.deathLava = this.physics.add.staticGroup();
    this.goal = this.physics.add.staticGroup();

    this.platforms.create(1000, 1800, 'floor').setScale(1, 1).refreshBody();

    //1st jump
    this.platforms.create(50,890,'platform').setScale(.15,.15).refreshBody();
    this.deathLava.create(70,850,'paper').setScale(.15,.15).refreshBody();
    this.deathLava.create(325,800,'paper').setScale(.15,.15).refreshBody();
    this.deathLava.create(350,800,'paper').setScale(.15,.15).refreshBody();
    this.deathLava.create(375,800,'paper').setScale(.15,.15).refreshBody();
    this.deathLava.create(425,800,'paper').setScale(.15,.15).refreshBody();

    //2nd jump
    this.platforms.create(400,800,'platform').setScale(.15,.15).refreshBody();
    this.platforms.create(200,650,'platform').setScale(.15,.15).refreshBody();
    this.deathLava.create(300,700,'paper').setScale(.15,.15).refreshBody();

    //ladder jump
    this.platforms.create(425,550,'platform').setScale(.15,.15).refreshBody();
    this.platforms.create(425,400,'platform').setScale(.15,.15).refreshBody();
    this.deathLava.create(425,475,'paper').setScale(.15,.15).refreshBody();

    //return jump
    this.platforms.create(10,350,'platform').setScale(.15,.15).refreshBody();
    this.platforms.create(200,200,'platform').setScale(.15,.15).refreshBody();

    //end
    this.platforms.create(1130,525,'arrow').setScale(1,1).refreshBody();
    this.goal.create(1820, 850, 'goal').setScale(1, 1).refreshBody();
    this.deathLava.create(475,160,'paper').setScale(.15,.15).refreshBody();
    this.deathLava.create(475,135,'paper').setScale(.15,.15).refreshBody();
    this.deathLava.create(475,70,'paper').setScale(.15,.15).refreshBody();
    this.deathLava.create(475,45,'paper').setScale(.15,.15).refreshBody();
    this.deathLava.create(475,20,'paper').setScale(.15,.15).refreshBody();

    //wall
    this.deathLava.create(500, 700, 'danger').setScale(.60, 2).refreshBody();

    //player creation
    this.player = this.physics.add.sprite(10, 825, 'dude');
    this.player.setScale(.75);
    this.player.setBounce(.3);
    this.player.body.setCollideWorldBounds(true,2,2);

    //music initilization
    if(this.soundStatus && this.deathCount == 0) {
        this.mainMusic = this.sound.add("bgm", {volume: .1,loop: true});
        this.mainMusic.play();
    }
    this.jetpack = this.sound.add('jetpack', {
        loop : false,
        volume : .1
    });
    this.deathSound = this.sound.add('died', {
        loop : false,
        volume : .1
    });
    this.dashSound = this.sound.add('dash', {
        loop : false,
        volume : .1
    });


    //colliders
    this.physics.add.collider(this.platforms, this.player);
    this.physics.add.overlap(this.deathLava, this.player, this.death,null,this);
    this.physics.add.collider(this.goal, this.player, this.win,null,this);
   

    //bind attributes
    this.controls = this.input.keyboard.createCursorKeys();
    this.spaceBar = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    this.zKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Z);
    this.wKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
    this.dKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
    this.aKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
    
    this.anims.create({
            key: 'move_right',
            frames: this.anims.generateFrameNames('dude', {
                prefix: 'walk',
                start: 1,
                end: 4,
                zeroPad: 3
            }),
            frameRate: 10,
            repeat: -1
        });

        this.anims.create({
            key: 'standing',
            frames: this.anims.generateFrameNames('dude', {
                prefix: 'stand',
                start: 1,
                end: 1,
                zeroPad: 3
            }),
            repeat: -1

        });
        this.anims.create({
            key: 'jumping',
            frames: this.anims.generateFrameNames('dude', {
                prefix: 'jump',
                start: 1,
                end: 4,
                zeroPad: 3
            }),
            repeat: -1

        });
        this.anims.create({
            key: 'standing_jump',
            frames: this.anims.generateFrameNames('dude', {
                prefix: 'standingjump',
                start: 1,
                end: 1,
                zeroPad: 3
            }),
            repeat: -1

        });
        this.anims.create({
            key: 'death',
            frames: this.anims.generateFrameNames('dude', { prefix: 'death', start: 1,end: 5, zeroPad: 3}),frameRate: 13
        });
        this.anims.create({
            key: 'teleport',
            frames: this.anims.generateFrameNames('dude', { prefix: 'teleport', start: 1,end: 11, zeroPad: 3}),frameRate: 13
        });
        this.anims.create({
            key: 'dash',
            frames: this.anims.generateFrameNames('dude', { prefix: 'dash', start: 1,end: 2, zeroPad: 3}),frameRate: 5
        });


    
}

update() {
    //Evaluation constants (Just pressed a key, touching the floor, etc)
    const upPress = Phaser.Input.Keyboard.JustDown(this.controls.up);
    const rightPress = Phaser.Input.Keyboard.JustDown(this.controls.right);
    const leftPress = Phaser.Input.Keyboard.JustDown(this.controls.left);
    const wPress = Phaser.Input.Keyboard.JustDown(this.wKey);
    const touchFloor = this.player.body.touching.down;
    this.changeAnimations = false;

    //Gameover Check
    this.gameOver;
    if (this.gameOver) {
        this.changeAnimations = true;
        if(this.soundStatus)
        {
            this.deathSound.play();
        }
        this.player.anims.play('death',true);
        this.time.addEvent({
        delay: 400,
        callback: () => {
            this.player.x = 9999;
            this.deathCount++;
            this.registry.destroy();
            this.events.off();
            this.scene.stop();
            this.scene.start("LevelEX", {soundStatus: this.soundStatus, dCount: this.deathCount});
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
                this.scene.start("primaryMenu", {soundStatus: this.soundStatus});
            }
          })
    }
    //Basic Movement and animation binding
    if (this.controls.left.isDown || this.aKey.isDown) {
        this.player.setVelocityX(-160);
        this.player.flipX = true;
        //Dash move, 2 second cooldown, goes left
        if(Phaser.Input.Keyboard.JustDown(this.zKey))
        {
            this.coolDownCheck = this.time.now - this.coolDown;
            if (this.coolDownCheck > 2000) {
                if(this.soundStatus)
                {
                    this.dashSound.play();
                }
                this.player.anims.play('dash',true);
                this.player.setVelocityX(-4000);
                this.coolDown = this.time.now;
            }
        }
        if (!touchFloor) {
            if(!this.changeAnimations)
            this.player.anims.play('jumping', true);
        } else {
            if(!this.changeAnimations)
            this.player.anims.play('move_right', true);
        }
    }
    else if (this.controls.right.isDown || this.dKey.isDown) {
        this.player.setVelocityX(160);
        this.player.flipX = false;
        //Dash move, 2 second cooldown, goes right
        if(Phaser.Input.Keyboard.JustDown(this.zKey) || Phaser.Input.Keyboard.JustDown(this.spaceBar))
        {
            this.coolDownCheck = this.time.now - this.coolDown;
            if (this.coolDownCheck > 2000) {
                if(this.soundStatus)
                {
                    this.dashSound.play();
                }
                this.player.anims.play('dash',true)
                this.player.setVelocityX(4000);
                this.coolDown = this.time.now;
            }
        }
        if (!touchFloor) {
            if ((this.controls.right.isDown || this.controls.left.isDown) || (this.dKey.isDown || this.aKey.isDown)) {
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
    if ((upPress && touchFloor) || (wPress && touchFloor)) {
        if(this.soundStatus) { this.jetpack.play(); }
        this.player.setVelocityY(-220);
        this.jumpCount++;
        //this.statusText.setText(this.jumpCount);
    }
    else if((upPress && (!touchFloor && this.jumpCount < 2)) || (wPress && (!touchFloor && this.jumpCount < 2))) {
        if(this.soundStatus) { this.jetpack.play(); }
        this.player.setVelocityY(-220);
        this.jumpCount++;
        //this.statusText.setText(this.jumpCount);
    }
    else if((touchFloor && !upPress && this.jumpCount != 0) || (touchFloor && !wPress && this.jumpCount != 0)) {
        this.jumpCount = 0;
        //this.statusText.setText(this.jumpCount);
    }
}

//Win condition: touch GPU
win(player, goal) {
        this.winState = true;
}
//Lose condition: hit lava
death(player, deathLava) {
    this.physics.pause();
    this.gameOver = true;
}
}
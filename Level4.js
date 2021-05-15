export default class Level4 extends Phaser.Scene {

    
    constructor() {
        super('Level4');
    }
    init(options){
        this.soundStatus = options.soundStatus;
    }
    preload() {
        this.load.atlas('dude', 'assets/dude2.png', 'assets/dude2.json');
        //this.load.image('char', 'assets/char.jpg');
        //this.load.image('platform', 'assets/platformg.jpg');
        this.load.image('bg', 'assets/bg.jpg');
        this.load.image('lava', 'assets/blocks/lava.jpg');
        this.load.image('goal', 'assets/teleport.png');
        this.load.image('spike', 'assets/spike.png');
        this.load.image('movplatform', 'assets/mp.png');
        this.load.image('lgplatform', 'assets/lp.png');
        this.load.image('mdplatform', 'assets/mp.png');
        this.load.image('movplatform2', 'assets/mp.png');
        this.load.image('smplatform', 'assets/sp.png');
        this.load.image('movplatform3', 'assets/mp.png');
        this.load.image('brock', 'assets/blocks/rockbig.png');
        this.load.image('mrock', 'assets/blocks/rockmed.png');
        this.load.image('srock', 'assets/blocks/rocksmall.png');
        this.load.audio('jetpack', 'assets/audio/jetpack.mp3');
        this.load.audio('died', 'assets/audio/death.mp3');
        this.load.audio('teleport', 'assets/audio/teleport.mp3');
        this.load.audio('dash','assets/audio/dash.mp3');
    }
    create() {
        //Utility variables
        this.statusText = "";
        this.jumpCount = 0;
        this.coolDown = 0;

        //Bind world objects
        this.add.image(0, 0, 'bg').setOrigin(0);
        this.platforms = this.physics.add.staticGroup();
        this.deathLava = this.physics.add.staticGroup();
        this.goal = this.physics.add.staticGroup();
        console.log("Sound update: "+this.soundStatus);
        this.spike = this.physics.add.staticGroup();

        this.jetpack = this.sound.add('jetpack', {
            loop : false,
            volume : .1
        });
        this.deathSound = this.sound.add('died', {
            loop : false,
            volume : .1
        });
        this.tpSound = this.sound.add('teleport', {
            loop : false,
            volume : .1
        });
        this.dashSound = this.sound.add('dash', {
            loop : false,
            volume : .1
        });

        //Create world objects
        this.deathLava.create(960, 960, 'lava').setScale(200, 5).refreshBody();

        //test moving platform
        this.movplatform = this.physics.add.image(1400, 900, 'smplatform')
            .setVelocity(100,-100);
        this.movplatform2 = this.physics.add.image(300, 900, 'smplatform')
            .setVelocity(100,-100);
        this.movplatform3 = this.physics.add.image(1700, 500, 'smplatform')
            .setVelocity(100,-100);

        this.movplatform.setImmovable(true);
        this.movplatform.body.setAllowGravity(false);
        this.movplatform2.setImmovable(true);
        this.movplatform2.body.setAllowGravity(false);
        this.movplatform3.setImmovable(true);
        this.movplatform3.body.setAllowGravity(false);

        this.tweens.timeline({
            targets: this.movplatform.body.velocity,
            loop: -1,
            tweens: [
                { x: 0, y: -200, duration: 2000, ease: 'Stepped'},
                { x: 0, y:    0, duration: 1000, ease: 'Stepped'},
                { x: 0, y:  200, duration: 2000, ease: 'Stepped'},
                { x: 0, y:    0, duration: 1000, ease: 'Stepped'}
            ]
        });
        
        this.tweens.timeline({
            targets: this.movplatform2.body.velocity,
            loop: -1,
            tweens: [
                { x: 0, y: -200, duration: 2000, ease: 'Stepped'},
                { x: 0, y:    0, duration: 1000, ease: 'Stepped'},
                { x: 0, y:  200, duration: 2000, ease: 'Stepped'},
                { x: 0, y:    0, duration: 1000, ease: 'Stepped'}
            ]
        });

        this.tweens.timeline({
            targets: this.movplatform3.body.velocity,
            loop: -1,
            tweens: [
                { x: -75, y: 0, duration: 2000, ease: 'Stepped'},
                { x: 0, y:    0, duration: 1000, ease: 'Stepped'},
                { x: 75, y:  0, duration: 2000, ease: 'Stepped'},
                { x: 0, y:    0, duration: 1000, ease: 'Stepped'}
            ]
        });
        //platforms left to right
        this.platforms.create(600, 400, 'mdplatform').setScale(1.0,1.4).refreshBody();
        this.platforms.create(1100, 500, 'mdplatform').setScale(1.1,1.5).refreshBody();
        this.platforms.create(50, 800, 'smplatform').refreshBody();
        //this.platforms.create(500, 500, 'platform').setScale(3,5).refreshBody();
        //this.platforms.create(750, 880, 'platform').setScale(2,6).refreshBody();
        this.platforms.create(880, 800, 'mdplatform').setScale(1.2,1.5).refreshBody();
        

        //spikes
        this.spike.create(1685,340,'spike').setScale(0.4,0.4).refreshBody();
        this.spike.create(1725,310,'spike').setScale(0.4,0.4).refreshBody();
        this.spike.create(800,465,'spike').setScale(0.4,0.4).refreshBody();
        this.spike.create(900,500,'spike').setScale(0.4,0.4).refreshBody();
       
        this.goal.create(1800, 400, 'goal').setScale(0.9, 0.9).refreshBody();

        //Create and configure player
        this.player = this.physics.add.sprite(50, 730, 'dude');
        this.player.setScale(1.5);
        this.player.setBounce(0);
        this.player.setCollideWorldBounds(true);

        //Add colliders between objects
        this.physics.add.collider(this.platforms, this.player);
        this.physics.add.overlap(this.deathLava, this.player, this.death, null, this);
        this.physics.add.collider(this.goal, this.player, this.win, null, this);
        this.physics.add.overlap(this.player, this.spike, this.death, null, this);
        this.physics.add.collider(this.player,this.movplatform);
        this.physics.add.collider(this.player,this.movplatform2);
        this.physics.add.collider(this.player,this.movplatform3);

        //Debug Text
        //this.statusText = this.add.text(0, 0, 'Free Real-estate');

        //Bind controls
        this.controls = this.input.keyboard.createCursorKeys();
        this.spaceBar = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        this.zKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Z);
        this.wKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
        this.dKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
        this.aKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);

        //Bind animations
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
            if(this.soundStatus)
            {
                this.tpSound.play();
            }
            this.physics.pause();
            this.changeAnimations = true;
            this.player.anims.play('teleport',true);
            this.time.addEvent({
                delay: 650, // in ms
                callback: () => {
                    this.winState = false;
                    this.player.x = 9999;
                    this.game.sound.stopAll();
                    this.scene.start("primaryMenu",{sound: this.soundStatus});
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

    //Win condition: land on end goal
    win(player, goal) {
        if (this.player.body.touching.down) {
            this.winState = true;
        }
    }
    //Lose condition: hit lava
    death(player, deathLava) {
        this.physics.pause();
        this.gameOver = true;
    }
}

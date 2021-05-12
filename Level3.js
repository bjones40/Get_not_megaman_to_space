export default class Level3 extends Phaser.Scene {

    constructor() {
        super('Level3');
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
        this.load.image('rockbig','assets/blocks/rockbig.png');
        this.load.image('rockmed','assets/blocks/rockmed.png');
        this.load.image('rocksmall','assets/blocks/rocksmall.png');
        this.load.image('crystal','assets/crystal.png');
        this.load.image('lp', 'assets/lp.png');
        this.load.image('mp', 'assets/mp.png');
        this.load.image('sp', 'assets/sp.png');
        this.load.audio('died', 'assets/audio/death.mp3');
        this.load.audio('jetpack', 'assets/audio/jetpack.mp3');
    }
    create() {
        //Utility variables
        this.statusText = "";
        this.jumpCount = 0;
        this.coolDown = 0;

        //Bind world objects
        this.background = this.add.image(0, 0, 'bg').setOrigin(0);
        this.platforms = this.physics.add.staticGroup();
        this.deathLava = this.physics.add.staticGroup();
        this.spike = this.physics.add.staticGroup();
        this.crystal = this.physics.add.staticGroup();
        this.goal = this.physics.add.staticGroup();
        console.log("Sound update: " + this.soundStatus);

        //Create world objects
        this.deathLava.create(400,1050, 'lava').setScale(1000, 6).refreshBody();

        

        //test moving platform
        this.movplatform = this.physics.add.sprite(450, 1000, 'movplatform')
            .setVelocity(100,-100);

        this.movplatform.setImmovable(true);
        this.movplatform.body.setAllowGravity(false);

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
        
        //left  Less X
        //right More X
        //up    Less Y
        //down  More Y 

        //platforms left to right
        this.platforms.create(50,1000, 'rockbig').setScale(0.3,0.5).refreshBody();
        this.platforms.create(-20,750, 'rockbig').setScale(0.2,0.8).refreshBody();
        this.platforms.create(150,450, 'rocksmall').setScale(0.5,0.5).refreshBody();
        this.platforms.create(500,300, 'mp').setScale(0.9,0.5).refreshBody();
        this.platforms.create(900,300, 'mp').setScale(0.5,0.5).refreshBody();
        this.platforms.create(-20,200, 'rockbig').setScale(0.3,0.4).refreshBody();
        this.platforms.create(150,140, 'sp').setScale(0.5,0.5).refreshBody();



        

        //this.crystal.create(400,500, 'crystal').setScale(0.1,0.1),refreshBody();
        
        

        //spikes
       // this.spike.create(250,660,'spike').setScale(0.3,0.3).refreshBody();
        this.spike.create(250,700,'spike').setScale(0.3,0.3).refreshBody();
        this.spike.create(250,840,'spike').setScale(0.3,0.3).refreshBody();
        this.goal.create(1500, 400, 'goal').setScale(0.9, 0.9).refreshBody();

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


        


        this.statusText = this.add.text(0, 0, 'Free Real-estate');

        //Bind controls
        this.controls = this.input.keyboard.createCursorKeys();
        this.spaceBar = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        //Bind sounds
        this.deathSound = this.sound.add('died', {
            loop : false,
            volume : .1
        });
        this.jetpack = this.sound.add('jetpack', {
            loop : false,
            volume : .1
        });

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
            this.physics.pause();
            this.changeAnimations = true;
            this.player.anims.play('teleport',true);
            this.time.addEvent({
                delay: 650, // in ms
                callback: () => {
                    this.winState = false;
                    this.player.x = 9999;
                    this.scene.start("Level4",{soundStatus: this.soundStatus});
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
            if(this.soundStatus) { this.jetpack.play(); }
            this.player.setVelocityY(-220);
            this.jumpCount++;
            this.statusText.setText(this.jumpCount);
        }
        else if(upPress && (!touchFloor && this.jumpCount < 2)) {
            if(this.soundStatus) { this.jetpack.play(); }
            this.player.setVelocityY(-220);
            this.jumpCount++;
            this.statusText.setText(this.jumpCount);
        }
        else if(touchFloor && !upPress && this.jumpCount != 0) {
            this.jumpCount = 0;
            this.statusText.setText(this.jumpCount);
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
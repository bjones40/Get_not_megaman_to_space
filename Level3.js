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
        this.load.audio('teleport', 'assets/audio/teleport.mp3');
        this.load.audio('dash','assets/audio/dash.mp3');
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

        this.movplatform2 = this.physics.add.sprite(1850,1000, 'sp').setScale(1,0.6)
        .setVelocity(100,-100);
        this.movplatform2.setImmovable(true);
        this.movplatform2.body.setAllowGravity(false);
        this.tweens.timeline({
            targets: this.movplatform2.body.velocity,
            loop: -1,
            tweens: [
                { x: -100, y: 0, duration: 6000, ease: 'Stepped'},
                { x: 0, y:    0, duration: 1000, ease: 'Stepped'},
                { x: 100, y: 0, duration: 6000, ease: 'Stepped'},
                { x: 0, y:    0, duration: 1000, ease: 'Stepped'},
            ]
        });

        this.movplatform3 = this.physics.add.sprite(1250,900, 'sp').setScale(1,0.6)
        .setVelocity(100,-100);
        this.movplatform3.setImmovable(true);
        this.movplatform3.body.setAllowGravity(false);
        this.tweens.timeline({
            targets: this.movplatform3.body.velocity,
            loop: -1,
            tweens: [
                { x: 150, y: 0, duration: 4000, ease: 'Stepped'},
                { x: -150, y: 0, duration: 4000, ease: 'Stepped'}
            ]
        });

        this.movplatform4 = this.physics.add.sprite(1850,800, 'sp').setScale(1,0.6)
        .setVelocity(100,-100);
        this.movplatform4.setImmovable(true);
        this.movplatform4.body.setAllowGravity(false);
        this.tweens.timeline({
            targets: this.movplatform4.body.velocity,
            loop: -1,
            tweens: [
                { x: -150, y: 0, duration: 4000, ease: 'Stepped'},
                { x: 150, y: 0, duration: 4000, ease: 'Stepped'}
            ]
        });

        this.movplatform5 = this.physics.add.sprite(1250,700, 'sp').setScale(1,0.6)
        .setVelocity(100,-100);
        this.movplatform5.setImmovable(true);
        this.movplatform5.body.setAllowGravity(false);
        this.tweens.timeline({
            targets: this.movplatform5.body.velocity,
            loop: -1,
            tweens: [
                { x: 150, y: 0, duration: 4000, ease: 'Stepped'},
                { x: -150, y: 0, duration: 4000, ease: 'Stepped'}
            ]
        });

        this.movplatform6 = this.physics.add.sprite(1850,600, 'sp').setScale(1,0.6)
        .setVelocity(100,-100);
        this.movplatform6.setImmovable(true);
        this.movplatform6.body.setAllowGravity(false);
        this.tweens.timeline({
            targets: this.movplatform6.body.velocity,
            loop: -1,
            tweens: [
                { x: -150, y: 0, duration: 4000, ease: 'Stepped'},
                { x: 150, y: 0, duration: 4000, ease: 'Stepped'}
            ]
        });

        this.movplatform7 = this.physics.add.sprite(1250,500, 'sp').setScale(1,0.6)
        .setVelocity(100,-100);
        this.movplatform7.setImmovable(true);
        this.movplatform7.body.setAllowGravity(false);
        this.tweens.timeline({
            targets: this.movplatform7.body.velocity,
            loop: -1,
            tweens: [
                { x: 150, y: 0, duration: 4000, ease: 'Stepped'},
                { x: -150, y: 0, duration: 4000, ease: 'Stepped'}
            ]
        });

        this.movplatform8 = this.physics.add.sprite(1850,400, 'sp').setScale(1,0.6)
        .setVelocity(100,-100);
        this.movplatform8.setImmovable(true);
        this.movplatform8.body.setAllowGravity(false);
        this.tweens.timeline({
            targets: this.movplatform8.body.velocity,
            loop: -1,
            tweens: [
                { x: -150, y: 0, duration: 4000, ease: 'Stepped'},
                { x: 150, y: 0, duration: 4000, ease: 'Stepped'}
            ]
        });

        this.movplatform9 = this.physics.add.sprite(1250,300, 'sp').setScale(1,0.6)
        .setVelocity(100,-100);
        this.movplatform9.setImmovable(true);
        this.movplatform9.body.setAllowGravity(false);
        this.tweens.timeline({
            targets: this.movplatform9.body.velocity,
            loop: -1,
            tweens: [
                { x: 200, y: 0, duration: 3000, ease: 'Stepped'},
                { x: -200, y: 0, duration: 3000, ease: 'Stepped'}
            ]
        });

        this.movplatform10 = this.physics.add.sprite(1850,200, 'sp').setScale(1,0.6)
        .setVelocity(100,-100);
        this.movplatform10.setImmovable(true);
        this.movplatform10.body.setAllowGravity(false);
        this.tweens.timeline({
            targets: this.movplatform10.body.velocity,
            loop: -1,
            tweens: [
                { x: -200, y: 0, duration: 3000, ease: 'Stepped'},
                { x: 200, y: 0, duration: 3000, ease: 'Stepped'}
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
        this.platforms.create(900,300, 'mp').setScale(0.9,0.5).refreshBody();
        this.platforms.create(-20,200, 'rockbig').setScale(0.3,0.4).refreshBody();
        this.platforms.create(150,140, 'sp').setScale(0.5,0.5).refreshBody();
        this.platforms.create(1150,1000, 'mp').setScale(0.3,0.5).refreshBody();
        this.platforms.create(1650,110, 'rocksmall').setScale(0.3,0.3).refreshBody();
        
        //this.platforms.create(1525,1000, 'sp').setScale(0.5,0.5).refreshBody();


        //moving spikes
        this.spike1 = this.physics.add.sprite(250, 950, 'spike').setScale(0.3,0.3)
        .setVelocity(100,-100).setDepth(0);
        this.spike1.setImmovable(true);
        this.spike1.body.setAllowGravity(false);
        this.tweens.timeline({
        targets: this.spike1.body.velocity,
        loop: -1,
        tweens: [
            { x: 0, y: -150, duration: 2400, ease: 'Stepped'},
            { x: 0, y: 150, duration: 2400, ease: 'Stepped'},
        ]
        });

        this.spike2 = this.physics.add.sprite(600, 600, 'spike').setScale(0.3,0.3)
        .setVelocity(100,-100).setDepth(0);
        this.spike2.setImmovable(true);
        this.spike2.body.setAllowGravity(false);
        this.tweens.timeline({
        targets: this.spike2.body.velocity,
        loop: -1,
        tweens: [
            { x:    0, y: -200, duration: 2000, ease: 'Stepped' },
            { x:    0, y:    0, duration: 1000, ease: 'Stepped' },
            { x:  150, y:  100, duration: 4000, ease: 'Stepped' },
            { x:    0, y: -200, duration: 2000, ease: 'Stepped' },
            { x:    0, y:    0, duration: 1000, ease: 'Stepped' },
            { x: -150, y:  100, duration: 4000, ease: 'Stepped' }
            /*
            { x: 0, y: 150, duration: 2400, ease: 'Stepped'},
            { x: 0, y: -150, duration: 2400, ease: 'Stepped'},*/
        ]
        });

        //left  Less X
        //right More X
        //up    Less Y
        //down  More Y 

        this.spike3 = this.physics.add.sprite(300, 600, 'spike').setScale(0.3,0.3)
        .setVelocity(100,-100).setDepth(0);
        this.spike3.setImmovable(true);
        this.spike3.body.setAllowGravity(false);
        this.tweens.timeline({
        targets: this.spike3.body.velocity,
        loop: -1,
        tweens: [
            { x: 250, y: 0, duration: 1500, ease: 'Stepped'},
            { x: -250, y: 0, duration: 1500, ease: 'Stepped'},
        ]
        });

        this.spike4 = this.physics.add.sprite(300, 200, 'spike').setScale(0.3,0.3)
        .setVelocity(100,-100).setDepth(0);
        this.spike4.setImmovable(true);
        this.spike4.body.setAllowGravity(false);
        this.tweens.timeline({
        targets: this.spike4.body.velocity,
        loop: -1,
        tweens: [
            { x: 0, y: 150, duration: 1500, ease: 'Stepped'},
            { x: 0, y: -150, duration: 1500, ease: 'Stepped'},
        ]
        });

        this.spike5 = this.physics.add.sprite(800, 450, 'spike').setScale(0.3,0.3)
        .setVelocity(100,-100).setDepth(0);
        this.spike5.setImmovable(true);
        this.spike5.body.setAllowGravity(false);
        this.tweens.timeline({
        targets: this.spike5.body.velocity,
        loop: -1,
        tweens: [
            { x: 0, y: -150, duration: 2400, ease: 'Stepped'},
            { x: 0, y: 150, duration: 2400, ease: 'Stepped'},
        ]
        });

        this.spike6 = this.physics.add.sprite(700, 100, 'spike').setScale(0.3,0.3)
        .setVelocity(100,-100).setDepth(0);
        this.spike6.setImmovable(true);
        this.spike6.body.setAllowGravity(false);
        this.tweens.timeline({
        targets: this.spike6.body.velocity,
        loop: -1,
        tweens: [
            { x: 0, y: 150, duration: 2400, ease: 'Stepped'},
            { x: 0, y: -150, duration: 2400, ease: 'Stepped'},
        ]
        });

        this.spike7 = this.physics.add.sprite(1300, 200, 'spike').setScale(0.3,0.3)
        .setVelocity(100,-100).setDepth(0);
        this.spike7.setImmovable(true);
        this.spike7.body.setAllowGravity(false);
        this.tweens.timeline({
        targets: this.spike7.body.velocity,
        loop: -1,
        tweens: [
            { x: 0, y: 200, duration: 4000, ease: 'Stepped'},
            { x: 0, y: -200, duration: 4000, ease: 'Stepped'},
        ]
        });

        this.spike8 = this.physics.add.sprite(1600, 1000, 'spike').setScale(0.3,0.3)
        .setVelocity(100,-100).setDepth(0);
        this.spike8.setImmovable(true);
        this.spike8.body.setAllowGravity(false);
        this.tweens.timeline({
        targets: this.spike8.body.velocity,
        loop: -1,
        tweens: [
            { x: 0, y: -200, duration: 4500, ease: 'Stepped'},
            { x: 0, y: 200, duration: 4500, ease: 'Stepped'},
        ]
        });
        

        //this.crystal.create(400,500, 'crystal').setScale(0.1,0.1),refreshBody();
        
        

        //spikes
        this.spike.create(1100,660,'spike').setScale(0.3,0.3).refreshBody();
        this.spike.create(1100,700,'spike').setScale(0.3,0.3).refreshBody();
        this.spike.create(1100,740,'spike').setScale(0.3,0.3).refreshBody();
        this.spike.create(1100,780,'spike').setScale(0.3,0.3).refreshBody();
        this.spike.create(1100,820,'spike').setScale(0.3,0.3).refreshBody();
        this.spike.create(1100,860,'spike').setScale(0.3,0.3).refreshBody();
        this.spike.create(1100,900,'spike').setScale(0.3,0.3).refreshBody();
        this.spike.create(1100,940,'spike').setScale(0.3,0.3).refreshBody();
        this.spike.create(1100,980,'spike').setScale(0.3,0.3).refreshBody();

        this.spike.create(1170,660,'spike').setScale(0.3,0.3).refreshBody();
        this.spike.create(1170,700,'spike').setScale(0.3,0.3).refreshBody();
        this.spike.create(1170,740,'spike').setScale(0.3,0.3).refreshBody();
        this.spike.create(1170,780,'spike').setScale(0.3,0.3).refreshBody();
        this.spike.create(1170,820,'spike').setScale(0.3,0.3).refreshBody();
        this.spike.create(1170,860,'spike').setScale(0.3,0.3).refreshBody();
        this.spike.create(1170,900,'spike').setScale(0.3,0.3).refreshBody();
        //this.spike.create(1170,940,'spike').setScale(0.3,0.3).refreshBody();

        this.spike.create(1170,300,'spike').setScale(0.3,0.3).refreshBody();
        this.spike.create(1170,250,'spike').setScale(0.3,0.3).refreshBody();
        this.spike.create(1170,200,'spike').setScale(0.3,0.3).refreshBody();
        this.spike.create(1170,150,'spike').setScale(0.3,0.3).refreshBody();
        this.spike.create(1170,100,'spike').setScale(0.3,0.3).refreshBody();
        this.spike.create(1170,50,'spike').setScale(0.3,0.3).refreshBody();
        this.spike.create(1170,350,'spike').setScale(0.3,0.3).refreshBody();
        this.spike.create(1170,400,'spike').setScale(0.3,0.3).refreshBody();
        this.spike.create(1170,450,'spike').setScale(0.3,0.3).refreshBody();
        this.spike.create(1170,500,'spike').setScale(0.3,0.3).refreshBody();
        this.spike.create(1170,550,'spike').setScale(0.3,0.3).refreshBody();
        this.spike.create(1170,600,'spike').setScale(0.3,0.3).refreshBody();


        
        
        

        this.goal.create(1800, 100, 'goal').setScale(0.9, 0.9).refreshBody();

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
        this.physics.add.collider(this.player,this.movplatform4);
        this.physics.add.collider(this.player,this.movplatform5);
        this.physics.add.collider(this.player,this.movplatform6);
        this.physics.add.collider(this.player,this.movplatform7);
        this.physics.add.collider(this.player,this.movplatform8);
        this.physics.add.collider(this.player,this.movplatform9);
        this.physics.add.collider(this.player,this.movplatform10);
        this.physics.add.overlap(this.spike1, this.player, this.death, null, this);
        this.physics.add.overlap(this.spike2, this.player, this.death, null, this);
        this.physics.add.overlap(this.spike3, this.player, this.death, null, this);
        this.physics.add.overlap(this.spike4, this.player, this.death, null, this);
        this.physics.add.overlap(this.spike5, this.player, this.death, null, this);
        this.physics.add.overlap(this.spike6, this.player, this.death, null, this);
        this.physics.add.overlap(this.spike7, this.player, this.death, null, this);
        this.physics.add.overlap(this.spike8, this.player, this.death, null, this);


        

        //Debug Text
        //this.statusText = this.add.text(0, 0, 'Free Real-estate');

        //Bind controls
        this.controls = this.input.keyboard.createCursorKeys();
        this.spaceBar = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        this.zKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Z);
        this.wKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
        this.dKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
        this.aKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
        //Bind sounds
        this.deathSound = this.sound.add('died', {
            loop : false,
            volume : .1
        });
        this.jetpack = this.sound.add('jetpack', {
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
                    this.scene.start("Level4",{soundStatus: this.soundStatus});
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
export default class Level4 extends Phaser.Scene {

    
    constructor() {
        super('Level4');
    }
    init(options){
        this.sound = options.sound;
    }
    preload() {
        this.load.atlas('dude', 'assets/dude2.png', 'assets/dude2.json');
        this.load.image('char', 'assets/char.jpg');
        this.load.image('platform', 'assets/platformg.jpg');
        this.load.image('bg', 'assets/bgx.jpg');
        this.load.image('lava', 'assets/lava.png');
        this.load.image('goal', 'assets/win.jpg');
        this.load.image('spike', 'assets/spike.png');
        this.load.image('movplatform', 'assets/platformg.jpg');
        this.load.image('movplatform2', 'assets/platformg.jpg');
        this.load.image('movplatform3', 'assets/platformg.jpg');
        this.load.audio('jetpack', 'assets/audio/jetpack.mp3');
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
        console.log("Sound update: "+this.sound);
        this.spike = this.physics.add.staticGroup();

        this.jetpack = this.sound.add('jetpack', {
            loop : false,
            volume : .1
        });

        //Create world objects
        this.deathLava.create(960, 960, 'lava').setScale(200, 5).refreshBody();

        //test moving platform
        this.movplatform = this.physics.add.image(1400, 900, 'movplatform')
            .setVelocity(100,-100);
        this.movplatform2 = this.physics.add.image(300, 900, 'movplatform2')
            .setVelocity(100,-100);
        this.movplatform3 = this.physics.add.image(1700, 500, 'movplatform3')
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
        this.platforms.create(600, 400, 'platform').setScale(5,6).refreshBody();
        this.platforms.create(1100, 500, 'platform').setScale(4,4).refreshBody();
        this.platforms.create(50, 800, 'platform').setScale(3,1.5).refreshBody();
        //this.platforms.create(500, 500, 'platform').setScale(3,5).refreshBody();
        //this.platforms.create(750, 880, 'platform').setScale(2,6).refreshBody();
        this.platforms.create(880, 800, 'platform').setScale(3,7).refreshBody();
        

        //spikes
        this.spike.create(1685,360,'spike').setScale(0.6,0.6).refreshBody();
        this.spike.create(1725,325,'spike').setScale(0.6,0.6).refreshBody();
        this.spike.create(800,465,'spike').setScale(0.6,0.6).refreshBody();
        this.spike.create(900,500,'spike').setScale(0.6,0.6).refreshBody();
       
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

        this.statusText = this.add.text(0, 0, 'Free Real-estate');

        //Bind controls
        this.controls = this.input.keyboard.createCursorKeys();
        this.spaceBar = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

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
                    this.scene.start("LevelEX",{sound: this.sound});
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

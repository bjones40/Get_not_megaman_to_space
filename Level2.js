export default class Level2 extends Phaser.Scene {

    constructor() {
        super('Level2');
    }

    init(options) {
        this.soundStatus = options.soundStatus;
    }

    preload() {
        this.load.atlas('dude', 'assets/dude2.png', 'assets/dude2.json');
        this.load.image('bg', 'assets/bg.jpg');
        this.load.image('lava', 'assets/blocks/lava.jpg');
        this.load.image('goal', 'assets/teleport.png');
        this.load.image('info', 'assets/text/textbox.jpg');
        this.load.image('spike', 'assets/spike.png');
        this.load.image('movplatform', 'assets/mp.png');
        this.load.image('brock', 'assets/blocks/rockbig.png');
        this.load.image('mrock', 'assets/blocks/rockmed.png');
        this.load.image('srock', 'assets/blocks/rocksmall.png');
        this.load.image('sp', 'assets/sp.png');
        this.load.image('asteroid', 'assets/asteroid.png')
        this.load.audio('message', 'assets/audio/message.mp3');
        this.load.audio('jetpack', 'assets/audio/jetpack.mp3');
        this.load.audio('died', 'assets/audio/death.mp3');
        this.load.audio('teleport', 'assets/audio/teleport.mp3');
        this.load.audio('dash', 'assets/audio/dash.mp3');

        this.load.spritesheet('collectible', 'assets/spr_coin_ama.png', {
            frameWidth: 16, 
            frameHeight: 16
        });
    }
    create() {
        //Utility variables
        this.statusText = "";
        this.jumpCount = 0;
        this.coolDown = 0;
        this.counter = 0;
        this.prompt1 = "The low gravity seems to be causing\na bunch of things to float around.\nBut are those things spikes?...\nI should probably avoid those...";
        this.prompt2 = "What was that I saw back there?...\nSomething bright and glowing?\nI should grab it really quick...";

        //Bind world objects
        this.background = this.add.image(0, 0, 'bg').setOrigin(0);
        this.platforms = this.physics.add.staticGroup();
        this.deathLava = this.physics.add.staticGroup();
        this.goal = this.physics.add.staticGroup();
        this.asteroid = this.physics.add.group();
        console.log("Sound update: " + this.soundStatus);
        this.fakebox = this.add.image(280, 260, 'brock').setScale(0.3, 0.3);

        //sfx
        this.messageSound = this.sound.add('message', {
            loop: false,
            volume: .3
        });
        this.jetpack = this.sound.add('jetpack', {
            loop: false,
            volume: .1
        });
        this.deathSound = this.sound.add('died', {
            loop: false,
            volume: .1
        });
        this.dashSound = this.sound.add('dash', {
            loop: false,
            volume: .1
        });
        this.tpSound = this.sound.add('teleport', {
            loop: false,
            volume: .1
        });

        //Create world objects
        this.deathLava.create(400, 1050, 'lava').setScale(1000, 6).refreshBody().setDepth(1);

        //collectible 
        this.collectible = this.add.sprite(170, 420, "collectible").setScale(2,2);

        //moving platform
        this.movplatform = this.physics.add.sprite(1400, 1000, 'movplatform')
            .setVelocity(100, -100);
        this.movplatform.setImmovable(true);
        this.movplatform.body.setAllowGravity(false);
        this.tweens.timeline({
            targets: this.movplatform.body.velocity,
            loop: -1,
            tweens: [
                { x: 0, y: -200, duration: 2000, ease: 'Stepped' },
                { x: 0, y: 0, duration: 1000, ease: 'Stepped' },
                { x: 0, y: 200, duration: 2000, ease: 'Stepped' },
                { x: 0, y: 0, duration: 1000, ease: 'Stepped' }
            ]
        });

        this.movplatform1 = this.physics.add.sprite(1420, 385, 'srock')
            .setScale(0.5, 0.3)
            .setVelocity(100, -100);
        this.movplatform1.setImmovable(true);
        this.movplatform1.body.setAllowGravity(false);
        this.tweens.timeline({
            targets: this.movplatform1.body.velocity,
            loop: -1,
            tweens: [
                { x: +10, y: -10, duration: 2500, ease: 'Stepped' },
                { x: 0, y: +10, duration: 2500, ease: 'Stepped' },
                { x: -10, y: -10, duration: 2500, ease: 'Stepped' },
                { x: 0, y: +10, duration: 2500, ease: 'Stepped' },
            ]
        });

        //moving spikes
        this.spike1 = this.physics.add.sprite(250, 1050, 'spike').setScale(0.3, 0.3)
            .setVelocity(100, -100).setDepth(0);
        this.spike1.setImmovable(true);
        this.spike1.body.setAllowGravity(false);
        this.tweens.timeline({
            targets: this.spike1.body.velocity,
            loop: -1,
            tweens: [
                { x: 0, y: -150, duration: 2400, ease: 'Stepped' },
                { x: 0, y: 150, duration: 2400, ease: 'Stepped' },
            ]
        });

        this.spike2 = this.physics.add.sprite(600, 600, 'spike').setScale(0.3, 0.3)
            .setVelocity(100, -100).setDepth(0);
        this.spike2.setImmovable(true);
        this.spike2.body.setAllowGravity(false);
        this.tweens.timeline({
            targets: this.spike2.body.velocity,
            loop: -1,
            tweens: [
                { x: 0, y: 150, duration: 2400, ease: 'Stepped' },
                { x: 0, y: -150, duration: 2400, ease: 'Stepped' },
            ]
        });

        this.spike3 = this.physics.add.sprite(1240, 700, 'spike').setScale(0.3, 0.3)
            .setVelocity(100, -100).setDepth(0);
        this.spike3.setImmovable(true);
        this.spike3.body.setAllowGravity(false);
        this.tweens.timeline({
            targets: this.spike3.body.velocity,
            loop: -1,
            tweens: [
                { x: 150, y: 0, duration: 2400, ease: 'Stepped' },
                { x: -150, y: 0, duration: 2400, ease: 'Stepped' },
            ]
        });

        this.spike4 = this.physics.add.sprite(1580, 900, 'spike').setScale(0.3, 0.3)
            .setVelocity(100, -100).setDepth(0);
        this.spike4.setImmovable(true);
        this.spike4.body.setAllowGravity(false);
        this.tweens.timeline({
            targets: this.spike4.body.velocity,
            loop: -1,
            tweens: [
                { x: -150, y: 0, duration: 2400, ease: 'Stepped' },
                { x: 150, y: 0, duration: 2400, ease: 'Stepped' },
            ]
        });

        //asteroids
        this.asteroid1 = this.asteroid.create(1940, 20, 'asteroid').setScale(0.5, 0.5);
        this.asteroid2 = this.asteroid.create(2140, 200, 'asteroid').setScale(0.6, 0.6);
        this.asteroid3 = this.asteroid.create(2400, 400, 'asteroid').setScale(0.4, 0.4);
        this.asteroid4 = this.asteroid.create(2740, 100, 'asteroid').setScale(0.5, 0.5);
        this.asteroid5 = this.asteroid.create(2940, 300, 'asteroid').setScale(0.6, 0.6);
        this.asteroid6 = this.asteroid.create(3100, 250, 'asteroid').setScale(0.4, 0.4);
        this.asteroid1.body.setAllowGravity(false);
        this.asteroid2.body.setAllowGravity(false);
        this.asteroid3.body.setAllowGravity(false);
        this.asteroid4.body.setAllowGravity(false);
        this.asteroid5.body.setAllowGravity(false);
        this.asteroid6.body.setAllowGravity(false);

        //platforms left to right
        this.platforms.create(0, 940, 'brock').setScale(0.5, 0.5).refreshBody();
        this.platforms.create(400, 960, 'srock').setScale(.5, 1).refreshBody();
        this.platforms.create(280, 400, 'brock').setScale(.3, 0.3).refreshBody();
        this.platforms.create(280, 500, 'srock').setScale(.75, 0.75).refreshBody();
        this.platforms.create(750, 880, 'srock').setScale(0.5, 0.4).refreshBody();
        this.platforms.create(860, 880, 'brock').setScale(0.3, 0.5).refreshBody();

        this.platforms.create(1950, 880, 'brock').setScale(.5, 1.5).refreshBody();
        this.platforms.create(1850, 550, 'srock').setScale(.5, .5).refreshBody();
        //this.platforms.create(1400, 340, 'srock').setScale(.5, .3).refreshBody();
        this.platforms.create(1000, 300, 'srock').setScale(.6, 1).refreshBody();

        this.goal.create(500, 400, 'goal').setScale(0.9, 0.9).refreshBody();

        //Create and configure player
        this.player = this.physics.add.sprite(50, 750, 'dude');
        this.player.setScale(1.5);
        this.player.setBounce(0);
        this.player.setCollideWorldBounds(true);

        //Add colliders between objects
        this.physics.add.collider(this.platforms, this.player);
        this.physics.add.collider(this.movplatform, this.player, this.platGrav, null, this);
        this.physics.add.collider(this.movplatform1, this.player, this.platGrav, null, this);
        this.physics.add.collider(this.goal, this.player, this.win, null, this);
        this.physics.add.overlap(this.deathLava, this.player, this.death, null, this);
            //spikes
        this.physics.add.overlap(this.spike1, this.player, this.death, null, this);
        this.physics.add.overlap(this.spike2, this.player, this.death, null, this);
        this.physics.add.overlap(this.spike3, this.player, this.death, null, this);
        this.physics.add.overlap(this.spike4, this.player, this.death, null, this);
            //asteroids
        this.physics.add.overlap(this.asteroid1, this.player, this.death, null, this);
        this.physics.add.overlap(this.asteroid2, this.player, this.death, null, this);
        this.physics.add.overlap(this.asteroid3, this.player, this.death, null, this);
        this.physics.add.overlap(this.asteroid4, this.player, this.death, null, this);
        this.physics.add.overlap(this.asteroid5, this.player, this.death, null, this);
        this.physics.add.overlap(this.asteroid6, this.player, this.death, null, this);
            //collectible
        this.physics.add.overlap(this.collectible, this.player, this.collect, null, this);

        //Debug text
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
            frames: this.anims.generateFrameNames('dude', { prefix: 'death', start: 1, end: 5, zeroPad: 3 }), frameRate: 13
        });
        this.anims.create({
            key: 'teleport',
            frames: this.anims.generateFrameNames('dude', { prefix: 'teleport', start: 1, end: 11, zeroPad: 3 }), frameRate: 13
        });
        this.anims.create({
            key: 'dash',
            frames: this.anims.generateFrameNames('dude', { prefix: 'dash', start: 1, end: 2, zeroPad: 3 }), frameRate: 5
        });
        this.anims.create({
            key: "collectibleAnim",
            frames: this.anims.generateFrameNumbers("collectible"),
            frameRate: 10,
            repeat: -1
        }); 
        this.collectible.play("collectibleAnim");
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
            if (this.soundStatus) {
                this.deathSound.play();
            }
            this.player.anims.play('death', true);
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
        if (this.winState) {
            if (this.soundStatus) {
                this.tpSound.play();
            }
            this.physics.pause();
            this.changeAnimations = true;
            this.player.anims.play('teleport', true);
            this.time.addEvent({
                delay: 650, // in ms
                callback: () => {
                    this.winState = false;
                    this.player.x = 9999;
                    //this.game.sound.stopAll();
                    this.scene.start('Level3', { soundStatus: this.soundStatus });
                }
            })
        }

        //Basic Movement and animation binding
        if (this.controls.left.isDown || this.aKey.isDown) {
            this.player.setVelocityX(-160);
            this.player.flipX = true;

            //Dash move, 2 second cooldown, goes left
            if (Phaser.Input.Keyboard.JustDown(this.zKey)) {
                this.coolDownCheck = this.time.now - this.coolDown;
                if (this.coolDownCheck > 2000) {
                    if (this.soundStatus) {
                        this.dashSound.play();
                    }
                    this.player.anims.play('dash', true);
                    this.player.setVelocityX(-4000);
                    this.coolDown = this.time.now;
                }
            }
            if (!touchFloor) {
                if (!this.changeAnimations)
                    this.player.anims.play('jumping', true);
            } else {
                if (!this.changeAnimations)
                    this.player.anims.play('move_right', true);
            }
        }
        else if (this.controls.right.isDown || this.dKey.isDown) {
            this.player.setVelocityX(160);
            this.player.flipX = false;
            //Dash move, 2 second cooldown, goes right
            if (Phaser.Input.Keyboard.JustDown(this.zKey) || Phaser.Input.Keyboard.JustDown(this.spaceBar)) {
                this.coolDownCheck = this.time.now - this.coolDown;
                if (this.coolDownCheck > 2000) {
                    if (this.soundStatus) {
                        this.dashSound.play();
                    }
                    this.player.anims.play('dash', true)
                    this.player.setVelocityX(4000);
                    this.coolDown = this.time.now;
                }
            }
            if (!touchFloor) {
                if ((this.controls.right.isDown || this.controls.left.isDown) || (this.dKey.isDown || this.aKey.isDown)) {
                    if (!this.changeAnimations)
                        this.player.anims.play('jumping', true);
                }
                else {
                    if (!this.changeAnimations)
                        this.player.anims.play('standing_jump', true);
                }
            } else {
                if (!this.changeAnimations)
                    this.player.anims.play('move_right', true);
            }
        }
        else {
            this.player.setVelocityX(0);
            if (!this.changeAnimations) {
                this.player.anims.play('standing', true);
            }
        }

        //Double jump
        if ((upPress && touchFloor) || (wPress && touchFloor)) {
            if (this.soundStatus) { this.jetpack.play(); }
            this.player.setVelocityY(-220);
            this.jumpCount++;
            //this.statusText.setText(this.jumpCount);
        }
        else if ((upPress && (!touchFloor && this.jumpCount < 2)) || (wPress && (!touchFloor && this.jumpCount < 2))) {
            if (this.soundStatus) { this.jetpack.play(); }
            this.player.setVelocityY(-220);
            this.jumpCount++;
            //this.statusText.setText(this.jumpCount);
        }
        else if ((touchFloor && !upPress && this.jumpCount != 0) || (touchFloor && !wPress && this.jumpCount != 0)) {
            this.jumpCount = 0;
            //this.statusText.setText(this.jumpCount);
        }

        //textboxes
        if (this.counter == 0) { 
            this.tbox = this.add.image(280, 140, 'info').setScale(2, 0.7); 
            this.firstText = this.add.text(100, 100, this.prompt1);
            this.counter++;
            if(this.soundStatus) { this.messageSound.play(); }
        } 
        else if (this.player.x > 600 && this.counter == 1) {
            this.firstText.destroy();
            this.tbox.destroy();
            this.counter++;
        }
        if(this.player.x > 1750 && this.player.y < 600 && this.counter == 2) {
            this.tbox = this.add.image(900, 610, 'info').setScale(2, 0.5);
            this.secondText = this.add.text(715, 580, this.prompt2);
            this.counter++;
            if(this.soundStatus) { this.messageSound.play(); }
        }
        else if(this.player.x < 1600 && this.counter == 3) {
            this.secondText.destroy();
            this.tbox.destroy();
        }

        //asteroids
        this.moveAsteroids(this.asteroid1);
        this.moveAsteroids(this.asteroid2);
        this.moveAsteroids(this.asteroid3);
        this.moveAsteroids(this.asteroid4);
        this.moveAsteroids(this.asteroid5);
        this.moveAsteroids(this.asteroid6);

        //rotate asteroids
        this.asteroid1.angle += 0.6;
        this.asteroid2.angle -= 0.5;
        this.asteroid3.angle += 0.4;
        this.asteroid4.angle -= 0.7;
        this.asteroid5.angle -= 0.9;
        this.asteroid6.angle -= 1.1;

        //spike
        this.spike1.angle += .4;
        this.spike2.angle -= .4;
        this.spike3.angle += .4;
        this.spike4.angle -= .4;
    }

    collect(player, collectible) {
        this.add.text(100, 100, "FUCKO");
        console.log("FUCKO");
        collectible.stop();
        collectible.disableBody(true, true);
        collectible.destroy();
    }

    platGrav(player, movplatform) {
        if (this.player.body.touching.down) {
            this.player.body.setVelocityY(100);
        }
    }

    moveAsteroids(asteroid) {
        asteroid.x -= Phaser.Math.Between(1, 2); //random speed
        if(asteroid.x < 0) {
            this.resetAsteroids(asteroid);
        }
    }
    
    resetAsteroids(asteroid) {
        asteroid.x = 1950; 
        asteroid.y = Phaser.Math.Between(-40, 300);
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
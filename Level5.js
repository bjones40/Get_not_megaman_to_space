export default class Level5 extends Phaser.Scene {
    constructor() {
        super('Level5');
    }

    init(options) {
        this.soundStatus = options.soundStatus;
    }

    preload() {
        this.load.atlas('dude', 'assets/dude2.png', 'assets/dude2.json');
        this.load.image('skip', 'assets/retired/skip.png');
        this.load.image('bg', 'assets/bg.jpg');
        this.load.image('rlava', 'assets/blocks/risingLava.png');
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
    }

    create() {
        //Utility variables
        this.statusText = "";
        this.jumpCount = 0;
        this.coolDown = 0;
        this.counter = 0;
        this.prompt1 = "Looks like the teleporter damaged \nmy jetpack...\n\nGotta make my way across \nwithout a double jump!";


        //Bind world objects
        this.background = this.add.image(0, 0, 'bg').setOrigin(0);
        this.platforms = this.physics.add.staticGroup();
        this.floatplatforms = this.physics.add.group();
        this.risingLava = this.physics.add.group();
        this.goal = this.physics.add.staticGroup();
        this.asteroid = this.physics.add.group();
        this.skipButton = this.add.image(60,30,'skip').setInteractive();
        console.log("Sound update: " + this.soundStatus);

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
        this.risingLava = this.physics.add.sprite(400, 1010, 'rlava').setScale(1000, 6).refreshBody().setDepth(1)
            .setVelocity(100, -100);
        this.risingLava.setImmovable(true);
        this.risingLava.body.setAllowGravity(false);
        this.tweens.timeline({
            targets: this.risingLava.body.velocity,
            loop: -1,
            tweens: [
                { x: 10, y: 45, duration: 3000, ease: 'Stepped' },
                { x: -10, y: 15, duration: 2000, ease: 'Stepped' },
                { x: 10, y: -45, duration: 3000, ease: 'Stepped' },
                { x: -10, y: -15, duration: 2000, ease: 'Stepped' }
            ]
        });

        //moving platform
        this.movplatform0 = this.physics.add.sprite(1750, 360, 'movplatform').setScale(.7, .5)
            .setVelocity(100, -100);
        this.movplatform0.setImmovable(true);
        this.movplatform0.body.setAllowGravity(false);
        this.tweens.timeline({
            targets: this.movplatform0.body.velocity,
            loop: -1,
            tweens: [
                { x: 0, y: +150, duration: 3000, ease: 'Stepped' },
                { x: 0, y: 0, duration: 1000, ease: 'Stepped' },
                { x: 0, y: -150, duration: 3000, ease: 'Stepped' },
                { x: 0, y: 0, duration: 1900, ease: 'Stepped' }
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

        this.movplatform2 = this.physics.add.sprite(1100, 360, 'movplatform').setScale(.4, .6)
            .setVelocity(100, -100);
        this.movplatform2.setImmovable(true);
        this.movplatform2.body.setAllowGravity(false);
        this.tweens.timeline({
            targets: this.movplatform2.body.velocity,
            loop: -1,
            tweens: [
                { x: -50, y: 0, duration: 3000, ease: 'Stepped' },
                { x: 0, y: 0, duration: 100, ease: 'Stepped' },
                { x: +50, y: 0, duration: 3000, ease: 'Stepped' },
                { x: 0, y: 0, duration: 100, ease: 'Stepped' }
            ]
        });

        this.movplatform3 = this.physics.add.sprite(690, 220, 'movplatform').setScale(.6, .3)
            .setVelocity(100, -100);
        this.movplatform3.setImmovable(true);
        this.movplatform3.body.setAllowGravity(false);
        this.tweens.timeline({
            targets: this.movplatform3.body.velocity,
            loop: -1,
            tweens: [
                { x: 0, y: +50, duration: 3000, ease: 'Stepped' },
                { x: 0, y: 0, duration: 100, ease: 'Stepped' },
                { x: 0, y: -50, duration: 3000, ease: 'Stepped' },
                { x: 0, y: 0, duration: 100, ease: 'Stepped' }
            ]
        });
        
        //asteroids
        this.asteroid1 = this.asteroid.create(0, 20, 'asteroid').setScale(0.5, 0.5);
        this.asteroid2 = this.asteroid.create(0, 500, 'asteroid').setScale(0.6, 0.6);
        this.asteroid3 = this.asteroid.create(0, 100, 'asteroid').setScale(0.4, 0.4);
        this.asteroid4 = this.asteroid.create(-200, 400, 'asteroid').setScale(0.5, 0.5);
        this.asteroid5 = this.asteroid.create(-400, 300, 'asteroid').setScale(0.6, 0.6);
        this.asteroid6 = this.asteroid.create(-600, 340, 'asteroid').setScale(0.4, 0.4);
        this.asteroid7 = this.asteroid.create(-900, 530, 'asteroid').setScale(0.5, 0.4);
        this.asteroid8 = this.asteroid.create(-1100, 340, 'asteroid').setScale(0.5, 0.4);
        this.asteroid1.body.setAllowGravity(false);
        this.asteroid2.body.setAllowGravity(false);
        this.asteroid3.body.setAllowGravity(false);
        this.asteroid4.body.setAllowGravity(false);
        this.asteroid5.body.setAllowGravity(false);
        this.asteroid6.body.setAllowGravity(false);
        this.asteroid7.body.setAllowGravity(false);
        this.asteroid8.body.setAllowGravity(false);

        //platforms left to right
        this.platforms.create(0, 885, 'brock').setScale(0.4, 0.5).refreshBody();
        this.float1 = this.floatplatforms.create(300, 860, 'srock').setScale(.3, .3).refreshBody();
        this.float1.body.setAllowGravity(false).setImmovable(false);
        //
        this.float2 = this.floatplatforms.create(550, 880, 'srock').setScale(.3, .3).refreshBody();
        this.float2.body.setAllowGravity(false).setImmovable(false);
        this.float2.flipX = true;
        //
        this.float3 = this.floatplatforms.create(800, 850, 'srock').setScale(.3, .3).refreshBody();
        this.float3.body.setAllowGravity(false).setImmovable(false);
        //
        this.float4 = this.floatplatforms.create(1300, 850, 'srock').setScale(.4, .3).refreshBody();
        this.float4.body.setAllowGravity(false).setImmovable(false);
        //
        this.float5 = this.floatplatforms.create(1500, 790, 'srock').setScale(.25, .4).refreshBody();
        this.float5.body.setAllowGravity(false).setImmovable(false);
        //
        this.float6 = this.floatplatforms.create(430, 280, 'srock').setScale(.25, .4).refreshBody();
        this.float6.body.setAllowGravity(false).setImmovable(false);
        
        this.platforms.create(1000, 895, 'brock').setScale(0.3, 0.5).refreshBody();
        this.platforms.create(1890, 320, 'srock').setScale(.5, .5).refreshBody();
        this.goal.create(220, 300, 'goal').setScale(0.9, 0.9).refreshBody();

        //Create and configure player
        this.player = this.physics.add.sprite(50, 750, 'dude')
            .setScale(1.5)
            .setBounce(0)
            .setCollideWorldBounds(true);

        //Add colliders between objects
        this.physics.add.collider(this.platforms, this.player);
        this.physics.add.collider(this.movplatform0, this.player, this.platGrav, null, this);
        this.physics.add.collider(this.movplatform1, this.player, this.platGrav, null, this);
        this.physics.add.collider(this.movplatform2, this.player, this.platGrav, null, this);
        this.physics.add.collider(this.movplatform3, this.player, this.platGrav, null, this);
        this.physics.add.collider(this.floatplatforms, this.player);
        this.physics.add.collider(this.goal, this.player, this.win, null, this);
        this.physics.add.overlap(this.risingLava, this.player, this.death, null, this);

        //asteroids
        this.physics.add.overlap(this.asteroid1, this.player, this.death, null, this);
        this.physics.add.overlap(this.asteroid2, this.player, this.death, null, this);
        this.physics.add.overlap(this.asteroid3, this.player, this.death, null, this);
        this.physics.add.overlap(this.asteroid4, this.player, this.death, null, this);
        this.physics.add.overlap(this.asteroid5, this.player, this.death, null, this);
        this.physics.add.overlap(this.asteroid6, this.player, this.death, null, this);
        this.physics.add.overlap(this.asteroid7, this.player, this.death, null, this);
        this.physics.add.overlap(this.asteroid8, this.player, this.death, null, this);

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
        this.skipButton.on('pointerdown', function (pointer) {
            this.scene.start('primaryMenu', {soundStatus: this.soundStatus});
        }.bind(this));
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
                    this.scene.start('primaryMenu', { soundStatus: this.soundStatus });
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
            console.log("First Jump");
        }

        //textboxes
        if (this.counter == 0) {
            this.tbox = this.add.image(280, 140, 'info').setScale(2, 0.7);
            this.firstText = this.add.text(100, 100, this.prompt1);
            this.counter++;
            if (this.soundStatus) { this.messageSound.play(); }
        }
        else if (this.player.x > 200 && this.counter == 1) {
            this.firstText.destroy();
            this.tbox.destroy();
            this.counter++;
        }

        //asteroids
        this.moveAsteroids(this.asteroid1);
        this.moveAsteroids(this.asteroid2);
        this.moveAsteroids(this.asteroid3);
        this.moveAsteroids(this.asteroid4);
        this.moveAsteroids(this.asteroid5);
        this.moveAsteroids(this.asteroid6);
        this.moveAsteroids(this.asteroid7);
        this.moveAsteroids(this.asteroid8);

        //rotate asteroids
        this.asteroid1.angle += 0.6;
        this.asteroid2.angle -= 0.5;
        this.asteroid3.angle += 0.4;
        this.asteroid4.angle -= 0.7;
        this.asteroid5.angle -= 0.9;
        this.asteroid6.angle -= 1.1;
        this.asteroid7.angle -= 0.9;
        this.asteroid8.angle -= 0.1;
    }

    platGrav(player, movplatform) {
        if (this.player.body.touching.down) {
            this.player.body.setVelocityY(100);
        }
    }

    moveAsteroids(asteroid) {
        asteroid.x += Phaser.Math.Between(1, 3); //random speed
        if (asteroid.x > 1930) {
            this.resetAsteroids(asteroid);
        }
    }

    resetAsteroids(asteroid) {
        asteroid.x = -50;
        asteroid.y = Phaser.Math.Between(0, 610);
    }

    //Win condition: land on end goal
    win(player, goal) {
        if (this.player.body.touching.down) {
            this.winState = true;
        }
    }

    //Lose condition: hit lava
    death(player, risingLava) {
        this.physics.pause();
        this.gameOver = true;
    }
}
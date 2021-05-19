export default class Outro extends Phaser.Scene {
    constructor() {
        super('Outro');
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
        this.prompt1 = "Is- is that a ship???\n Is someone else on this planet\nbesides me...?";


        //Bind world objects
        this.background = this.add.image(0, 0, 'bg').setOrigin(0);
        this.platforms = this.physics.add.staticGroup();
        this.goal = this.physics.add.staticGroup();
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
        //platforms left to right
        this.platforms.create(0, 900, "sm").setScale(2,2).refreshBody();

        //Create and configure player
        this.player = this.physics.add.sprite(50, 750, 'dude')
            .setScale(1.5)
            .setBounce(0)
            .setCollideWorldBounds(true);

        //Add colliders between objects
        this.physics.add.collider(this.platforms, this.player);
        this.physics.add.collider(this.goal, this.player, this.win, null, this);

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
                    this.game.sound.stopAll();
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
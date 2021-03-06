export default class Level1 extends Phaser.Scene {
    constructor() {
        super('Level1');
    }

    init(options) {
        this.soundStatus = options.soundStatus;
    }

    preload() {
        this.load.atlas('dude', 'assets/dude2.png', 'assets/dude2.json');
        this.load.image('skip', 'assets/retired/skip.png');
        this.load.image('lgplatform', 'assets/lp.png');
        this.load.image('mdplatform', 'assets/mp.png');
        this.load.image('smplatform', 'assets/sp.png');
        this.load.image('bg', 'assets/bg.jpg');
        this.load.image('lava', 'assets/blocks/lava.jpg');
        this.load.image('goal', 'assets/teleport.png');
        this.load.image('info', 'assets/text/textbox.jpg');
        this.load.image('block', 'assets/blocks/platform_standard_M.png');
        this.load.image('ship', 'assets/ship2.png');
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
        this.movementControls1 = "My ship may have crashed, but I can\nstill move...\n\n(Press the left arrow to move left, and\nright arrow to move right\nOr A/D)";
        this.movementControls2 = "The planet's environment is hostile...\nmy jetpack should keep me safe from\nthis lava.\n\n(Press the up arrow (or W) to jump.\nPress the up arrow again in midair\nto double jump)";
        this.movementControls3 = "This gap is too wide for my jetpack's \nfuel cells, I'll have to activate my\naerial boosters.\n\n(Press 'z' (or space) while moving to\ndash in that direction)\n<2 second cooldown>";
        this.movementControls4 = "That platform is emitting powerful \nenergy. If I get on top of it,\nI should be able to use my teleporter!\n\n(Standing here clears the level!)";

        //Bind world objects
        this.add.image(0, 0, 'bg').setOrigin(0);
        this.add.image(100, 800, 'ship');
        this.tutorialInfo = this.add.image(200, 400, 'info').setScale(2, 1);
        this.statusText = this.add.text(10, 330, this.movementControls1, { color: 'white' });
        console.log("Sound status: " + this.soundStatus);
        this.platforms = this.physics.add.staticGroup();
        this.deathLava = this.physics.add.staticGroup();
        this.goal = this.physics.add.staticGroup();
        this.skipButton = this.add.image(60, 30, 'skip').setInteractive();

        //Create world objects
        this.deathLava.create(400, 1050, 'lava').setScale(1000, 6).refreshBody();
        this.platforms.create(220, 1000, 'mdplatform').setScale(1.8, 1.5).refreshBody();
        this.platforms.create(800, 900, 'smplatform').refreshBody();
        this.platforms.create(920, 900, 'smplatform').refreshBody();
        this.platforms.create(1600, 860, 'mdplatform').setScale(1.2, 1.5).refreshBody();

        this.goal.create(1800, 800, 'goal').setScale(0.9, 0.9).refreshBody();
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
        this.tpSound = this.sound.add('teleport', {
            loop: false,
            volume: .1
        });
        this.dashSound = this.sound.add('dash', {
            loop: false,
            volume: .1
        });

        //Create and configure player
        this.player = this.physics.add.sprite(75, 920, 'dude');
        this.player.setScale(2);
        this.player.setBounce(0.3);
        this.player.setCollideWorldBounds(true);

        //Add colliders between objects
        this.physics.add.collider(this.platforms, this.player);
        this.physics.add.overlap(this.deathLava, this.player, this.death, null, this);
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
            this.scene.start('Level2', { soundStatus: this.soundStatus });
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
                    this.scene.start('Level2', { soundStatus: this.soundStatus });
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

        //Draw and move tutorial text based on player location
        if (this.player.x < 400 && this.player.x > 0) {
            this.tutorialInfo.x = 200;
            this.statusText.setText(this.movementControls1);
            this.statusText.x = 10;

            if (this.soundStatus == true && this.counter == 0) {
                this.messageSound.play();
                this.counter++;
            }
        }
        else if (this.player.x >= 400 && this.player.x < 900) {

            this.tutorialInfo.x = 700;
            this.statusText.setText(this.movementControls2);
            this.statusText.x = 510;

            if (this.soundStatus == true && this.counter == 1) {
                this.messageSound.play();
                this.counter++;
            }
        }
        else if (this.player.x >= 900 && this.player.x < 1450) {
            this.tutorialInfo.x = 1200;
            this.statusText.setText(this.movementControls3);
            this.statusText.x = 1010;

            if (this.soundStatus == true && this.counter == 2) {
                this.messageSound.play();
                this.counter++;
            }
        }
        else {
            this.tutorialInfo.x = 1600;
            this.statusText.setText(this.movementControls4);
            this.statusText.x = 1410;

            if (this.soundStatus == true && this.counter == 3) {
                this.messageSound.play();
                this.counter++;
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
        this.messageSound.stop();
        this.gameOver = true;
    }
}
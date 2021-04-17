export default class Level1 extends Phaser.Scene {

    constructor() {
        super('Level1');
    }

    preload() {
        this.load.atlas('dude', 'assets/Dude2.png', 'assets/dude2.json');
        this.load.image('char', 'assets/char.jpg');
        this.load.image('platform', 'assets/platformg.jpg');
        this.load.image('bg', 'assets/bgx.jpg');
        this.load.image('lava', 'assets/lava.png');
        this.load.image('goal', 'assets/win.jpg');
    }
    create() {
        //Utility variables
        this.winText = "";
        this.jumpCount = 0;
        this.coolDown = 0;
        this.wins = 0;

        //Bind world objects
        this.add.image(400, 300, 'bg');
        this.platforms = this.physics.add.staticGroup();
        this.deathLava = this.physics.add.staticGroup();
        this.goal = this.physics.add.staticGroup();

        //Create world objects
        this.deathLava.create(400, 586, 'lava').setScale(100, 5).refreshBody();
        this.platforms.create(100, 600, 'platform').setScale(2, 10).refreshBody();
        this.platforms.create(420, 600, 'platform').setScale(2, 15).refreshBody();
        this.platforms.create(500, 600, 'platform').setScale(2, 20).refreshBody();
        this.goal.create(700, 400, 'goal').setScale(5, 2).refreshBody();

        //Create and configure player
        this.player = this.physics.add.sprite(75, 485, 'dude');
        this.player.setScale(2);
        this.player.setBounce(0.2);
        this.player.setCollideWorldBounds(true);

        //Add colliders between objects
        this.physics.add.collider(this.platforms, this.player);
        this.physics.add.overlap(this.deathLava, this.player, this.death, null, this);
        this.physics.add.collider(this.goal, this.player, this.win, null, this);

        this.winText = this.add.text(0, 0, 'Score: 0');

        //Bind controls
        this.controls = this.input.keyboard.createCursorKeys();
        this.spaceBar = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

        //Bind animations
        this.anims.create({
            key: 'move_right',
            frames: this.anims.generateFrameNames('dude', {
                prefix: 'walk',
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
                end: 1,
                zeroPad: 3
            }),
            repeat: -1

        });
        this.anims.create({
            key: 'jumping',
            frames: this.anims.generateFrameNames('dude', {
                prefix: 'jump',
                end: 4,
                zeroPad: 3
            }),
            repeat: -1

        });
        this.anims.create({
            key: 'standing_jump',
            frames: this.anims.generateFrameNames('dude', {
                prefix: 'jump_standing_jet',
                end: 1,
                zeroPad: 3
            }),
            repeat: -1

        });



    }

    update() {
        //Evaluation constants (Just pressed a key, touching the floor, etc)
        const upPress = Phaser.Input.Keyboard.JustDown(this.controls.up);
        const rightPress = Phaser.Input.Keyboard.JustDown(this.controls.right);
        const leftPress = Phaser.Input.Keyboard.JustDown(this.controls.left);
        const touchFloor = this.player.body.touching.down;

        //Gameover Check
        this.gameOver;
        if (this.gameOver) {
            this.registry.destroy();
            this.events.off();
            this.scene.restart();
            this.gameOver = false;
        }

        //Basic Movement and animation binding
        if (this.controls.left.isDown) {
            this.player.setVelocityX(-160);
            this.player.flipX = true;
            if (!touchFloor) {
                this.player.anims.play('jumping', true);
            } else {
                this.player.anims.play('move_right', true);
            }
        }
        else if (this.controls.right.isDown) {
            this.player.setVelocityX(160);
            this.player.flipX = false;
            if (!touchFloor) {
                if (this.controls.right.isDown || this.controls.left.isDown) {
                    this.player.anims.play('jumping', true);
                }
                else {
                    this.player.anims.play('standing_jump', true);
                }
            } else {
                this.player.anims.play('move_right', true);
            }
        }
        else
        {
            this.player.setVelocityX(0);
            this.player.anims.play('standing', true);
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
        if (leftPress || rightPress) {
            this.pressDelay = this.time.now - this.lastTime;
            this.lastTime = this.time.now;
            this.coolDownCheck = this.time.now - this.coolDown;
            console.log("Cooldown"+this.coolDown);
            if (this.pressDelay < 350 && rightPress && this.coolDownCheck > 2000) {
                this.player.setVelocityX(4000);
                this.coolDown = this.time.now;
                console.log("Dash right");
            } else if (this.pressDelay < 350 && leftPress && this.coolDownCheck > 2000) {
                this.player.setVelocityX(-4000);
                this.coolDown = this.time.now;
                console.log("Dash left")
            }
        }
    }

    //Win condition: land on end goal
    win(player, goal) {
        if (this.player.body.touching.down) {
            this.scene.start("Level2");
        }
    }
    //Lose condition: hit lava
    death(player, deathLava) {
        this.gameOver = true;
    }
}
export default class Level1 extends Phaser.Scene {

    constructor() {
        super('Level1');
    }

    preload() {
        this.load.atlas('dude', 'assets/dude2.png', 'assets/dude2.json');
        this.load.image('char', 'assets/char.jpg');
        this.load.image('platform', 'assets/platform.jpg');
        this.load.image('bg', 'assets/bg.jpg');
        this.load.image('lava', 'assets/blocks/lava.jpg');
        this.load.image('goal', 'assets/win.jpg');
        this.load.image('info', 'assets/textbox.jpg');
        this.load.image('block','assets/blocks/platform_standard_M.png');
    }
    create() {
        //Utility variables
        this.statusText = "";
        this.jumpCount = 0;
        this.coolDown = 0;
        this.movementControls1 = "My ship may have crashed, but I can\nstill move...\n\n(Left arrow to move left\nRight arrow to move right)";
        this.movementControls2 = "The planet's environment is hostile...\nmy jetpack should keep me safe from\nthis lava.\n\n(Up arrow to jump,\nUp arrow again in midair to double jump)";
        this.movementControls3 = "This gap is too wide for my\njetpack's fuel cells,\nI'll have to activate my\naerial boosters.\n\n(Double tap left or right arrow to dash,\n2 second cooldown)";
        this.movementControls4 = "That platform is emitting\npowerful energy, if I get on top of it,\nI should be able to use my teleporter!\n\n(Standing here clears the level!)";

        //Bind world objects
        this.add.image(0, 0, 'bg').setOrigin(0);
        this.tutorialInfo = this.add.image(200,400,'info').setScale(2,1);
        this.statusText = this.add.text(10, 315, this.movementControls1, {color: 'black'});
        this.platforms = this.physics.add.staticGroup();
        this.deathLava = this.physics.add.staticGroup();
        this.goal = this.physics.add.staticGroup();

        //Create world objects
        this.deathLava.create(400,1050, 'lava').setScale(1000, 6).refreshBody();
        this.platforms.create(45, 1050, 'platform').setScale(20, 8).refreshBody();
        this.platforms.create(900, 1100, 'platform').setScale(2, 15).refreshBody();
        this.platforms.create(980, 1100, 'platform').setScale(2, 20).refreshBody();
        this.platforms.create(1650, 950, 'platform').setScale(5, 3).refreshBody();
        this.goal.create(1800, 800, 'goal').setScale(5, 2).refreshBody();

        //Create and configure player
        this.player = this.physics.add.sprite(75, 955, 'dude');
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
                    this.scene.start("Level2");
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
            this.player.setVelocityY(-220);
            this.jumpCount++;
            this.statusText.setText(this.jumpCount);
        }
        else if(upPress && (!touchFloor && this.jumpCount < 2)) {
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
        
        //Draw and move tutorial text based on player location
        if(this.player.x < 400)
        {
            this.tutorialInfo.x = 200;
            this.statusText.setText(this.movementControls1);
            this.statusText.x = 10;
        }
        else if(this.player.x >= 400 && this.player.x < 900)
        {
            this.tutorialInfo.x = 700;
            this.statusText.setText(this.movementControls2);
            this.statusText.x = 510;
        }
        else if(this.player.x >= 900 && this.player.x < 1450)
        {
            this.tutorialInfo.x = 1200;
            this.statusText.setText(this.movementControls3);
            this.statusText.x = 1010;
        }
        else
        {
            this.tutorialInfo.x = 1600;
            this.statusText.setText(this.movementControls4);
            this.statusText.x = 1410;
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
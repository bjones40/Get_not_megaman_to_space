export default class Level2 extends Phaser.Scene {
    
    constructor(){
        super('Level2');
        
    }
  
    preload() {
        this.load.atlas('dude','assets/dude2.png','assets/dude2.json');
        this.load.image('char','assets/char.jpg');
        this.load.image('platform', 'assets/platformg.jpg');
        this.load.image('bg', 'assets/bgx.jpg');
        this.load.image('lava', 'assets/lava.png');
        this.load.image('goal', 'assets/win.jpg');
    }
create() {
    this.winText = "";
    this.jumpCount = 0;
    
    this.wins = 0;
    
    this.add.image(400, 300, 'bg');
    this.bouncer = this.physics.add.sprite(200,400,'platform').setScale(1,2);
    this.platforms = this.physics.add.staticGroup();
    this.deathLava = this.physics.add.staticGroup();
    this.goal = this.physics.add.staticGroup();

    this.deathLava.create(400, 586, 'lava').setScale(100, 5).refreshBody();
    this.platforms.create(100, 600, 'platform').setScale(2, 10).refreshBody();
    this.platforms.create(420, 600, 'platform').setScale(2, 15).refreshBody();
    this.platforms.create(500, 600, 'platform').setScale(2, 20).refreshBody();
    this.goal.create(700, 400, 'goal').setScale(5, 2).refreshBody();

    this.bouncer.body.allowGravity = false;
    this.bouncer.body.immovable = true;
    this.bouncer.body.setBounce(2,2);
    


    this.player = this.physics.add.sprite(75, 485, 'dude');
    this.player.setScale(.25);
    this.player.setBounce(0);
    this.player.body.setCollideWorldBounds(true,2,2);



    this.physics.add.collider(this.platforms, this.player);
    this.physics.add.overlap(this.deathLava, this.player, this.death,null,this);
    this.physics.add.collider(this.goal, this.player, this.win,null,this);
    this.physics.add.collider(this.bouncer, this.player, this.bounce,null,this);

    this.winText = this.add.text(0,0,'OMEGALUL');
    this.controls = this.input.keyboard.createCursorKeys();
    this.spaceBar = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    this.anims.create({
        key: 'move_right',
        frames: this.anims.generateFrameNames('dude', { prefix: 'walk', end: 4, zeroPad: 3}),frameRate: 10, repeat: -1});

    this.anims.create({
        key: 'standing',
        frames: this.anims.generateFrameNames('dude', { prefix: 'stand', end: 1, zeroPad: 3}), repeat: -1
    
    });
    this.anims.create({
        key: 'jumping',
        frames: this.anims.generateFrameNames('dude', { prefix: 'jump', end: 4, zeroPad: 3}), repeat: -1
    
    });
    this.anims.create({
        key: 'standing_jump',
        frames: this.anims.generateFrameNames('dude', { prefix: 'jump_standing_jet', end: 1, zeroPad: 3}), repeat: -1
    });
    this.anims.create({
        key: 'death',
        frames: this.anims.generateFrameNames('dude', { prefix: 'death', end: 5, zeroPad: 3})
    });
    this.anims.create({
        key: 'teleport',
        frames: this.anims.generateFrameNames('dude', { prefix: 'teleport', end: 11, zeroPad: 3})
    });
    this.anims.create({
        key: 'dash',
        frames: this.anims.generateFrameNames('dude', { prefix: 'dash', end: 2, zeroPad: 3})
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
    }
    if (upPress && (!touchFloor && this.jumpCount == 1)) {
        this.player.setVelocityY(-220);
        this.jumpCount++;
    }
    if (touchFloor && !upPress) {
        this.jumpCount = 0;
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
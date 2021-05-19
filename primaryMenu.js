export default class primaryMenu extends Phaser.Scene {
  constructor() {
    super('primaryMenu');
  }

  init(options) {
    this.soundStatus = options.soundStatus;
    console.log("Sound update: " + this.soundStatus);
  }

  preload() {
    this.load.image('sbutton','assets/text/start.png');
    this.load.image('obutton','assets/text/options2.png');
    this.load.image('title', 'assets/text/spaceman.png');
    this.load.image('titlebg', 'assets/titlebg.jpg');
    this.load.audio("mainMusic", 'assets/audio/sample_music.mp3');
    this.load.spritesheet('crystal', 'assets/spr_coin_ama.png', {
      frameWidth: 16, 
      frameHeight: 16
  });
  }

  create() {
    if(typeof(this.soundStatus) === 'undefined')
    {
      this.soundStatus = true;
      console.log("Initialized sound");
    }
    //creating text, buttons and images
    this.titlebg = this.add.image(0, 0, 'titlebg').setDisplaySize(window.innerWidth, window.innerHeight+200).setOrigin(0);
    this.gameButton = this.add.sprite(960, 450, 'sbutton').setInteractive();
    this.gameButton2 = this.add.sprite(960, 650, 'obutton').setInteractive();
    this.title = this.add.image(960, 200, 'title').setScale(2,2);
    
    this.hoveringSprite = this.add.sprite(100, 100, "crystal").setScale(3,3).setVisible(false);

    //play button hover 
    this.gameButton.setInteractive();
    this.gameButton.on("pointerover", () => {
      this.hoveringSprite.play("rotate");
      this.hoveringSprite.x = this.gameButton.x - 200;
      this.hoveringSprite.y = this.gameButton.y;
      this.hoveringSprite.setVisible(true);
    }) 
    this.gameButton.on("pointerout", () => {
      this.hoveringSprite.setVisible(false);
    })

    //options button hover
    this.gameButton2.setInteractive();
    this.gameButton2.on("pointerover", () => {
      this.hoveringSprite.play("rotate");
      this.hoveringSprite.x = this.gameButton2.x - 200;
      this.hoveringSprite.y = this.gameButton2.y;
      this.hoveringSprite.setVisible(true);
    }) 
    this.gameButton2.on("pointerout", () => {
      this.hoveringSprite.setVisible(false);
    })

    //anims
    this.anims.create({
      key: "rotate",
      frameRate: 4,
      repeat: -1,
      frames: this.anims.generateFrameNumbers("crystal", {
        frames: [0,1,2,3]
      })
    })

  

    //audio
    if(this.soundStatus) {
      this.mainMusic = this.sound.add("mainMusic", {volume: .5});
      this.mainMusic.play();
    } else { this.mainMusic.stop(); }
    
    this.gameButton.on('pointerdown', function (pointer) {
      this.mainMusic.stop();
      this.scene.stop();
      this.scene.start('Intro',{soundStatus: this.soundStatus});
    }.bind(this));

    this.gameButton2.on('pointerdown', function (pointer) {
      this.mainMusic.stop();
      this.scene.stop();
      this.scene.start('optionsMenu', {soundStatus: this.soundStatus});
    }.bind(this));
  }
}
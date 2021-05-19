export default class optionsMenu extends Phaser.Scene {
  constructor() {
    super('optionsMenu');
  }

  init(options) {
    this.soundStatus = options.soundStatus;
    console.log("Sound update: " + this.soundStatus);
  }

  preload() {
    this.load.image('titlebg', 'assets/titlebg.jpg');
    this.load.image('optionsmenu', 'assets/text/optionsmenu.png');
    this.load.image('back', 'assets/text/back.png');
    this.load.image('on', 'assets/text/soundOn.png');
    this.load.image('off', 'assets/text/soundOff.png');
    this.load.image('sound', 'assets/text/sound.png');
    this.load.audio("mainMusic", 'assets/audio/sample_music.mp3');
    this.load.image('secret', 'assets/exassets/meowsecret.gif');
    this.load.spritesheet('crystal', 'assets/spr_coin_ama.png', {
      frameWidth: 16,
      frameHeight: 16
    });
  }

  create() {
    this.titlebg = this.add.image(0, 0, 'titlebg').setDisplaySize(window.innerWidth, window.innerHeight + 200).setOrigin(0);
    this.optionsTitle = this.add.image(960, 100, 'optionsmenu');
    this.soundTitle = this.add.image(810, 300, 'sound');
    this.onButton = this.add.sprite(1110, 300, 'on').setInteractive();
    this.offButton = this.add.sprite(1110, 300, 'off').setInteractive();
    this.gameButton = this.add.image(960, 600, 'back').setInteractive();
    this.secretButton = this.add.image(10, 10, 'secret').setInteractive();
    this.mainMusic = this.sound.add("mainMusic");
    this.hoveringSprite = this.add.sprite(100, 100, "crystal").setScale(3, 3).setVisible(false);

    //play button hover 
    this.gameButton.on("pointerover", () => {
      console.log("WORKING");
      this.hoveringSprite.play("rotate");
      this.hoveringSprite.x = this.gameButton.x - 150;
      this.hoveringSprite.y = this.gameButton.y;
      this.hoveringSprite.setVisible(true);
    })
    this.gameButton.on("pointerout", () => {
      this.hoveringSprite.setVisible(false);
    })

    if (this.soundStatus) {
      this.mainMusic = this.sound.add("mainMusic", { volume: .5 });
      this.mainMusic.play();
    } else { this.mainMusic.stop(); }

    if (this.soundStatus) {
      this.offButton.visible = false;
    } else { this.onButton.visible = false; }
    this.soundTemp = this.soundStatus;

    //anims
    this.anims.create({
      key: "rotate",
      frameRate: 4,
      repeat: -1,
      frames: this.anims.generateFrameNumbers("crystal", {
        frames: [0, 1, 2, 3]
      })
    })

    this.onButton.on('pointerdown', function (pointer) {
      this.onButton.visible = false;
      this.offButton.visible = true;
      this.soundTemp = false;
      this.game.sound.stopAll();
      console.log("Sound: " + this.soundTemp);
    }.bind(this));

    this.offButton.on('pointerdown', function (pointer) {
      this.offButton.visible = false;
      this.onButton.visible = true;
      this.soundTemp = true;
      this.mainMusic.play();
      console.log("Sound: " + this.soundTemp);
    }.bind(this));

    this.gameButton.on('pointerdown', function (pointer) {
      this.mainMusic.stop();
      this.scene.start('primaryMenu', { soundStatus: this.soundTemp });
    }.bind(this));

    this.secretButton.on('pointerdown', function (pointer) {
      this.mainMusic.stop();
      this.scene.start('LevelEX', { soundStatus: this.soundTemp });
    }.bind(this));
  }
}

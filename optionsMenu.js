export default class optionsMenu extends Phaser.Scene {
  constructor(){
    super('optionsMenu');
  }

  init(options)
  {
  this.soundStatus = options.soundStatus;
    console.log("Sound update: " + this.soundStatus);
  }

  preload(){
    this.load.image('titlebg', 'assets/titlebg.jpg');
    this.load.image('optionsmenu', 'assets/optionsmenu.png');
    this.load.image('back', 'assets/back.png');
    this.load.image('on','assets/soundOn.png');
    this.load.image('off','assets/soundOff.png');
    this.load.image('sound','assets/sound.png');
    this.load.audio("mainMusic", "assets/audio/sample_music.mp3");
  }

  create(){
    this.titlebg = this.add.image(960, 540, 'titlebg').setDisplaySize(window.innerWidth, window.innerHeight+200);
    this.optionsTitle = this.add.image(960, 100, 'optionsmenu');
    this.soundTitle = this.add.image(810, 300, 'sound');
    this.onButton = this.add.sprite(1110, 300, 'on').setInteractive();
    this.offButton = this.add.sprite(1110, 300, 'off').setInteractive();
    this.gameButton = this.add.image(960, 600, 'back').setInteractive();
    this.mainMusic = this.sound.add("mainMusic");
    
    if(this.soundStatus == true)
    {
      this.offButton.visible = false;
    }
    else{
      this.onButton.visible = false;
    }
    this.soundTemp = this.soundStatus;

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
      this.scene.start('primaryMenu',{soundStatus: this.soundTemp});
    }.bind(this));
  }

}

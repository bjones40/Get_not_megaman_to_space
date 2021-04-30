export default class optionsMenu extends Phaser.Scene {
  constructor(){
    super('optionsMenu');
  }
  init(options)
  {
  this.soundStatus = options.soundStatus;
    console.log("Sound update: "+this.soundStatus);
  }
  preload(){
    this.load.image('rbutton','assets/return.png');
    this.load.image('on','assets/ON.jpg');
    this.load.image('off','assets/OFF.jpg');
    this.load.audio("mainMusic", "assets/audio/sample_music.mp3");
  }
  create(){
    this.gameButton = this.add.sprite(960, 600, 'rbutton').setInteractive();
    this.onButton = this.add.sprite(1100, 300, 'on').setInteractive();
    this.offButton = this.add.sprite(1100, 300, 'off').setInteractive();
    this.mainMusic = this.sound.add("mainMusic");
    if(this.soundStatus == true)
    {
      this.offButton.visible = false;
    }
    else{
      this.onButton.visible = false;
    }
    this.soundTemp = this.soundStatus;
 
    this.gameText = this.add.text(900, 100, 'OPTIONS', { fontSize: '32px', fill: '#fff' });
    this.soundtext = this.add.text(800,300,'SOUND',{ fontSize: '32px', fill: '#fff' });

    this.onButton.on('pointerdown', function (pointer) {
      this.onButton.visible = false;
      this.offButton.visible = true;
      this.soundTemp = false;
      this.game.sound.stopAll();
      console.log("Sound: "+this.soundTemp);
    }.bind(this));

    this.offButton.on('pointerdown', function (pointer) {
      this.offButton.visible = false;
      this.onButton.visible = true;
      this.soundTemp = true;
      this.mainMusic.play();
      console.log("Sound: "+this.soundTemp);
    }.bind(this));

    this.gameButton.on('pointerdown', function (pointer) {
      this.scene.start('primaryMenu',{soundStatus: this.soundTemp});
    }.bind(this));
  }
}

export default class optionsMenu extends Phaser.Scene {
  constructor(){
    super('optionsMenu');
  }
  init(options)
  {
  this.sound = options.sound;
    console.log("Sound update: "+this.sound);
  }
  preload(){
    this.load.image('rbutton','assets/return.png');
    this.load.image('on','assets/ON.jpg');
    this.load.image('off','assets/OFF.jpg');
  }
  create(){
    this.gameButton = this.add.sprite(960, 600, 'rbutton').setInteractive();
    this.onButton = this.add.sprite(1100, 300, 'on').setInteractive();
    this.offButton = this.add.sprite(1100, 300, 'off').setInteractive();
    if(this.sound == true)
    {
      this.offButton.visible = false;
    }
    else{
      this.onButton.visible = false;
    }
    this.soundStatus = this.sound;
 
    this.gameText = this.add.text(900, 100, 'OPTIONS', { fontSize: '32px', fill: '#fff' });
    this.soundtext = this.add.text(800,300,'SOUND',{ fontSize: '32px', fill: '#fff' });

    this.onButton.on('pointerdown', function (pointer) {
      this.onButton.visible = false;
      this.offButton.visible = true;
      this.soundStatus = false;
      console.log("Sound: "+this.soundStatus);
    }.bind(this));

    this.offButton.on('pointerdown', function (pointer) {
      this.offButton.visible = false;
      this.onButton.visible = true;
      this.soundStatus = true;
      console.log("Sound: "+this.soundStatus);
    }.bind(this));

    this.gameButton.on('pointerdown', function (pointer) {
      this.scene.start('primaryMenu',{sound: this.soundStatus});
    }.bind(this));
  }
}
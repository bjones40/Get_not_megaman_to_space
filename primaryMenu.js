export default class primaryMenu extends Phaser.Scene {
  constructor(){
    super('primaryMenu');
  }

  init(options)
  {
    this.sound = options.sound;
    console.log("Sound update: " + this.sound);
  }
  
  preload() {
    this.load.image('sbutton','assets/start.png');
    this.load.image('obutton','assets/options.png');
    this.load.audio("title_music", "assets/audio/sample_music.mp3");
  }

  create(){
    if(typeof(this.sound) === 'undefined')
    {
      this.sound = true;
      console.log("Initialized sound");
    }

    //interactable buttons
    this.gameButton = this.add.sprite(1000, 350, 'sbutton').setInteractive();
    this.gameButton2 = this.add.sprite(1000, 500, 'obutton').setInteractive();

    //Title
    this.gameText = this.add.text(860, 200, 'S P A C E M A N', { fontSize: '32px', fill: '#fff' });

    //button interactions
    this.gameButton.on('pointerdown', function (pointer) {
      this.scene.stop();
      this.scene.start('Level1',{sound: this.sound});
    }.bind(this));

    this.gameButton2.on('pointerdown', function (pointer) {
      this.scene.stop();
      this.scene.start('optionsMenu',{sound: this.sound});
    }.bind(this));
  
  }
}

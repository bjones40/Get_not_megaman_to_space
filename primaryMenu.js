export default class primaryMenu extends Phaser.Scene {
    constructor(){
        super('primaryMenu');
    }

    init(options)
    {
        this.soundStatus = options.soundStatus;
        console.log("Sound update: " + this.soundStatus);
    }

    preload(){
      this.load.image('sbutton','assets/text/start.png');
      this.load.image('obutton','assets/text/options2.png');
      this.load.image('title', 'assets/text/spaceman.png');
      this.load.image('titlebg', 'assets/titlebg.jpg');
      this.load.audio("mainMusic", "assets/audio/sample_music.mp3");
    }

    create(){
      if(typeof(this.soundStatus) === 'undefined')
      {
        this.soundStatus = true;
        console.log("Initialized sound");
      }
      this.titlebg = this.add.image(960, 540, 'titlebg').setDisplaySize(window.innerWidth, window.innerHeight+200);
      this.gameButton = this.add.sprite(960, 450, 'sbutton').setInteractive();
      this.gameButton2 = this.add.sprite(960, 650, 'obutton').setInteractive();
      this.title = this.add.image(960, 200, 'title').setScale(2,2);

      //audio
      if(this.soundStatus){
        this.mainMusic = this.sound.add("mainMusic");
        this.mainMusic.play();
      }
      else{
        this.mainMusic.stop();
      }
     

      this.gameButton.on('pointerdown', function (pointer) {
        this.scene.stop();
        this.scene.start('Level1',{soundStatus: this.soundStatus});
      }.bind(this));

      this.gameButton2.on('pointerdown', function (pointer) {
        this.scene.stop();
        this.scene.start('optionsMenu',{soundStatus: this.soundStatus});
      }.bind(this));

    }
    
}
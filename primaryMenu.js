export default class primaryMenu extends Phaser.Scene {
    constructor(){
        super('primaryMenu');
    }

    preload(){
      this.load.image('sbutton','assets/start.png');
      this.load.image('obutton','assets/options.png');
    }
    create(){
     
      this.gameButton = this.add.sprite(1000, 350, 'sbutton').setInteractive();
      this.gameButton2 = this.add.sprite(1000, 500, 'obutton').setInteractive();

        
        
   
 
this.gameText = this.add.text(860, 200, 'S P A C E M A N', { fontSize: '32px', fill: '#fff' });

 
this.gameButton.on('pointerdown', function (pointer) {
  this.scene.stop();
  this.scene.start('Level1');
}.bind(this));

this.gameButton2.on('pointerdown', function (pointer) {
  this.scene.stop();
  this.scene.start('Level2');
}.bind(this));


}
}

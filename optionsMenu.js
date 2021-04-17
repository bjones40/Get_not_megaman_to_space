export default class optionsMenu extends Phaser.Scene {
    constructor(){
        super('optionsMenu');
    }

    preload(){
      this.load.image('rbutton','assets/return.png');
    }
    create(){
        this.gameButton = this.add.sprite(370, 200, 'rbutton').setInteractive();
   
 
this.gameText = this.add.text(300, 100, 'OPTIONS', { fontSize: '32px', fill: '#fff' });

 


this.gameButton.on('pointerdown', function (pointer) {
  this.scene.start('primaryMenu');
}.bind(this));


}
}

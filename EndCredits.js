export default class EndCredits extends Phaser.Scene {
    constructor() {
        super("EndCredits");
    }

    init(options) {
        this.soundStatus = options.soundStatus;
    }

    preload() {
        this.load.audio('endMusic', 'assets/audio/endmusic.mp3');
        this.load.image('back', 'assets/text/back.png');
    }

    create() {
        this.gameOverText = "TO BE CONTINUED";
        this.gameButton = this.add.image(960, 800, 'back').setScale(0.5, 0.5).setInteractive();

        //audio
        this.endMusic = this.sound.add('endMusic', {
            loop: true,
            volume: .08
        });
        console.log("Sound status: " + this.soundStatus);
        if (this.soundStatus) {
            this.endMusic.play();
        } else { this.game.sound.stopAll(); }

        //text output on screen
        this.label = this.add.text(960, 300, '', { fontSize: 54, fontStyle: "bold" }).setOrigin(.5);
        this.typeWrite(this.gameOverText);

        //button functionality
        this.gameButton.on('pointerdown', function (pointer) {
            this.game.sound.stopAll();
            this.scene.start('primaryMenu', { soundStatus: this.soundTemp });
        }.bind(this));
    }

    typeWrite(text) {
        this.length = text.length;
        this.i = 0;
        this.time.addEvent({
            callback: () => {
                this.label.text += text[this.i];
                ++this.i;
            },
            repeat: this.length - 1,
            delay: 30
        })
    }

}
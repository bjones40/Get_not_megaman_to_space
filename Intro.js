

export default class Intro extends Phaser.Scene {
    constructor() {
        super("Intro");
    }

    init(options){
        this.soundStatus = options.soundStatus;
    }

    preload() {
        this.load.audio('typing', 'assets/audio/typing.mp3');
        this.load.audio('alarm', 'assets/audio/alarm.mp3');
        this.load.audio('crash', 'assets/audio/crash.mp3');
        this.load.audio('gameMusic', 'assets/audio/song.mp3');
    }

    create() {
        this.alertText = "*** INCOMING TRANSMISSION ***\n\nALERT CAN ANYONE HEAR ME. MY SHIP HAS SUSTAINED HEAVY DAMAGE AND I NEED IMMEDIATE HELP.\nI AM LOSING FUEL FAST AND WILL ATTEMPT TO LAND AT A NEARBY UNIDENTIFIED PLANET.\nMY SATELLITE SYSTEM HAS BEEN DAMAGED BEYOND REPAIR AND I DO NOT KNOW MY CURRENT LOCATION.\nIF ANYONE CAN HEAR THIS, MY LAST KNOWN COORDINATES ARE 006151-\n\n*** TRANSMISSION HAS ENDED ***";

        this.typingSound = this.sound.add('typing', {
            loop : true,
            volume : .08
        });
        this.alarm = this.sound.add('alarm', {
            loop : true,
            volume : .25
        });
        this.crash = this.sound.add('crash', {
            loop : false,
            volume : 1
        });
        this.gameMusic = this.sound.add('gameMusic', {
            loop : true,
            volume : .1
        });

        console.log("Sound status: " + this.soundStatus);
        if(this.soundStatus) {
            this.gameMusic.play();
            this.typingSound.play();
            this.alarm.play();
        } else { this.game.sound.stopAll(); } 

        this.keyEnter = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);
        this.enterPrompt = this.add.text(960, 800, 'PRESS ENTER TO SKIP', { fontSize: 24 }).setOrigin(0.5);
 
        this.label = this.add.text(960, 400, '', { fontSize: 24 }).setOrigin(.5);
        this.typeWrite(this.alertText);


    }

    update() {    
        if(this.i == this.length || Phaser.Input.Keyboard.JustDown(this.keyEnter)) {
            this.cameras.main.fade(3100);
            this.typingSound.stop();
            this.alarm.stop();
            this.time.addEvent({
                callback: () => {
                    this.scene.stop();
                    this.scene.start('Level1', {soundStatus: this.soundStatus});
                },
                delay: 3000
            })
        }
        if(this.i == this.length-35) {
            if(this.soundStatus) {
                this.crash.play();
                this.alarm.stop();
            }
        }
    }

    typeWrite(text) {
        this.length = text.length;
        this.i = 0;
        this.time.addEvent({
            callback: () => {
                this.label.text += text[this.i];
                ++this.i;
            },
            repeat: this.length-1,
            delay: 40
        })
    }

}


export default class Intro extends Phaser.Scene {
    constructor() {
        super("Intro");
    }

    init(options) {
        var count = 0;
    }

    preload() {
        this.load.audio('message', 'assets/audio/message.mp3');
    }

    create() {
        this.myText = [
            "ALERT CAN ANYONE HEAR ME. MY SHIP HAS SUSTAINED HEAVY DAMAGE AND I NEED IMMEDIATE HELP",
            "I AM LOSING FUEL FAST AND WILL ATTEMPT TO LAND AT A NEARBY UNIDENTIFIED PLANET",
            "MY SATELLITE SYSTEM HAS BEEN DAMAGED BEYOND REPAIR AND I DO NOT KNOW MY CURRENT LOCATION",
            "IF ANYONE CAN HEAR THIS, MY LAST KNOWN COORDINATES ARE 006151-",
            " * TRANSMISSION HAS ENDED *"
        ]

        this.i = 0;
        this.x = 0;
        this.messageSound = this.sound.add('message', {
            loop: false,
            volume: .3
        });
        this.keyEnter = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);
        this.enterPrompt = this.add.text(960, 800, 'PRESS ENTER TO CONTINUE', { fontSize: 32, color: 'white', align: 'right' }).setOrigin(0.5);

        var style = {
            'color': 'white',
            'fontSize': '24px',
            'wordWrap': {
                'width': this.sys.game.config.width
            }
        }
        this.tw = new TypeWriter({
            'scene': this,
            'text': myText,
            'speed': .5,
            'style': style
        });

    
    }

    update() {
        
    
        /*if(Phaser.Input.Keyboard.JustDown(this.keyEnter) || this.i == 0) {
            for(this.i = 0; this.i < this.alertText.length; this.i++) {
                for(this.j = 0; this.j < this.alertText[this.i].length; this.j++) { 
                    this.add.text(100+(this.j*15), 300+(this.i*30), this.alertText[this.i][this.j], {color: 'white'});
                    while(this.x < 10000) { //busy-wait
                        this.x++;
                        console.log(this.x);
                    }
                }
            }
        }*/
       
    }

   /* outputChar(i, j) { //i = string number, j = char index of string
        this.charPerStr = this.add.text(100+(i*10), 300+(i*10), text[i][j], {color: 'white'});        
    }*/

}
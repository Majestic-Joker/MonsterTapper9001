class TitleScene extends Phaser.Scene{
    constructor(){
        super("TitleScene");
    }

    preload(){
        //load title image
        this.load.image('bg', './assets/visual/BG.png');
        this.load.image('title', './assets/visual/title.png');

        this.load.audio('enter', './assets/audio/sfx/UI.wav');
    }

    create(){
        //load bg and title
        let bg = this.add.image(225,400, 'bg');
        bg.setScale(.3);
        let title = this.add.image(225,200, 'title');
        title.setScale(.75);

        let text = this.add.text(225, 400, "Click/Tap to Play", {
            fontSize: '36px',
            color: 'black'
        });
        text.setOrigin(0.5, 0.5);
        this.input.on('pointerdown', ()=>{
            this.sound.play('enter', {
                volume: .4
            })
            this.scene.start('MainScene');
        });
        this.tweens.add({
            targets: [text],
            duration: 500,
            alpha: 0,
            yoyo: true,
            repeat: -1
        });
    }
}

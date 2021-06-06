class TitleScene extends Phaser.Scene{
    constructor(){
        super("TitleScene");
    }

    create(){
        let text = this.add.text(225, 400, "Click/Tap to Play", {
            fontSize: '36px'
        });
        text.setOrigin(0.5, 0.5);
        text.setInteractive();
        text.on('pointerdown', ()=>{
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
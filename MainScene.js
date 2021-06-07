class MainScene extends Phaser.Scene {

    // This is where we define data members
    constructor() {
        super("MainScene");
        // Monster variables
        this.monsterImage = null;
        this.hp = 5;
        this.aveHP = 5;
        this.maxHP = null;
        this.hpText = null;
        this.soulsText = null;
        this.stage = 1;
        this.stageCounter = 0;
        this.stageText = null;
        this.stageCT = null;
        // Levels in upgrades
        this.levels = {
            sword: 0,
            thunder: 0,
            fire: 0
        }
        this.swordLT = null;
        this.thunderLT = null;
        this.fireLT = null;
        this.swordCT = null;
        this.thunderCT = null;
        this.fireCT = null;
        // Status of monster
        this.alive = false;
    }

    // Runs before entering the scene, LOAD IMAGES AND SOUND HERE
    preload() {
        //load bg img
        this.load.image('bg1', './assets/visual/BG.png');
        this.load.image('bg2', './assets/visual/floatingIsland.png');
        this.load.image('hpBG', './assets/visual/hpBG.png');
        
        // Loop through monster configuration and load each image
        for (let i = 0; i < MONSTERS.length; i++) {
            this.load.image(MONSTERS[i].name, `./assets/visual/enemies/${MONSTERS[i].image}`);
        }
        for (let j = 0; j < UPGRADE.length; j++){
            this.load.image(UPGRADE[j].name, `./assets/visual/icons/${UPGRADE[j].image}`);
        }

        //this.load.image('thunder', './assets/visual/icons/thunder.png');
        this.load.image('door', './assets/visual/icons/door.png');
        // Load sound effects
        this.load.audio('hit', './assets/audio/sfx/thump.wav');
        this.load.audio('select', './assets/audio/sfx/UI.wav');
        this.load.audio('fail', './assets/audio/sfx/fail.wav');
        this.load.audio('exit', './assets/audio/sfx/exit.wav');
        this.load.audio('bgm', './assets/audio/bgm/BitQuest.mp3');
    }

    // Runs when we first enter this scene
    create() {
        // Load game data
        this.loadGame();
        //set BG
        let bg = this.add.image(225,400, 'bg1');
        bg.setScale(.3);
        let bg2 = this.add.image(300,600, 'bg2');
        bg2.setScale(.75);
        let hpBG = this.add.image(225,705, 'hpBG');
        hpBG.setScale(.25);
        //bgm   
        this.sound.play('bgm', {
            loop: true,
            volume: 0.025
        });
        // Set the starting monster
        let index = Math.floor(Math.random() * MONSTERS.length);
        this.setMonster(MONSTERS[index]);
        // Create hp text
        this.hpText = this.add.text(215, 700, "");
        // Create the souls text
        this.soulsText = this.add.text(50, 100, "Souls: 0", {
            fontSize: '24px',
            color: 'black'
        });
        this.stageText = this.add.text(140, 35, "Stage: 1", {
            fontSize: '36px',
            color: 'black'
        });
        this.stageCT = this.add.text(180, 70, `${10-this.stageCounter} to next stage`, {
            fontSize: '12px',
            color: 'black'
        });

        // Create an upgrade icon for the bolt upgrade
        let sword = this.add.image(400, 50, 'sword');
        sword.setScale(1);
        sword.setInteractive();
        sword.on('pointerdown', () => {
            // If we have enough money
            if (this.souls >= (this.levels.sword*UPGRADE[0].cost)) {
                //play sound
                this.sound.play('select', {
                    volume: .4
                });
                // pay the money
                this.souls -= this.levels.sword * UPGRADE[0].cost;
                // gain a level
                this.levels.sword++;
            }
            else{
                this.sound.play('fail', {
                    volume: .2
                })
            }
        });
        this.swordLT = this.add.text(410, 30, `${this.levels.sword}`, {
            fontSize: '16px',
            color: 'black'
        });
        this.swordCT = this.add.text(370, 70, `Cost:${(this.levels.sword * UPGRADE[0].cost)}`, {
            fontSize: '16px',
            color: 'black'
        })
        let thunder = this.add.image(400, 120, 'thunder');
        thunder.setScale(1);
        thunder.setInteractive();
        thunder.on('pointerdown', () => {
            // If we have enough money
            if (this.souls >= (this.levels.thunder*UPGRADE[1].cost)) {
                //play sound
                this.sound.play('select', {
                    volume: .4
                });
                // pay the money
                this.souls -= this.levels.thunder * UPGRADE[1].cost;
                // gain a level
                this.levels.thunder++;
            }
            else{
                this.sound.play('fail', {
                    volume: .2
                })
            }
        });
        this.thunderLT = this.add.text(410, 90, `${this.levels.thunder}`, {
            fontSize: '16px',
            color: 'black'
        });
        this.thunderCT = this.add.text(370, 140, `Cost:${(this.levels.thunder * UPGRADE[1].cost)}`, {
            fontSize: '16px',
            color: 'black'
        })
        let fire = this.add.image(400, 190, 'fire');
        fire.setScale(1);
        fire.setInteractive();
        fire.on('pointerdown', () => {
            // If we have enough money
            if (this.souls >= (this.levels.fire*UPGRADE[2].cost)) {
                //play sound
                this.sound.play('select', {
                    volume: .4
                });
                // pay the money
                this.souls -= this.levels.fire * UPGRADE[2].cost;
                // gain a level
                this.levels.fire++;
            }
            else{
                this.sound.play('fail', {
                    volume: .2
                })
            }
        });
        this.fireLT = this.add.text(410, 160, `${this.levels.fire}`, {
            fontSize: '16px',
            color: 'black'
        });
        this.fireCT = this.add.text(370, 210, `Cost:${(this.levels.fire * UPGRADE[2].cost)}`, {
            fontSize: '16px',
            color: 'black'
        })
        // Create an interval to use upgrade damage
        setInterval(() => {
            this.damage((this.levels.thunder * UPGRADE[1].damage)+(this.levels.fire*UPGRADE[2].damage));
        }, 1000);

        // Save button
        let door = this.add.image(50, 750, 'door');
        door.setScale(.1);
        door.setInteractive();
        door.on('pointerdown', () => {
            this.sound.play('exit', {
                volume: .2
            });
            this.saveGame();
            this.sound.stopByKey('bgm');
            this.scene.start("TitleScene");
        });

        // Save every 60s
        setInterval(() => {
            this.saveGame();
        }, 60000);
        // Save once on startup, to set the time
        this.saveGame();
    }

    // Runs every frame
    update() {
        if (this.hp > 0) {
            this.hpText.setText(`${this.hp}`);
        } else {
            this.hpText.setText("0");
        }
        this.soulsText.setText(`Souls: ${this.souls}`);
        this.stageText.setText(`Stage: ${this.stage}`);
        this.stageCT.setText(`${10-this.stageCounter} to next stage`);
        
        //set upgrade texts
        this.swordLT.setText(`${this.levels.sword}`);
        this.swordCT.setText(`Cost:${(this.levels.sword*UPGRADE[0].cost)}`);
        this.thunderLT.setText(`${this.levels.thunder}`);
        this.thunderCT.setText(`Cost:${(this.levels.thunder*UPGRADE[1].cost)}`);
        this.fireLT.setText(`${this.levels.fire}`);
        this.fireCT.setText(`Cost:${(this.levels.fire*UPGRADE[2].cost)}`);
    }

    damage(amount) {
        // Lower the hp of the current monster
        this.hp -= amount;
        // Check if monster is dead
        if (this.hp <= 0 && this.alive) {
            console.log("You killed the monster!");
            this.stageCounter++;
            if(this.stageCounter == 10){
                this.stageCounter = 0;
                this.stage++;
            }
            this.souls += (1+Math.floor((this.maxHP*.1)*(this.stage*.1)));
            // Set monster to no longer be alive
            this.alive = false;
            // Play a death animation
            this.tweens.add({
                // List of things to affect
                targets: [this.monsterImage],
                // Duration of animation in ms
                duration: 250,
                // Alpha is transparency, 0 means invisible
                alpha: 0,
                // Scale the image down during animation
                scale: 0.1,
                // Set the angle
                angle: 359,
                // Runs once the death animation is finsihed
                onComplete:
                    () => {
                        // Choose a random new monster to replace the dead one
                        let index = Math.floor(Math.random() * MONSTERS.length);
                        this.setMonster(MONSTERS[index]);
                        // Save game (and soul gained)
                        this.saveGame();
                    }

            });
        }
    }

    loadGame() {
        // Load the soul count from local storage
        let savedSouls = localStorage.getItem('souls');
        let savedStage = localStorage.getItem('stage');
        // Convert string to number
        this.souls = parseInt(savedSouls);
        this.stage = parseInt(savedStage);
        // If soul count could not be loaded, set it to 0
        if (isNaN(this.souls)) {
            this.souls = 0;
        }
        
        if(isNaN(this.stage)){
            this.stage = 1;
        }

        // Account for idle progression based on time last played
        let lastTime = localStorage.getItem('lastPlayed');
        // Convert string to numeric timestamp
        let lastStamp = parseInt(lastTime);
        // If the last time played is a valid number, we will add progress
        if (!isNaN(lastStamp)) {
            // Get the current date-time object (NOW)
            let now = new Date();
            // Get a timestamp (miliseconds since January 1970)
            let nowStamp = now.getTime();
            // Subtract the last played timestamp from the NOW timestamp to
            // get miliseconds since last played
            let ms = nowStamp - lastStamp;
            // Convert to seconds
            let s = ms / 1000;
            //gives souls based on stage and average HP of monsters.
            let soulsGained = Math.floor((s * this.stage)/(this.aveHP*this.stage));
            this.souls += soulsGained;
        }

        // Try to load the levels object
        let json = localStorage.getItem('levels');
        this.levels = JSON.parse(json);
        if (this.levels == null) {
            this.levels = {
                sword: 0,
                thunder: 0,
                fire: 0
            }
        }
    }

    saveGame() {
        // Save last time that the user played
        let date = new Date();
        let numDate = date.getTime();
        localStorage.setItem('lastPlayed', `${numDate}`);
        // Save the number of souls
        localStorage.setItem('souls', `${this.souls}`);
        localStorage.setItem('stage', `${this.stage}`);
        // Save levels object as JSON formatted string
        localStorage.setItem('levels', JSON.stringify(this.levels));
        localStorage.setItem('levelsCost', JSON.stringify(this.levelsCost));
    }

    setMonster(monsterConfig) {
        // Destroy the old monster's game object
        if (this.monsterImage != null) this.monsterImage.destroy();
        // Reset hp of the monster
        this.hp = (monsterConfig.hp * this.stage);
        this.maxHP = this.hp;
        this.alive = true;

        // Create a image of monster at position x:225,y:400
        this.monsterImage = this.add.image(225, 400, monsterConfig.name);
        // Set the size of the monster
        this.monsterImage.setScale(.8);
        // Make the monster clickable
        this.monsterImage.setInteractive();

        // Handler/callback for the 'pointer down' event
        this.monsterImage.on('pointerdown',
            () => {
                // Play a hit sound
                this.sound.play('hit', {
                    volume: 0.05
                });
                this.damage(1+this.levels.sword);
            });
    }
}
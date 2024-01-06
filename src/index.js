import "./assets/img/button.png"
import "./assets/img/bg.png"
import "./assets/img/scene-bg.png"
import "./assets/img/pnj/fin.png"
import "./assets/img/pnj/klok.png"
import quests from "./assets/data/quests.json"

import Phaser from "phaser"

class Example extends Phaser.Scene
{
    hoverButton = 'Hello phaser'
    normalButton = 'Hello trouduc'

    font = 'Arial'


    preload ()
    {
        this.load.image('start_button', 'img/button.png');
        this.load.image('background', 'img/bg.png');
        this.load.image('scene-background', 'img/scene-bg.png');
        this.load.image('pnj/fin', 'img/pnj/fin.png');
        this.load.image('pnj/klok', 'img/pnj/klok.png');

        this.quests = quests
    }

    create ()
    {
        this.cameras.main.setBackgroundColor('#868581')

        this.backgroundImage = this.add.image(0, 0, 'background');
        this.backgroundImage.setScale(4)

        this.sceneBackgroundImage = this.add.image(window.innerWidth / 2, window.innerHeight / 2 - 100, 'scene-background');
        this.sceneBackgroundImage.setScale(1.2)

        this.imagePlaceHolders = {
            left: null,
            right:null
        }

        this.imagePlaceHoldersConfig = {}
        this.imagePlaceHoldersConfig['left'] = new Phaser.Geom.Point(0, window.innerHeight / 2)
        this.imagePlaceHoldersConfig['right'] = new Phaser.Geom.Point(window.innerWidth, window.innerHeight / 2)

        this.pnjImages = {};
        this.pnjImages['fin'] = this.add.image(0, window.innerHeight / 2, 'pnj/fin');
        this.pnjImages['fin'].setVisible(false)
        // this.pnjImages['fin'].setPosition(
        //     this.pnjImages['fin'].getCenter().x + this.pnjImages['fin'].getBounds().width / 2,
        //     this.pnjImages['fin'].getCenter().y
        // )

        this.pnjImages['klok'] = this.add.image(window.innerWidth, window.innerHeight / 2, 'pnj/klok');
        this.pnjImages['klok'].setVisible(false)
        // console.log(this.pnjImages['klok'].getBounds().width)
        // this.pnjImages['klok'].setPosition(
        //     this.pnjImages['klok'].getCenter().x - this.pnjImages['klok'].getBounds().width / 2,
        //     this.pnjImages['klok'].getCenter().y
        // )

        const buttonStart = this.add.image(window.innerWidth / 2, window.innerHeight / 2, 'start_button');
        buttonStart.setInteractive({ useHandCursor: true })
        buttonStart.setPosition(window.innerWidth / 2, window.innerHeight / 2 + window.innerHeight / 4)
        buttonStart.on('pointerdown', e => {
            console.log(e)
            buttonStart.destroy()
            this.loadQuest()
        })

        this.sceneTitle = this.add.text(100, 100, this.normalButton, { fill: '#222', fontSize: 32, fontFamily: 'serif', fontWeight: 500 });
        this.sceneTitle.setPosition(window.innerWidth / 2, window.innerHeight / 4)

        this.sceneDescription = this.add.text(100, 200, this.normalButton, { fill: '#244', fontSize: 24, fontFamily: 'serif', fontWeight: 500 });
        this.sceneDescription.setPosition(window.innerWidth / 2, window.innerHeight / 3)

        this.sceneButtons = []
    }

    loadQuest(id) {
        const quest = this.findQuest(id ?? 0)
        this.quest = quest
        this.loadScene(0)
    }

    loadScene(id) {

        // détruit les boutons de la scène precèdente
        if (this.sceneButtons.length > 0) {
            for (const button of this.sceneButtons) {
                button.destroy()
            }
        }

        const scene = this.findScene(id ?? 0)
        this.sceneTitle.setText(scene.title)
        this.sceneDescription.setText(scene.description)

        this.loadPnjs(scene)
        this.loadButtons(scene)
    }

    loadPnjs(scene) {
        if (scene.pnj) {
            for (const [key, value] of Object.entries(scene.pnj)) {
                this.emptyPnjPlaceholder(key)
                if (value) {
                    this.placeImageInPlaceholder(key, value)
                }
            }
        }
    }

    placeImageInPlaceholder(placeholder, imageName) {
        const img = this.pnjImages[imageName]
        if (img) {
            this.imagePlaceHolders[placeholder] = null

            let offset = 0
            if (placeholder === 'left') {
                offset = img.getBounds().width / 2
            } else {
                offset = -(img.getBounds().width / 2)
            }

            img.setPosition(
                this.imagePlaceHoldersConfig[placeholder].x + offset,
                this.imagePlaceHoldersConfig[placeholder].y
            )
            img.setVisible(true)
            this.imagePlaceHolders[placeholder] = img
        }
    }

    emptyPnjPlaceholder(placeholder) {
        if (this.imagePlaceHolders[placeholder]) {
            this.imagePlaceHolders[placeholder].setVisible(false)
            this.imagePlaceHolders[placeholder] = null
        }
    }

    loadButtons(scene) {
        let buttonCount = 0
        for (const button of scene.buttons) {
            const nextSceneButton = this.add.text(
                window.innerWidth / 2,
                (window.innerHeight / 4 * 3) + (buttonCount * 100),
                button.title,
                { fill: '#0f0', padding: 15, backgroundColor: '#333' }
            );
            nextSceneButton.setInteractive({ useHandCursor: true })
            nextSceneButton.on('pointerdown', () => this.loadScene(button.goTo) )
            this.sceneButtons.push(nextSceneButton)
            buttonCount++
        }
    }

    findScene(id) {
        return this.quest.scenes.filter(el => el.id === id)[0]
    }

    findQuest(id) {
        return this.quests.filter(el => el.id === id)[0]
    }

    resize (gameSize, baseSize, displaySize, resolution)
    {
        const width = gameSize.width;
        const height = gameSize.height;

        this.cameras.resize(width, height);

        // this.bg.setSize(width, height);
        // this.logo.setPosition(width / 2, height / 2);
    }
}

const config = {
    type: Phaser.AUTO,
    width: window.innerWidth,
    height: window.innerHeight,
    scene: Example,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 200 }
        }
    }
};

const game = new Phaser.Game(config);
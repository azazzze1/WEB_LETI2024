export class AudioManager{
    constructor(){
        this.dieZombie = new Audio('../public/audio/zDeath.mp3');
        this.shoot = new Audio('../public/audio/fire.mp3');
        this.gg = new Audio('../public/audio/gameOver.mp3');
    }

    gameOverF(){
        this.gg.play(); 
    }

    dieZombieF(){
        this.dieZombie.play();
    }

    shootF(){
        this.shoot.play();
    }

}
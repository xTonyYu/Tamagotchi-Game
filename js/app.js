console.log('Tamagotchi')

// Specifications:
//   ✔   Create a repo for your Tamagotchi pet
//   ✔   Make a commit after you finish each one of the following (20+)
//   ✔   Create a Class (JS Class, look at your notes if your forget) for your Tamagotchi
//   ✔   Instatiate your Tamagotchi
//   ✔   Display a character of your choice on the screen to represent your pet
//   ✔   Display the following metrics for your pet:
//   ✔   Hunger (1-10 scale)
//   ✔   Sleepiness (1-10 scale)
//   ✔   Boredom (1-10 scale)
//   ✔   Age
//   ✔   Add buttons to the screen to feed your pet, turn off the lights, and play with your pet.
//   ✔   Add the ability to name your pet.
//   ✔   Style the page.
//   ✔   Increase your pet's age every x minutes
//   ✔   Increase your pet's Hunger, Sleepiness, and Bored metrics on an interval of your choosing.
//   ✔   You pet should die if Hunger, Boredom, or Sleepiness hits 10.
//      Morph your pet at certain ages.
//   ✔   Animate your pet across the screen while it's alive.

// ***** Additional Game features not listed in the README so user have to play to figure it out *****
// how much point to reduce for each...
//   ✔   feeding click? -> 10% of 1 pt
//   ✔   playing click? -> 1 pt when hunger level is between 4-7, else 20% of 1 pt
//   ✔   sleeping? -> 1 pt for 10 mins of sleep
// how fast do following increase (during game)?
//   ✔   hunger -> +1 pt per 10 mins when awake; +1 pt per 40 mins when sleeping
//   ✔   boredome -> +1 pt per 10 mins
//   ✔   sleepiness -> +1 pt per 20 mins
//   ✔   age -> +1 per 200 mins 

// ------ Global variables/App state ---------
let time = 0, timer, startSleepTime = 0;
let myPet;  // declared it as global variable so can be used in cosole log
let interval = 0.31; // in seconds; 60 sec means each time unit below is one minute; use 1 to shorten the time period for testing

const feedingPt = 0.1;
const playingPtsOptimal = 1;
const playingPtsWhenUncomfortable = 0.2;
const sleepingPtsPerTimeUnit = 1;
const sleepPtReductionTimeUnit = 10;

const ptsGainPerTimeUnit = +1; 
const ptGainTimeUnit = 10;
const sleepPtGainTimeUnit = 15;
const hungerPtGainDuringSleepTimeUnit = 30;
const ageGainTimeUnit = 10;
let morphTime = ageGainTimeUnit * 1;

// ------ Cached DOM Elements ---------
const logoContainer = document.querySelector('.logo-container')
const inputName = document.querySelector('input')
const startBtn = document.querySelector('.start-btn')
const lightSwitch = $('.light-btn')
const feedBtn = document.getElementById('feed')
const playBtn = document.getElementById('play')
const playGround = $('.playground')
const tama = document.querySelector('.tamagotchi')
const ageStat = document.querySelector('.age')
const hungerStat = document.querySelector('.hungriness')
const boreStat = document.querySelector('.boredom')
const sleepStat = document.querySelector('.sleepiness')
const pet = document.querySelector('.pet')
const baby = document.getElementById('baby')
const tween = document.getElementById('tween')
const teen = document.getElementById('teen')
const adult = document.getElementById('adult')
const endGame = document.getElementById('endGame')
const nameInEndMsg= document.getElementById('name-in-end-msg')

// ------ Classes ---------

class Tamagotchi {
    constructor(name, sleepiness = 5, hunger = 5, boredom = 5,age = 1) {
        this.name = name;
        this.sleepiness = sleepiness;
        this.hunger = hunger;
        this.boredom = boredom;
        this.age = age;
        this.state = 'awake'; // awake, sleep, dead
        this.moves = ['animate__tada', 'animate__bounce', 'animate__wobble', 'animate__rubberBand'];
        this.moveToDoIdx = 0; // index for moves ['animate__tada', 'animate__wobble', 'animate__bounce', 'animate__rubberBand']
    }
    
    appear() {
        resettingGame()
        tama.classList.add('show');
        tama.classList.add('animate__slideInDown')
        // tama.classList.add('animate__tada')
        setTimeout(() => {
            tama.classList.remove('animate__slideInDown')
        }, 550);
    }
    eat(food) {
        if (this.state !== 'awake' || this.hunger <= 1) {
            return;
        }
        this.hunger -= feedingPt;
    }
    play(fun) {
        if (this.state !== 'awake' || this.boredom <= 1) {
            return;
        }
        if (this.hunger >= 4 & this.hunger <= 7) {
            this.boredom -= playingPtsOptimal;
        } else {
            this.boredom -= playingPtsWhenUncomfortable;
        }
    }
    move(time) {
        if (time % 4 === 2 && this.state === 'awake') {
            this.moveToDoIdx >= this.moves.length ? this.moveToDoIdx = this.moveToDoIdx % this.moves.length : this.moveToDoIdx;
            console.log('animating', this.moveToDoIdx)
            tama.classList.add(this.moves[this.moveToDoIdx])
        } else if (tama.classList.contains(this.moves[this.moveToDoIdx])) {
            tama.classList.remove(this.moves[this.moveToDoIdx])
            this.moveToDoIdx++
        }
    }
    sleep(startSleepTime, curTime) { // times are in minutes
        if (this.sleepiness <= 1) {
            return;
        }
        if ((curTime - startSleepTime) % sleepPtReductionTimeUnit === 0) {
            this.sleepiness -= sleepingPtsPerTimeUnit;
        };
    }
    isItStillAlive() {
        let pointLevel = Math.max(this.sleepiness, this.boredom, this.hunger);
        if (pointLevel >= 10) {
            this.state = 'dead'
            clearInterval(timer);
            endingGame()
        }
    }
} 

// ------ Functions ---------
const gotoSleep = function gotoSleepAndLightsOff() {
    playGround.toggleClass("night")
    lightSwitch.toggleClass("light-off")
    playerTakingAction('sleeping')
}

const playerTakingAction = function playerTakingAction(action) {
    if (!myPet) {
        return;
    }

    if (action === 'feeding') {
        myPet.eat();
    } else if (action === 'playing') {
        myPet.play();
    } else if (action === 'sleeping') {
        if (myPet.state === 'awake') {
            myPet.state= 'sleep';
            startSleepTime = time;
        } else if (myPet.state === 'sleep') {
            myPet.state= 'awake';
        }
    }
    updateStats();
}

const updateStats = function updateStats() {
    ageStat.textContent = myPet.age;
    hungerStat.textContent = Math.round(myPet.hunger);
    boreStat.textContent = Math.round(myPet.boredom);
    sleepStat.textContent = Math.round(myPet.sleepiness);
}

const morphing = function morphing(time) {
    let arrMorphTime = [morphTime, morphTime * 2, morphTime * 3];
    let phases = [baby, tween, teen, adult];
    let arrHeight = ['80%', '100%', '150%']
    let index = arrMorphTime.indexOf(time);
    if (index !== -1 && myPet.state !== 'dead') {
        console.log('Morph')
        phases[index].style.opacity = 0;
        phases[index + 1].style.opacity = 1;
        phases[index + 1].style.height = arrHeight[index];
    }
}

const startGame = function startGame() {  // interval in seconds
    let name = inputName.value;
    myPet = new Tamagotchi(name);  // other than name, rest params are using default values
    endGame.style.opacity = 0;
    inputName.disabled = true;
    startBtn.disabled = true;
    logoContainer.insertAdjacentHTML('afterbegin', `<h2 id="name-display">${name.toUpperCase()}</h2>`);
    myPet.appear();
    time = 0;
    timer = setInterval(() => {
        time++;
        console.log('time:', time);
        updateHealth(time, startSleepTime);
        updateStats()
        myPet.isItStillAlive();
        myPet.move(time)
        morphing(time)
    }, 1000 * interval);  // 1 sec interval for testing; 1 min for production
}

const updateHealth = function updatePetHealth(time, startSleepTime) {
    // console.log('time in update func:', time, startSleepTime, time - startSleepTime)
    if (time % ptGainTimeUnit === 0 && myPet.state === 'awake') {
        Math.round(myPet.hunger) < 10 ? myPet.hunger += ptsGainPerTimeUnit : myPet.hunger;
        myPet.boredom < 10 ? myPet.boredom += ptsGainPerTimeUnit : myPet.boredom;
    } else if ((time - startSleepTime) % hungerPtGainDuringSleepTimeUnit === 0 && myPet.state === 'sleep') {
        myPet.hunger < 10 ? myPet.hunger += ptsGainPerTimeUnit : myPet.hunger;
        console.log(myPet.state, 'hunger while sleep:', myPet.hunger)
    }
    if (time % sleepPtGainTimeUnit === 0 && myPet.state === 'awake') { // awake getting tired over time
        myPet.sleepiness < 10 ? myPet.sleepiness += ptsGainPerTimeUnit : myPet.sleepiness;
        console.log(myPet.state, 'sleep level:', myPet.sleepiness)
    } 
    if (myPet.state === 'sleep') {
        myPet.sleep(startSleepTime, time)
    }
    if (time % ageGainTimeUnit === 0 && myPet.state !== 'dead') {
        myPet.age += ptsGainPerTimeUnit;
    }
} 

const resettingGame = function resettingGame() {
    baby.style.opacity = 1;
    tween.style.opacity = 0;
    teen.style.opacity = 0;
    adult.style.opacity = 0;
    tween.style.height = '60%';
    teen.style.height = '60%';
    adult.style.height = '60%';
}

const endingGame = function endingGame() {
    console.log('Game OVER!')
    inputName.value !== '' ? nameInEndMsg.innerText = myPet.name : nameInEndMsg.innerText = 'it';
    endGame.style.opacity = 1;
    logoContainer.firstElementChild.remove()
    adult.style.opacity = 0;
    inputName.disabled = false
    startBtn.disabled = false
}

const keyPressed = function keyPressed(e) {
    if (e.key === 'f') {
        playerTakingAction('feeding')
    } else if (e.key === 'p') {
        playerTakingAction('playing')
    } else if (e.key === 's' || e.key === 'l') {
        gotoSleep()
    } else if (e.key === 'Enter' && !startBtn.disabled) {
        startGame()
    }
}

// ------ Event Listeners ---------
startBtn.addEventListener('click', startGame)
lightSwitch.on('click', gotoSleep)
feedBtn.addEventListener('click', e => playerTakingAction('feeding'))
playBtn.addEventListener('click', e => playerTakingAction('playing'))
window.addEventListener('keyup', keyPressed)

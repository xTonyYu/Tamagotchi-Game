console.log('Tamagotchi')
// $('body').css('color', 'red')

// Specifications:
//   ✔  Create a repo for your Tamagotchi pet
//      make a commit after you finish each one of the following (20+)
//   ✔  Create a Class (JS Class, look at your notes if your forget) for your Tamagotchi
//   ✔   Instatiate your Tamagotchi
//   ✔   Display a character of your choice on the screen to represent your pet
//   ✔   Display the following metrics for your pet:
//   ✔   Hunger (1-10 scale)
//   ✔   Sleepiness (1-10 scale)
//   ✔   Boredom (1-10 scale)
//   ✔   Age
//   ✔   Add buttons to the screen to feed your pet, turn off the lights, and play with your pet.
//   ✔   Add the ability to name your pet.
//      Style the page.
//   ✔   Increase your pet's age every x minutes
//   ✔   Increase your pet's Hunger, Sleepiness, and Bored metrics on an interval of your choosing.
//   ✔   You pet should die if Hunger, Boredom, or Sleepiness hits 10.
//      Morph your pet at certain ages.
//      Animate your pet across the screen while it's alive.

// ***** Additional Game features not listed in the README so user have to play to figure it out *****
// how much point to reduce for each...
//   ✔   feeding click? -> 10% of 1 pt
//   ✔   playing click? -> 1 pt when hunger level is between 4-7, else 20% of 1 pt
//   ✔   sleeping? -> 1 pt for 10 mins of sleep
// how fast do following increase (during game)?
//      hunger -> +1 pt per 10 mins when awake; +1 pt per 40 mins when sleeping
//      boredome -> +1 pt per 10 mins
//      sleepiness -> +1 pt per 20 mins
//      age -> +1 per 200 mins 

// ------ Global variables/App state ---------
let time = 0, startSleepTime = 0;
let myPet;
let interval = 0.31; // in seconds; 60 sec means each time unit below is one minute; use 1 to shorten the time period for testing

const feedingPt = 0.1;
const playingPtsOptimal = 1;
const playingPtsWhenUncomfortable = 0.2;
const sleepingPtsPerTimeUnit = 1;
const sleepPtReductionTimeUnit = 10;

const ptsGainPerTimeUnit = +1; 
const ptGainTimeUnit = 10;
const sleepPtGainTimeUnit = 20;
const hungerPtGainDuringSleepTimeUnit = 40;
const ageGainTimeUnit = 10 * sleepPtGainTimeUnit; // 10x of sleep time unit (200 mins in this case)

// ------ Cached DOM Elements ---------
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

// ------ Classes ---------

class Tamagotchi {
    constructor(name, sleepiness = 5, hunger = 5, boredom = 5,age = 1) {
        this.name = name;
        this.sleepiness = sleepiness;
        this.hunger = hunger;
        this.boredom = boredom;
        this.age = age;
        this.state = 'awake'; // awake, sleep, dead
        this.move = 0; // index for moves ['animate__tada', 'animate__wobble', 'animate__bounce', 'animate__rubberBand']
    }
    
    appear() {
        tama.classList.add('show');
        tama.classList.add('animate__slideInDown')
        // tama.classList.add('animate__tada')
        setTimeout(() => {
            tama.classList.remove('animate__slideInDown')
        }, 550);
    }
    eat(food) {
        if (this.state === 'sleep' || this.hunger <= 1) {
            return;
        }
        this.hunger -= feedingPt;
    }
    play(fun) {
        if (this.state === 'sleep' || this.boredom <= 1) {
            return;
        }
        if (this.hunger >= 4 & this.hunger <= 7) {
            this.boredom -= playingPtsOptimal;
        } else {
            this.boredom -= playingPtsWhenUncomfortable;
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
            console.log('dead')
            alert(`Game over! ${myPet.name} is DEAD... YOU KILLED it!!!`)
            inputName.disabled = false
            startBtn.disabled = false
        }
    }
} 

// ------ Functions ---------
const gotoSleep = function gotoSleepAndLightsOff() {
    playGround.toggleClass("night")
    lightSwitch.toggleClass("light-off")
    if (!myPet) {
        return;
    }
    if (myPet.state === 'awake') {
        myPet.state= 'sleep';
        startSleepTime = time;
    } else if (myPet.state === 'sleep') {
        myPet.state= 'awake';
    }
}

const playerTakingAction = function playerTakingAction(action) {
    if (!myPet) {
        return;
    }
    if (action === 'feeding') {
        myPet.eat();
    } else if (action === 'playing') {
        myPet.play();
    }
    updateStats();
}

const updateStats = function updateStats() {
    ageStat.textContent = myPet.age;
    hungerStat.textContent = Math.round(myPet.hunger);
    boreStat.textContent = Math.round(myPet.boredom);
    sleepStat.textContent = Math.round(myPet.sleepiness);
}

const animating = function animating(time) {
    // tama.classList.remove('animate__slideInDown')
    // tama.classList.remove('animate__tada')
    let animate = ['animate__tada', 'animate__bounce', 'animate__wobble', 'animate__rubberBand']
    if (!myPet) {
        return;
    }
    if (time % 4 === 2 && myPet.state === 'awake') {
        myPet.move >= animate.length ? myPet.move = myPet.move % animate.length : myPet.move;
        console.log('animating', myPet.move)
        tama.classList.add(animate[myPet.move])
    } else if (tama.classList.contains(animate[myPet.move])) {
        tama.classList.remove(animate[myPet.move])
        myPet.move++
        // console.log('myPet.move', myPet.move)
    }
}

const morphing = function morphing(time) {
    if (!myPet) {
        return;
    }
    if (time % 8 === 0 && myPet.state !== 'dead') {
        
    }

const startGame = function startGame() {  // interval in seconds
    let name = inputName.value;
    myPet = new Tamagotchi(name);  // other than name, rest params are using default values
    inputName.disabled = true;
    startBtn.disabled = true;
    myPet.appear();
    // sleep button triggers setting the startSleepTime = time
    // console.log('time before timer:', time)
    const timer = setInterval(() => {
        time++;
        console.log('time:', time);
        // console.log('startSleepTime BEFORE update', startSleepTime);
        updateHealth(time, startSleepTime);
        updateStats()
        myPet.isItStillAlive();
        animating(time)
        if (myPet.state === 'dead') {
            clearInterval(timer);
            console.log('Game OVER!')
            inputName.disabled = false
            startBtn.disabled = false
        }
    }, 1000 * interval);  // 1 sec interval for testing; 1 min for production
}

const updateHealth = function updatePetHealth(time, startSleepTime) {
    // console.log('time in update func:', time, startSleepTime, time - startSleepTime)
    if (time % ptGainTimeUnit === 0 && myPet.state === 'awake') {
        myPet.hunger < 10 ? myPet.hunger += ptsGainPerTimeUnit : myPet.hunger;
        myPet.boredom < 10 ? myPet.boredom += ptsGainPerTimeUnit : myPet.boredom;
        console.log(myPet.state, 'hunger:', myPet.hunger,'boredom', myPet.boredom)
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
        console.log(myPet.state, 'age:', myPet.age)
    }
} 

// ------ Event Listeners ---------
startBtn.addEventListener('click', startGame)
lightSwitch.on('click', gotoSleep)
feedBtn.addEventListener('click', e => playerTakingAction('feeding'))
playBtn.addEventListener('click', e => playerTakingAction('playing'))

// ------ Test ---------

// startGame('baby Vader', 1)

const tempFunc = function tempFunc(e) {
    console.log(name)
    // console.log(e)
    // console.log(this)
}
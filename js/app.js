console.log('Tomagotchi')
// $('body').css('color', 'red')


// ------ Additional Game features not listed in the README so user have to play to figure it out ---------
// how much point to reduce for each...
//      feeding click? -> 10% of 1 pt
//      playing click? -> 1 pt when hunger level is between 4-8, else 20% of 1 pt
//      sleeping? -> 1 pt for 10 mins of sleep
// how fast do following increase?
//      hunger -> +1 pt per 10 mins when awake; +0.25 pt for each sleepiness pt decrease
//      boredome -> +1 pt per 10 mins
//      sleepiness -> +1 pt per 20 mins
//      age -> +1 per 200 mins 

// ------ Global variables ---------
const dateTime = new Date();
console.log(dateTime);
// console.log(dateTime.toString().slice(0, 25));
const feedingPt = -0.1;
const playingPtsOptimal = -1;
const playingPtsWhenUncomfortable = -0.2;
const sleepingPtsPerTimeUnit = -1;
const sleepPtReductionTimeUnit = 10;  // 10 mins
const ptsGainPerTimeUnit = +1; 
const ptGainTimeUnit = 10;  // 10 mins
const sleepPtGainTimeUnit = 20;  // 20 mins
const ageGainTimeUnit = 10 * sleepPtGainTimeUnit; // 10x of sleep time unit (200 mins in this case)

// ------ App state ---------
// ------ Cached DOM Elements ---------
// ------ Event Listeners ---------
// ------ Classes ---------

class Tomagotchi {
    constructor(sleepiness = 5, hunger = 5, boredom = 5,age = 1) {
        this.sleepiness = sleepiness;
        this.hunger = hunger;
        this.boredom = boredom;
        this.age = age;
    }
    
    eat(food) {
        this.hunger -= food/10;
    }
    play(fun) {
        this.boredom -+ fun;
    }
    sleep(mins) {
        this.sleepiness
    }
} 

// ------ Functions ---------

// ------ Game run ---------
const newPet = new Tomagotchi();  // using default values
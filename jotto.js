'use strict';


var DEFAULT_LETTER_COUNT=5;
var MAX_LETTER_COUNT=10;
var MIN_LETTER_COUNT=3;

class Jotto {
    
    constructor(dictionary) {
        this.dictionary=dictionary;
        this.isActive=false;
    }
    
    newGame(letterCount) {
        
        this.letterCount=letterCount;
        
        this.hiddenWord = this.pickRandomWord()
        this.numGuessesSoFar=0;
        
        this.isActive=true;
    }
    
    resumeGame(hiddenWord, numGuessesSoFar) {
        
        var letterCount=hiddenWord.length;
        
        this.hiddenWord=hiddenWord;
        this.letterCount=letterCount;
        
        if( isNaN(numGuessesSoFar) || numGuessesSoFar < 0 ) {
            numGuessesSoFar=0;
        }
        this.numGuessesSoFar=numGuessesSoFar;
        
        this.isActive=true;
        
    }
    
    set letterCount(value){
        if( isNaN(value) ) {
            value=DEFAULT_LETTER_COUNT;
        }
        
        if ( letterCount > MAX_LETTER_COUNT || letterCount < MIN_LETTER_COUNT ) {
            throw new InvalidLetterCount(letterCount);
        }
        
        this._letterCount=value;
    }
    
    get letterCount() {
        return this._letterCount;
    }
    
    
    takeGuess( guessWord ) {
        
        if( ! this.isActive ) {
            throw GameNotActive();
        }
        
        this.checkWordValid(guessWord);
        
        if( guessWord == this.validWord) {
            this.isActive=false;
            
            return {
                "gameOver" : true
                "victory" : true,
                "hiddenWord" : this.hiddenWord,
                "numGuesses" : this.numGuessesSoFar
            }
        }
        
        this.numGuessesSoFar+=1;
        letterOverlap=countLetterOverlap(guessWord);
        
        return {
                "gameOver" : false
                "victory" : false,
                "letterOverlap" : letterOverlap,
                "numGuesses" : this.numGuessesSoFar
            };
        
        
    }
    
    giveUp() {
        if( ! this.isActive ) {
            throw GameNotActive();
        }
    
        this.isActive=false;
        
        return {
            "gameOver" : true,
            "victory" : false,
            "hiddenWord" : this.hiddenWord,
            "numGuesses" : this.numGuessesSoFar 
        };
    }
    
    
    countLetterOverlap(guessWord) {
        
        let guessHash=hashifyWord(guessWord);
        let hiddenHash=hashifyWord(this.hiddenWord);
        
        let count=0;
        
        for( var key in guessHash ) {
            if( guessHash.hasOwnProperty(key) && hiddenHash.hasOwnProperty(key)) {
                count+=Math.min(guessHash[key], hiddenHash[key])
            }
        }
        
        return count;
    }
    
    hashifyWord(word) {
       let guessHash={};
        
        for ( var i = 0; i < guessWord.length; i++) {
            let l = guessWord.charAt(i)
            if ( guessHash.hasOwnProperty(l) ) {
                guessHash[l]++;
            }else{
                guessHash[l]=1;
            }
        } 
        
        return guessHash;
    }
    
    
    checkWordValid(word) {
        
        if( word.length !== this.letterCount ) {
            throw new InvalidGuessLength(word, this.letterCount);
        }
        
        if ( !this.dictionary[this.letterCount].hasOwnProperty(word) ) {
            throw new GuessNotInDictionary(word);
        }
    }
    
    
    pickRandomWord() {
        let wordList = this.dictionary[this.letterCount]
        let randomIndex=Math.floor(Math.random()*wordList.length)
        
        return wordList[randomIndex];
        
    }
    
    getState() {
    
        if( ! this.isActive ) {
            throw GameNotActive();
        }
        
        return {"hiddenWord":this.hiddenWord, "numGuessesSoFar":this.numGuessesSoFar}
        
    }
    
    
    class InvalidLetterCount extends Error {
        constructor( letterCount ) {
            super(letterCount + " is not valid. Please pick a number between " + MIN_LETTER_COUNT + " and " + MAX_LETTER_COUNT )
        }
    }
    class GuessNotInDictionary extends Error {
        constructor( word ) {
            super("I heard " + word + ", but it's not in the dictionary" )
        }
    }
    class InvalidGuessLength extends Error {
        constructor( word, letterCount ) {
            super("I heard " + word + ", but it's not " + letterCount + " letters" )
        }
    }
    class GameNotActive extends Error {
        constructor( ) {
            super("You are not currently in a game" )
        }
    }
    
}


module.exports.Jotto = Jotto;

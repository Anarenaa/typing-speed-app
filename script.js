const placeholder = document.getElementById('placeholder');
const textarea = document.getElementById('textarea');
const numberCharacters= document.querySelector('.characters');
const toggleButton = document.querySelector('#language-toggle');

const API_URL = "https://api.quotable.io/random";

//timer
const timerElement = document.querySelector('.timer');
let timer;
let startTime;
let running = false;

function startTimer() {
    startTime = new Date();
    running = true;
    timer = setInterval(() => {
        const elapsedTime = new Date(new Date() - startTime);
        const minutes = String(elapsedTime.getUTCMinutes()).padStart(1, '0');
        const seconds = String(elapsedTime.getUTCSeconds()).padStart(2, '0');
        timerElement.innerText = `${minutes}:${seconds}`;
    }, 1000);
};

function stopTimer() {
    clearInterval(timer);
    running = false;
}

function resetTimer() {
    stopTimer();
    timerElement.innerHTML = '0:00';
}

function setActiveCharacter(index) {
    const textArray = placeholder.querySelectorAll('span');
    textArray.forEach((character, idx) => {
        character.classList.toggle('active', idx === index);
    });
}

textarea.addEventListener('input', () => {
    if (!running) {
        startTimer();
    };

    const textArray = placeholder.querySelectorAll('span');
    const inputArray = textarea.value.split('');

    textArray.forEach( (character, index) => {
        const element = inputArray[index];
        if(element == character.innerText) {
            character.classList.add('correct');
            character.classList.remove('incorrect');
        } else if(element == null) {
            character.classList.remove('correct');
            character.classList.remove('incorrect');
        } else {
            character.classList.add('incorrect');
            character.classList.remove('correct');
        }
    })
    
    setActiveCharacter(inputArray.length);

    if (inputArray.length >= textArray.length) {
        stopTimer();
    } 
});



async function getRandomQuote() {
    try {
        const response = await fetch(API_URL);
        const data = await response.json();
        const textQuote = data.content;
        return textQuote;
        
    } catch (error) {
        console.error('Error fetching quote:', error);
    }
}
    
async function getRandomQuoteUA() {
    try {
        const originalQuote = await getRandomQuote();
        const API_TRANSLATE_URL = `https://api.mymemory.translated.net/get?q=${originalQuote}&langpair=en|uk&de=mika.akima.22@gmail.com`;
        const response = await fetch(API_TRANSLATE_URL);
        const data = await response.json();
        return data.responseData.translatedText;
        
    } catch (error) {
        console.error('Error fetching quote:', error);
    }
}

async function renderNewQuote() {

    placeholder.innerHTML = '';
    textarea.value = '';
    resetTimer();

    let quote;
    if (toggleButton.checked) {
        quote = await getRandomQuoteUA();
    } else {
        quote = await getRandomQuote();
    }

    quote.split('').forEach(element => {
        const character = document.createElement('span');
        character.innerText = element;
        placeholder.appendChild(character);
    });
    numberCharacters.innerText = `${quote.length} symbols`;
    setActiveCharacter(0);
    localStorage.setItem('quote', quote);
    localStorage.setItem('toggleState', toggleButton.checked);
    textarea.focus();
}

function resetClasses() {
    const textArray = placeholder.querySelectorAll('span');
    textArray.forEach(character => {
        character.classList.remove('correct', 'incorrect');
    });
}

toggleButton.addEventListener('change', () => {
    localStorage.setItem('languageToggle', toggleButton.checked);
    renderNewQuote();
});
document.addEventListener('DOMContentLoaded', () => {
    const savedLanguage = localStorage.getItem('languageToggle');
    if (savedLanguage !== null) {
        toggleButton.checked = JSON.parse(savedLanguage);
    }
    renderNewQuote();
});

document.querySelector('.new').addEventListener('click', 
renderNewQuote);
document.body.addEventListener('keydown', (e) => {
    if (e.key === 'Enter'){
        e.preventDefault();
        renderNewQuote();
    }
})

document.querySelector('.restart').addEventListener('click', ()=> {
    textarea.value = '';
    resetClasses();
    resetTimer();
    setActiveCharacter(0);
    textarea.focus();
});
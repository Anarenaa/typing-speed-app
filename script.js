const placeholder = document.getElementById('placeholder');
const textarea = document.getElementById('textarea');
const numberCharacters= document.querySelector('.characters');

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

async function renderNewQuote() {
    const quote = await getRandomQuote();
    placeholder.innerHTML = '';
    textarea.value = '';
    quote.split('').forEach(element => {
        const character = document.createElement('span');
        character.innerText = element;
        placeholder.appendChild(character);
    });
    resetTimer();
    setActiveCharacter(0);
    numberCharacters.innerText = `${quote.length} symbols`;
    localStorage.setItem('quote', quote)
}

function resetClasses() {
    const textArray = placeholder.querySelectorAll('span');
    textArray.forEach(character => {
        character.classList.remove('correct', 'incorrect');
    });
}

renderNewQuote();
document.querySelector('.new').addEventListener('click', 
renderNewQuote);
document.body.addEventListener('keydown', (e) => {
    if (e.key === 'Enter'){
        renderNewQuote();
    }
})

document.querySelector('.restart').addEventListener('click', ()=> {
    textarea.value = '';
    resetClasses();
    resetTimer();
    textarea.focus();
    setActiveCharacter(0);
});


//const request = `Create an article in 10 words`;

//const API_KEY = "";

/*const textGeneration = async() => {
    const API_URL = "https://api.openai.com/v1/completions";

    const requestOptions = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${API_KEY}`,
        },
        body: JSON.stringify({
            "model": "text-ada-001",
            "prompt": request,
            "max_tokens": 2048,
            "temperature": 0.2,
        })
    }

    try {
        const response = await fetch(API_URL, requestOptions);
        const data = await response.json();
        console.log(data);
        const generatedText = data.choices[0].text.trim();

        // Clear existing content
        placeholder.innerHTML = '';

        // Wrap each character in a span
        generatedText.split("").forEach(char => {
            let span = document.createElement('span');
            span.textContent = char;
        });

        placeholder.textContent = generatedText;
    } catch (error) {
        console.log(error);
    }
}
const buttonNewText = document.querySelector('.new');
buttonNewText.addEventListener('click', textGeneration);*/ 


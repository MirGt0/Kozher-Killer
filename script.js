// لیستی شوێنەکانی یارییەکە (دەتوانیت شوێنی تری بۆ زیاد بکەیت)
const locations = [
    "فڕۆکەخانە", "نەخۆشخانە", "بانک", "قوتابخانە", "سینەما", 
    "چێشتخانە", "هۆتێل", "کەنار دەریا", "وێستگەی شەمەندەفەر", 
    "مۆزەخانە", "سەربازگە", "سۆپەرمارکێت", "پۆلیسخانە", "پارک"
];

let players = [];
let currentPlayerIndex = 0;
let gameTimer = null;

// توخمەکانی ناو وێبسایتەکە (DOM Elements)
const setupScreen = document.getElementById('setup-screen');
const roleScreen = document.getElementById('role-screen');
const gameScreen = document.getElementById('game-screen');

const startBtn = document.getElementById('start-btn');
const nextBtn = document.getElementById('next-btn');
const resetBtn = document.getElementById('reset-btn');

const card = document.getElementById('card');
const roleText = document.getElementById('role-text');
const playerNumber = document.getElementById('player-number');
const timerDisplay = document.getElementById('timer');
const locationsList = document.getElementById('locations-list');

// ١. دەستپێکردنی یاری و دابەشکردنی ڕۆڵەکان
startBtn.addEventListener('click', () => {
    const playerCount = parseInt(document.getElementById('player-count').value);
    const killerCount = parseInt(document.getElementById('killer-count').value);

    if (killerCount >= playerCount) {
        alert("نابێت ژمارەی کوژەرەکان یەکسان یان زیاتر بێت لە ژمارەی یاریزانان!");
        return;
    }

    // هەڵبژاردنی یەک شوێن بە هەڕەمەکی
    const chosenLocation = locations[Math.floor(Math.random() * locations.length)];
    
    // دروستکردنی لیستی یاریزانەکان (سەرەتا هەموو هاووڵاتین)
    players = new Array(playerCount).fill(chosenLocation);

    // دیاریکردنی کوژەرەکان (Kozher) بە شێوەی تیروپشک
    let killersAssigned = 0;
    while (killersAssigned < killerCount) {
        const randomIndex = Math.floor(Math.random() * playerCount);
        if (players[randomIndex] !== "تۆ کوژەریت! (Kozher)") {
            players[randomIndex] = "تۆ کوژەریت! (Kozher)";
            killersAssigned++;
        }
    }

    // چوون بۆ شاشەی پیشاندانی ڕۆڵەکان
    currentPlayerIndex = 0;
    setupScreen.classList.add('hidden');
    roleScreen.classList.remove('hidden');
    showPlayerSetup();
});

// ٢. ئامادەکردنی کارتی یاریزانەکە
function showPlayerSetup() {
    card.classList.remove('flipped');
    playerNumber.textContent = `یاریزانی ${currentPlayerIndex + 1}`;
    roleText.textContent = players[currentPlayerIndex];
    nextBtn.classList.add('hidden');
}

// ٣. وەرگێڕانی کارتەکە کاتێک کلیکی لێ دەکرێت
card.addEventListener('click', () => {
    if (!card.classList.contains('flipped')) {
        card.classList.add('flipped');
        nextBtn.classList.remove('hidden');
        
        // ئەگەر کۆتا یاریزان بوو، دەقی دوگمەکە بگۆڕە بۆ دەستپێکردنی کاتژمێر
        if (currentPlayerIndex === players.length - 1) {
            nextBtn.textContent = "چوون بۆ ناو یاری";
        } else {
            nextBtn.textContent = "یاریزانی داهاتوو";
        }
    }
});

// ٤. کلیک لەسەر دوگمەی یاریزانی داهاتوو
nextBtn.addEventListener('click', () => {
    if (currentPlayerIndex < players.length - 1) {
        currentPlayerIndex++;
        showPlayerSetup();
    } else {
        // ئەگەر هەمووان کارتی خۆیان بینی، یارییەکە دەست پێ دەکات
        startMainGame();
    }
});

// ٥. دەستپێکردنی شاشەی سەرەکی یاری و کاتژمێر
function startMainGame() {
    roleScreen.classList.add('hidden');
    gameScreen.classList.remove('hidden');

    // پیشاندانی لیستی شوێنەکان لەسەر شاشە
    locationsList.innerHTML = '';
    locations.forEach(loc => {
        const div = document.createElement('div');
        div.className = 'location-item';
        div.textContent = loc;
        locationsList.appendChild(div);
    });

    // ڕێکخستنی کاتژمێر
    const gameTimeMinutes = parseInt(document.getElementById('game-time').value);
    let timeRemaining = gameTimeMinutes * 60;

    clearInterval(gameTimer);
    gameTimer = setInterval(() => {
        const minutes = Math.floor(timeRemaining / 60);
        const seconds = timeRemaining % 60;
        
        timerDisplay.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

        if (timeRemaining <= 0) {
            clearInterval(gameTimer);
            timerDisplay.textContent = "کاتی یاری تەواو بوو!";
            alert("کاتی یارییەکە تەواو بوو! کێ کوژەرەکەیە؟");
        }
        timeRemaining--;
    }, 1000);
}

// ٦. کۆتایی هێنان و گەڕانەوە بۆ سەرەتا
resetBtn.addEventListener('click', () => {
    clearInterval(gameTimer);
    gameScreen.classList.add('hidden');
    setupScreen.classList.remove('hidden');
});
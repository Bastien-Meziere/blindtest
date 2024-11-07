// Liste des musiques (à remplir avec les noms de fichiers dans votre dossier /music)
const musicList = [
    { file: '22.mp3', artiste: 'Nekfeu', chanson: '22', image: '22.jpg' },
    { file: 'outro.mp3', artiste: 'M83', chanson: 'Outro', image: 'outro.jpg' },
    { file: 'lady.mp3', artiste: 'Modjo', chanson: 'Lady', image: 'lady.jpg' },
    { file: 'stardust.mp3', artiste: 'Stardust', chanson: 'Music sounds better with you', image: 'stardust.jpg' },
    // Ajoutez d'autres musiques ici
];

let audio;
let progressInterval;
let currentSongIndex = -1;
const accueilDiv = document.getElementById('accueil');
const jeuDiv = document.getElementById('jeu');
const countdownDiv = document.getElementById('countdown');
const timerSpan = document.getElementById('timer');
const barreProgression = document.getElementById('barreProgression');
const indiceDiv = document.getElementById('indice');
const reponseForm = document.getElementById('reponseForm');
const reponseInput = document.getElementById('reponse');
const artisteInput = document.getElementById('artisteInput');
const chansonInput = document.getElementById('chansonInput');
const resultatDiv = document.getElementById('resultat');
const btnJouer = document.getElementById('btnJouer');
const btnSuivant = document.getElementById('btnSuivant');
let currentSong;

function lancement() {
    accueilDiv.style.display = 'none';
    countdownDiv.style.display = 'block';
    startCountdown();
}

function startCountdown() {
    let countdown = 5;
    const countdownInterval = setInterval(() => {
        timerSpan.textContent = countdown;
        countdown--;
        if (countdown < 0) {
            clearInterval(countdownInterval);
            countdownDiv.style.display = 'none';
            startGame();
        }
    }, 1000);
}

function startGame() {
    jeuDiv.style.display = 'block';
    playNextSong();
}

function playNextSong() {
    currentSongIndex = Math.floor(Math.random() * musicList.length);
    currentSong = musicList[currentSongIndex];
   
    if (audio) {
        audio.pause();
    }
   
    audio = new Audio(`/music/${currentSong.file}`);
    audio.play();
   
    resetGameState();
    startProgressBar();
    setupAnswerCheck();
}

function resetGameState() {
    indiceDiv.innerHTML = '?';
    reponseInput.value = '';
    artisteInput.value = '';
    chansonInput.value = '';
    reponseInput.disabled = false;
    reponseInput.style.display = 'block';
    resultatDiv.textContent = '';
    btnSuivant.style.display = 'none';
    btnSuivant.style.marginTop = '40px';
    barreProgression.style.width = '100%';
    reponseInput.style.backgroundColor = '';
    artisteInput.style.backgroundColor = '';
    chansonInput.style.backgroundColor = '';
}

function startProgressBar() {
    let width = 100;
    clearInterval(progressInterval);
    progressInterval = setInterval(() => {
        width -= 1/2; // 20 secondes
        barreProgression.style.width = width + '%';
        if (width <= 0) {
            clearInterval(progressInterval);
            revealAnswer();
        }
    }, 100);
}

function setupAnswerCheck() {
    reponseForm.onsubmit = (e) => {
        e.preventDefault();
        checkAnswer();
    };
    reponseInput.oninput = checkAnswer;
}

function checkAnswer() {
    const reponse = reponseInput.value.toLowerCase();
    const artisteCorrect = currentSong.artiste.toLowerCase();
    const chansonCorrect = currentSong.chanson.toLowerCase();
    
    if (reponse === artisteCorrect) {
        artisteInput.value = currentSong.artiste;
        artisteInput.style.backgroundColor = 'lightgreen';
        reponseInput.value = '';
    }
    if (reponse === chansonCorrect) {
        chansonInput.value = currentSong.chanson;
        chansonInput.style.backgroundColor = 'lightgreen';
        reponseInput.value = '';
    }
    if (artisteInput.value && chansonInput.value) {
        revealAnswer(true);
    }
}

function revealAnswer(correct = false) {
    clearInterval(progressInterval);
    
    if (correct) {
        resultatDiv.textContent = 'Bonne réponse !';
    } else {
        resultatDiv.textContent = 'Temps écoulé ! Voici la bonne réponse :';
        
        // Mettre en rouge les champs non trouvés
        if (artisteInput.value !== currentSong.artiste) {
            artisteInput.style.backgroundColor = '#ef233c';
        }
        if (chansonInput.value !== currentSong.chanson) {
            chansonInput.style.backgroundColor = '#ef233c';
        }
    }
    
    // Remplir les champs avec les bonnes réponses
    artisteInput.value = currentSong.artiste;
    chansonInput.value = currentSong.chanson;
    
    // Afficher l'image de la chanson
    indiceDiv.innerHTML = `<img src="/img/${currentSong.image}" alt="Image de la chanson" style="max-width: 200px;">`;
    
    // Cacher l'input de réponse
    reponseInput.style.display = 'none';
    
    btnSuivant.style.display = 'block';
}

btnJouer.addEventListener('click', lancement);
btnSuivant.addEventListener('click', playNextSong);

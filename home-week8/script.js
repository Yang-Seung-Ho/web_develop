const quotes = [
    '동해 물과 백두산이 마르고 닳도록',
    '하느님이 보우하사 우리나라 만세',
    '무궁화 삼천리 화려 강산',
    '대한 사람 대한으로 길이 보전하세',
    '남산 위에 저 소나무 철갑을 두른 듯',
];
let words = [];
let wordIndex = 0;
let startTime = Date.now();
let scores = JSON.parse(localStorage.getItem('scores')) || []; // 기존 기록 불러오기
let gameActive = false; // 게임 활성화 상태를 추적

const quoteElement = document.getElementById('quote');
const messageElement = document.getElementById('message');
const typedValueElement = document.getElementById('typed-value');
const startButton = document.getElementById('start');
const modal = document.getElementById('modal');
const modalMessage = document.getElementById('modal-message');
const closeModal = document.getElementsByClassName('close')[0];

// 게임 초기화
function initializeGame() {
    if (!gameActive) {
        gameActive = true;
        startButton.id = "start";
        startButton.innerText = '시작하기';
        const quoteIndex = Math.floor(Math.random() * quotes.length);
        const quote = quotes[quoteIndex];
        words = quote.split(' ');
        wordIndex = 0;
        const spanWords = words.map(word => `<span>${word} </span>`);
        quoteElement.innerHTML = spanWords.join('');
        quoteElement.childNodes[0].className = 'highlight';
        messageElement.innerText = '';
        typedValueElement.value = '';
        typedValueElement.focus();
        startTime = new Date().getTime();
        typedValueElement.disabled = false;
        typedValueElement.classList = '';
        startButton.disabled = true; // 버튼 비활성화
        attachInputListener(); // 입력 리스너 재활성화
    }
}
// 게임 완료 처리
function finishGame(elapsedTime) {
    gameActive = false;
    startButton.id = 'restart';
    startButton.innerText = '재시작';
    typedValueElement.disabled = true; // 입력 필드 비활성화
    typedValueElement.classList = '';
    startButton.disabled = false; // 시작 버튼 다시 활성화
    detachInputListener(); // 입력 리스너 비활성화
    
    // 새로운 기록 추가 후 저장
    scores.push(elapsedTime);
    localStorage.setItem('scores', JSON.stringify(scores));

    // 상위 5개 기록 가져오기
    const topScores = getTopScores();

    showModal(`완료 시간: ${(elapsedTime / 1000).toFixed(2)}초\n상위 5 기록:\n${topScores}`);
}

// 상위 기록 정렬 및 가져오기
function getTopScores() {
    // 시간 기록을 오름차순으로 정렬 후 상위 5개만 가져옴
    const sortedScores = scores.sort((a, b) => a - b).slice(0, 5);
    
    return sortedScores.map((time, index) => {
        // 1등일 경우 앞에 ★을 붙임
        if (index === 0) {
            return `★ ${index + 1}등: ${(time / 1000).toFixed(2)}초`;
        } else {
            return `${index + 1}등: ${(time / 1000).toFixed(2)}초`;
        }
    }).join('\n');
}

// 모달창 열기
function showModal(message) {
    modalMessage.innerText = message;
    modal.style.display = 'block';
}

// 모달창 닫기
closeModal.onclick = function() {
    modal.style.display = 'none';
}

// 화면 바깥 클릭 시 모달창 닫기
window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = 'none';
    }
}

// 입력 리스너 추가
function attachInputListener() {
    typedValueElement.addEventListener('input', handleInput);
}

// 입력 리스너 제거
function detachInputListener() {
    typedValueElement.removeEventListener('input', handleInput);
}

// 입력 이벤트 핸들러
function handleInput() {
    const currentWord = words[wordIndex];
    const typedValue = typedValueElement.value;

    if (typedValue === currentWord && wordIndex === words.length - 1) {
        const elapsedTime = new Date().getTime() - startTime;
        finishGame(elapsedTime);        
    } else if (typedValue.endsWith(' ') && typedValue.trim() === currentWord) {
        typedValueElement.value = '';
        wordIndex++;
        for (const wordElement of quoteElement.childNodes) {
            wordElement.className = '';
        }
        quoteElement.childNodes[wordIndex].className = 'highlight';
    } else if (currentWord.startsWith(typedValue)) {
        typedValueElement.className = '';
    } else {
        typedValueElement.className = 'error';
    }
}

// 시작 버튼 클릭 이벤트
startButton.addEventListener('click', initializeGame);
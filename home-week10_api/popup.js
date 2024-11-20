let score = 0;

document.addEventListener("DOMContentLoaded", () => {
  const questionEl = document.getElementById("question");
  const answersEl = document.getElementById("answers");
  const nextButton = document.getElementById("next-question");
  const scoreEl = document.getElementById("score");

  async function fetchQuiz() {
    try {
      // API 요청 보내기
      const response = await fetch("https://opentdb.com/api.php?amount=1&type=multiple");
      
      if (!response.ok) {
        throw new Error("API Error"); // HTTP 상태 코드가 정상적이지 않으면 오류 처리
      }
      
      const data = await response.json();

      // 데이터 유효성 검사
      if (!data.results || data.results.length === 0) {
        throw new Error("No result");
      }

      const quiz = data.results[0];
      displayQuiz(quiz);
    } catch (error) {
      console.error("Error:", error);
      questionEl.textContent = "Retry";
      answersEl.innerHTML = ""; // 이전 답변 초기화
      nextButton.style.display = "block"; // Next Question 버튼 표시
    }
  }

  function decodeHtmlEntities(str) {
    const textarea = document.createElement("textarea");
    textarea.innerHTML = str;
    return textarea.value;
  }

  function displayQuiz(quiz) {
    const decodedQuestion = decodeHtmlEntities(quiz.question);
    const correctAnswer = decodeHtmlEntities(quiz.correct_answer);
    const incorrectAnswers = quiz.incorrect_answers.map((answer) => decodeHtmlEntities(answer));

    questionEl.textContent = decodedQuestion;

    const allAnswers = [...incorrectAnswers, correctAnswer].sort(() => Math.random() - 0.5);
    answersEl.innerHTML = ""; // 기존 답변 초기화

    allAnswers.forEach((answer) => {
      const button = document.createElement("button");
      button.textContent = answer;
      button.classList.add("answer-button");
      button.addEventListener("click", () => {
        if (answer === correctAnswer) {
          score++;
          scoreEl.textContent = `score: ${score}`;
          button.style.backgroundColor = "green";
        } else {
          button.style.backgroundColor = "red";
        }

        // 모든 버튼 비활성화
        document.querySelectorAll(".answer-button").forEach((btn) => {
          btn.disabled = true;
        });

        nextButton.style.display = "block"; // Next Question 버튼 표시
      });
      answersEl.appendChild(button);
    });
  }

  nextButton.addEventListener("click", () => {
    nextButton.style.display = "none"; // Next Question 버튼 숨기기
    questionEl.textContent = "Loading...";
    answersEl.innerHTML = ""; // 기존 답변 초기화
    fetchQuiz(); // 새 퀴즈 로드
  });

  fetchQuiz(); // 초기 퀴즈 로드
});

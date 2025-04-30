// ------------------ AUTH ------------------
function signup() {
    const user = document.getElementById('signupUser').value;
    const pass = document.getElementById('signupPass').value;
    localStorage.setItem("user", user);
    localStorage.setItem("pass", pass);

    // Clear old quizzes data
    localStorage.removeItem("quizzes");

    alert("Signup successful!");
    location.href = "index.html";
}


function login() {
    const user = document.getElementById('loginUser').value;
    const pass = document.getElementById('loginPass').value;
    if (user === localStorage.getItem("user") && pass === localStorage.getItem("pass")) {
        location.href = "home.html";
    } else {
        alert("Invalid credentials!");
    }
}

// ------------------ CREATE QUIZ ------------------
let quizData = [];

// Toggle create quiz form visibility
function toggleForm() {
  document.getElementById("quizCreateForm").style.display = "block";
}

// Add a question to the quiz data
function addQuestion() {
  const question = document.getElementById("question").value;
  const options = [
    document.getElementById("opt1").value,
    document.getElementById("opt2").value,
    document.getElementById("opt3").value,
    document.getElementById("opt4").value
  ];
  const correct = parseInt(document.getElementById("correct").value);

  if (!question || options.some(opt => opt === "") || !(correct >= 1 && correct <= 4)) {
    return alert("Fill all fields correctly!");
  }

  quizData.push({ question, options, correct });
  alert("Question added!");

  // Reset fields
  document.getElementById("question").value = "";
  document.getElementById("opt1").value = "";
  document.getElementById("opt2").value = "";
  document.getElementById("opt3").value = "";
  document.getElementById("opt4").value = "";
  document.getElementById("correct").value = "";
}

// Finish and save the quiz
function finishQuiz() {
  if (quizData.length === 0) {
    return alert("Please add at least one question!");
  }
  let quizzes = JSON.parse(localStorage.getItem("quizzes")) || [];
  quizzes.push(quizData);
  localStorage.setItem("quizzes", JSON.stringify(quizzes));
  alert("Quiz saved successfully!");
  location.href = "home.html";  // Redirect back to home
}

// ------------------ DISPLAY QUIZZES ------------------
window.onload = function () {
  const quizzes = JSON.parse(localStorage.getItem("quizzes")) || [];
  const quizListContainer = document.getElementById("quizList");

  if (quizzes.length === 0) {
    quizListContainer.innerHTML = "<p>No quizzes available. Please create one first.</p>";
    return;
  }

  // Loop through all saved quizzes and create a button for each one
  quizzes.forEach((quiz, quizIndex) => {
    const quizBlock = document.createElement("div");
    quizBlock.classList.add("quiz-block");

    const quizTitle = document.createElement("h3");
    quizTitle.textContent = `Quiz ${quizIndex + 1}`;
    quizBlock.appendChild(quizTitle);

    // Add "Attempt Quiz" button
    const attemptButton = document.createElement("button");
    attemptButton.textContent = "Attempt Quiz";
    attemptButton.classList.add("quiz-button");
    attemptButton.onclick = function () {
      sessionStorage.setItem("quizIndex", quizIndex);  // Store the quiz index to attempt it
      location.href = "quiz.html";  // Navigate to the quiz page
    };

    quizBlock.appendChild(attemptButton);
    quizListContainer.appendChild(quizBlock);
  });
};

// ------------------ DISPLAY QUIZ (on quiz.html) ------------------
if (location.pathname.includes("quiz.html")) {
  window.onload = function () {
    const quizIndex = sessionStorage.getItem("quizIndex");
    const quizzes = JSON.parse(localStorage.getItem("quizzes")) || [];

    if (quizIndex === null || quizzes.length === 0) {
      alert("No quiz found!");
      location.href = "home.html";  // Redirect to home if no quiz index found
      return;
    }

    const quiz = quizzes[quizIndex];
    const container = document.getElementById("quizContainer");

    quiz.forEach((q, index) => {
      const qBlock = document.createElement("div");
      qBlock.classList.add("question-block");

      qBlock.innerHTML = `
        <p><strong>Q${index + 1}:</strong> ${q.question}</p>
        <label><input type="radio" name="q${index}" value="1"> 1. ${q.options[0]}</label><br>
        <label><input type="radio" name="q${index}" value="2"> 2. ${q.options[1]}</label><br>
        <label><input type="radio" name="q${index}" value="3"> 3. ${q.options[2]}</label><br>
        <label><input type="radio" name="q${index}" value="4"> 4. ${q.options[3]}</label><br><br>
      `;
      container.appendChild(qBlock);
    });
  };
}

// ------------------ SUBMIT QUIZ ------------------
function submitQuiz() {
  const quizIndex = sessionStorage.getItem("quizIndex");
  const quizzes = JSON.parse(localStorage.getItem("quizzes")) || [];
  const quiz = quizzes[quizIndex];
  let score = 0;

  quiz.forEach((q, i) => {
    const selected = document.querySelector(`input[name="q${i}"]:checked`);
    if (selected && parseInt(selected.value) === q.correct) {
      score++;
    }
  });

  localStorage.setItem("score", score + "/" + quiz.length);
  location.href = "result.html"; // Redirect to result page
}

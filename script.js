let answers = [];
let currentQuestion = 0;
let totalQuestions = 0;

function startTest() {
  const topic = document.getElementById("topicName").value.trim();
  totalQuestions = parseInt(document.getElementById("questionCount").value);

  if (!topic || isNaN(totalQuestions) || totalQuestions < 1) {
    alert("Please enter a valid topic name and number of questions.");
    return;
  }

  answers = Array(totalQuestions).fill("unanswered");
  document.getElementById("setup").classList.add("hidden");
  document.getElementById("testContainer").classList.remove("hidden");
  document.getElementById("testTitle").textContent = topic;

  renderNavigator();
  loadQuestion();
}

function renderNavigator() {
  const navigator = document.getElementById("questionNavigator");
  navigator.innerHTML = "";
  for (let i = 0; i < totalQuestions; i++) {
    const el = document.createElement("div");
    el.textContent = i + 1;
    if (i === currentQuestion) el.classList.add("active");
    el.onclick = () => { currentQuestion = i; loadQuestion(); };
    navigator.appendChild(el);
  }
}

function loadQuestion() {
  renderNavigator();
  document.getElementById("questionLabel").textContent = `Question ${currentQuestion + 1}`;
  const selected = answers[currentQuestion];

  document.querySelectorAll('input[name="answer"]').forEach(input => {
    input.checked = input.value === selected;
  });
}

function nextQuestion() {
  saveAnswer();
  if (currentQuestion < totalQuestions - 1) {
    currentQuestion++;
    loadQuestion();
  }
}

function prevQuestion() {
  saveAnswer();
  if (currentQuestion > 0) {
    currentQuestion--;
    loadQuestion();
  }
}

function saveAnswer() {
  const selected = document.querySelector('input[name="answer"]:checked');
  if (selected) {
    answers[currentQuestion] = selected.value;
  }
}

function submitTest() {
  saveAnswer();

  let correct = answers.filter(a => a === "correct").length;
  let incorrect = answers.filter(a => a === "incorrect").length;
  let unanswered = answers.filter(a => a === "unanswered").length;
  let total = correct+incorrect+unanswered;
  let attempt = correct+incorrect;
  let score = correct * 4 - incorrect;
  let accuracy = ((correct / attempt) * 100).toFixed(2);

  document.getElementById("testContainer").classList.add("hidden");
  document.getElementById("resultContainer").classList.remove("hidden");
  document.getElementById("scoreText").textContent = `Score: ${score}`;
  document.getElementById("accuracyText").textContent = `Accuracy: ${accuracy}%`;

  const ctx = document.getElementById("resultChart").getContext("2d");
  new Chart(ctx, {
    type: "pie",
    data: {
      labels: ["Correct", "Incorrect", "Unanswered"],
      datasets: [{
        data: [correct, incorrect, unanswered],
        backgroundColor: ["#4caf50", "#f44336", "#ffc107"]
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: "bottom"
        }
      }
    }
  });

  // ✅ Telegram Integration (Frontend Only)
  const BOT_TOKEN = "7651940991:AAGEYiJinRqoCbaUjMirpEXvWFxfr23JVB0";      // 🔁 Replace with your Telegram bot token
  const CHAT_ID = "8024677797";          // 🔁 Replace with your Telegram user ID
  const topic = document.getElementById("testTitle").textContent;

  const message = `🧾 *Test Result: ${topic}*\n✅ Score: ${score}\n📊 Accuracy: ${accuracy}%\n🔢 Total: ${total}\n☑️ Correct: ${correct}\n❌ Incorrect: ${incorrect}\n🎡 Unanswered: ${unanswered}`;

  fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      chat_id: CHAT_ID,
      text: message,
      parse_mode: "Markdown"
    })
  })
  .then(res => res.json())
  .then(data => {
    if (data.ok) {
      alert("Result sent to Telegram!");
    } else {
      alert("Failed to send result.");
    }
  });
}

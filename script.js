let questions = [];
let currentQuestion = 0;

function startTest() {
  const title = document.getElementById("title").value;
  const count = parseInt(document.getElementById("count").value);

  if (!title || count <= 0) {
    alert("Please enter valid inputs");
    return;
  }

  questions = Array.from({ length: count }, () => ({ answer: "unanswered" }));

  document.getElementById("inputSection").classList.add("hidden");
  document.getElementById("testSection").classList.remove("hidden");
  document.getElementById("testTitle").textContent = title;

  createNavigator(count);
  loadQuestion(0);
}

function createNavigator(count) {
  const nav = document.getElementById("questionNavigator");
  nav.innerHTML = "";
  for (let i = 0; i < count; i++) {
    const btn = document.createElement("div");
    btn.textContent = i + 1;
    btn.onclick = () => loadQuestion(i);
    nav.appendChild(btn);
  }
  updateNavigatorHighlight();
}

function loadQuestion(index) {
  currentQuestion = index;
  document.getElementById("questionNumber").textContent = `Question ${index + 1}`;
  const answer = questions[index].answer;
  document.getElementById("correct").checked = answer === "correct";
  document.getElementById("incorrect").checked = answer === "incorrect";
  document.getElementById("unanswered").checked = answer === "unanswered";
  updateNavigatorHighlight();
}

function saveAnswer() {
  const answer = document.querySelector('input[name="answer"]:checked').value;
  questions[currentQuestion].answer = answer;
}

function nextQuestion() {
  saveAnswer();
  if (currentQuestion < questions.length - 1) {
    loadQuestion(currentQuestion + 1);
  } else {
    alert("This is the last question.");
  }
}

function updateNavigatorHighlight() {
  const nav = document.getElementById("questionNavigator").children;
  for (let i = 0; i < nav.length; i++) {
    nav[i].classList.toggle("active", i === currentQuestion);
  }
}

function submitTest() {
  saveAnswer();

  const correct = questions.filter(q => q.answer === "correct").length;
  const incorrect = questions.filter(q => q.answer === "incorrect").length;
  const unanswered = questions.filter(q => q.answer === "unanswered").length;

  const score = correct * 4 + incorrect * -1;
  const attempted = correct + incorrect;
  const total = attempted + unanswered;
  const accuracy = attempted ? ((correct / attempted) * 100).toFixed(2) : 0;

  document.getElementById("testSection").classList.add("hidden");
  document.getElementById("resultSection").classList.remove("hidden");

  document.getElementById("scoreText").textContent = `Score: ${score}`;
  document.getElementById("accuracyText").textContent = `Accuracy: ${accuracy}%`;

  renderChart(correct, incorrect, unanswered);

  // ✅ Telegram Integration - Frontend Only
  const BOT_TOKEN = "7651940991:AAGEYiJinRqoCbaUjMirpEXvWFxfr23JVB0"; // 🔁 Replace with your real token
  const CHAT_ID = "8024677797";     // 🔁 Replace with your Telegram user ID

  const topic = document.getElementById("testTitle").textContent;
  const message = `🧾 *Test Result: ${topic}*\n✅ Score: ${score}\n📊 Accuracy: ${accuracy}%\n☑️ Correct: ${correct}\n ❌ Incorrect: ${incorrect}\n 🔢 Total: ${total}`;

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
      alert("Telegram API error.");
    }
  });
}

function renderChart(correct, incorrect, unanswered) {
  const ctx = document.getElementById("resultChart").getContext("2d");

  new Chart(ctx, {
    type: "pie",
    data: {
      labels: ["Correct", "Incorrect", "Unanswered"],
      datasets: [{
        data: [correct, incorrect, unanswered],
        backgroundColor: ["#4CAF50", "#F44336", "#FF9800"]
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          position: "bottom"
        }
      }
    }
  });
}

/* ============================================
   1. CODE PLAYGROUND
   ============================================ */
function runCode() {
  const output = document.getElementById('output');
  const code = document.getElementById('code-input').value;

  // Capture console.log output
  let logs = [];
  const originalLog = console.log;
  console.log = function (...args) {
    logs.push(args.join(' '));
    originalLog.apply(console, args);
  };

  try {
    // Execute the user's code
    const result = new Function(code)();
    if (result !== undefined) {
      logs.push('→ ' + result);
    }
    output.textContent = logs.length > 0 ? logs.join('\n') : '// Code ran with no output.';
  } catch (error) {
    output.textContent = '❌ Error: ' + error.message;
  } finally {
    // Restore original console.log
    console.log = originalLog;
  }
}

function clearOutput() {
  document.getElementById('output').textContent = '// Output will appear here...';
}

/* ============================================
   2. QUIZ
   ============================================ */
function submitQuiz() {
  const questions = document.querySelectorAll('.quiz-question');
  let score = 0;
  let answered = 0;

  questions.forEach((q) => {
    const correctAnswer = q.dataset.answer;
    const selected = q.querySelector('input[type="radio"]:checked');

    // Clear previous styles
    q.querySelectorAll('.quiz-option').forEach(opt => {
      opt.classList.remove('correct', 'wrong');
    });

    if (selected) {
      answered++;
      const selectedLabel = selected.closest('.quiz-option');
      if (selected.value === correctAnswer) {
        score++;
        selectedLabel.classList.add('correct');
      } else {
        selectedLabel.classList.add('wrong');
        // Highlight the correct answer
        q.querySelectorAll('.quiz-option').forEach(opt => {
          const input = opt.querySelector('input');
          if (input.value === correctAnswer) {
            opt.classList.add('correct');
          }
        });
      }
    }
  });

  const resultDiv = document.getElementById('quiz-result');
  const percentage = Math.round((score / questions.length) * 100);

  if (answered < questions.length) {
    resultDiv.textContent = `⚠️ Please answer all ${questions.length} questions. (${answered}/${questions.length} answered)`;
    resultDiv.className = 'fail';
  } else if (score === questions.length) {
    resultDiv.textContent = `🎉 Perfect! You scored ${score}/${questions.length} (${percentage}%).`;
    resultDiv.className = 'pass';
  } else if (percentage >= 60) {
    resultDiv.textContent = `✅ Good job! You scored ${score}/${questions.length} (${percentage}%).`;
    resultDiv.className = 'pass';
  } else {
    resultDiv.textContent = `📚 You scored ${score}/${questions.length} (${percentage}%). Review the lesson and try again.`;
    resultDiv.className = 'fail';
  }
}

function resetQuiz() {
  document.getElementById('quiz-form').reset();
  document.querySelectorAll('.quiz-option').forEach(opt => {
    opt.classList.remove('correct', 'wrong');
  });
  const resultDiv = document.getElementById('quiz-result');
  resultDiv.style.display = 'none';
  resultDiv.className = '';
}

/* ============================================
   3. CALCULATOR
   ============================================ */
let calcExpression = '';

function calcInput(value) {
  calcExpression += value;
  document.getElementById('calc-display').textContent = calcExpression;
}

function calcClear() {
  calcExpression = '';
  document.getElementById('calc-display').textContent = '0';
}

function calcEqual() {
  try {
    // Safe evaluation: only allow numbers and operators
    if (!/^[0-9+\-*/.]+$/.test(calcExpression)) {
      throw new Error('Invalid characters');
    }
    const result = Function('"use strict"; return (' + calcExpression + ')')();
    document.getElementById('calc-display').textContent = result;
    calcExpression = String(result);
  } catch (error) {
    document.getElementById('calc-display').textContent = 'Error';
    calcExpression = '';
  }
}

/* ============================================
   4. SMOOTH SCROLL FOR NAV LINKS
   ============================================ */
document.querySelectorAll('nav a').forEach(link => {
  link.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

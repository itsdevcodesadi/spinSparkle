// State management
let isSpinning = false;
let spinCount = 0;
let rotation = 0;
let confettiInterval = null;

// Elements
const spinButton = document.getElementById("spinButton");
const wheelWrapper = document.getElementById("wheelWrapper");
const missModal = document.getElementById("missModal");
const winModal = document.getElementById("winModal");

// Confetti functionality
function startConfetti() {
  const canvas = document.getElementById("confetti-canvas");
  const ctx = canvas.getContext("2d");
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const confetti = [];
  const confettiCount = 200;
  const colors = ["#FFD700", "#FFA500", "#FFFF00", "#FF6347"];

  for (let i = 0; i < confettiCount; i++) {
    confetti.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height - canvas.height,
      r: Math.random() * 6 + 4,
      d: Math.random() * confettiCount,
      color: colors[Math.floor(Math.random() * colors.length)],
      tilt: Math.random() * 10 - 10,
      tiltAngleIncremental: Math.random() * 0.07 + 0.05,
      tiltAngle: 0,
    });
  }

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    confetti.forEach((c, i) => {
      ctx.beginPath();
      ctx.lineWidth = c.r / 2;
      ctx.strokeStyle = c.color;
      ctx.moveTo(c.x + c.tilt + c.r / 4, c.y);
      ctx.lineTo(c.x + c.tilt, c.y + c.tilt + c.r / 4);
      ctx.stroke();

      c.tiltAngle += c.tiltAngleIncremental;
      c.y += (Math.cos(c.d) + 3 + c.r / 2) / 2;
      c.x += Math.sin(c.d);
      c.tilt = Math.sin(c.tiltAngle - i / 3) * 15;

      if (c.y > canvas.height) {
        confetti[i] = {
          x: Math.random() * canvas.width,
          y: -30,
          r: c.r,
          d: c.d,
          color: c.color,
          tilt: c.tilt,
          tiltAngleIncremental: c.tiltAngleIncremental,
          tiltAngle: c.tiltAngle,
        };
      }
    });

    confettiInterval = requestAnimationFrame(draw);
  }

  draw();
}

function stopConfetti() {
  if (confettiInterval) {
    cancelAnimationFrame(confettiInterval);
    confettiInterval = null;
    const canvas = document.getElementById("confetti-canvas");
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }
}

// Spin wheel functionality
function handleSpin() {
  if (isSpinning) return;

  const isFirst = spinCount === 0;
  const duration = isFirst ? 4500 : 5200;

  isSpinning = true;
  spinCount++;
  spinButton.disabled = true;
  spinButton.textContent = "SPINNING...";

  const current = rotation;
  const remainder = ((current % 360) + 360) % 360;
  let target = current;

  if (isFirst) {
    // First spin - miss the zero
    const offset = 120;
    target = current + 4 * 360 + offset;
  } else {
    // Second spin - land on zero
    const correction = (360 - remainder) % 360;
    target = current + 6 * 360 + correction;
  }

  rotation = target;
  wheelWrapper.style.transition = `transform ${duration}ms cubic-bezier(0.15, 0.85, 0.25, 1)`;
  wheelWrapper.style.transform = `rotate(${target}deg)`;

  setTimeout(() => {
    isSpinning = false;
    spinButton.disabled = false;
    spinButton.textContent = "SPIN NOW";

    if (isFirst) {
      missModal.classList.add("active");
    } else {
      winModal.classList.add("active");
      startConfetti();
      setTimeout(stopConfetti, 5000);
    }
  }, duration + 100);
}

// Modal handlers
function handleSpinAgain() {
  missModal.classList.remove("active");
  handleSpin();
}

function closeWinModal() {
  winModal.classList.remove("active");
  stopConfetti();
}

// Close modal on overlay click
missModal.addEventListener("click", (e) => {
  if (e.target === missModal) {
    missModal.classList.remove("active");
  }
});

winModal.addEventListener("click", (e) => {
  if (e.target === winModal) {
    closeWinModal();
  }
});

// Spin button event
spinButton.addEventListener("click", handleSpin);

// VIP Form
document.getElementById("vipForm").addEventListener("submit", (e) => {
  e.preventDefault();
  const email = document.getElementById("emailInput").value;
  console.log("VIP Access requested for:", email);
  alert("VIP Access requested for: " + email);
  document.getElementById("emailInput").value = "";
});

// Resize canvas on window resize
window.addEventListener("resize", () => {
  const canvas = document.getElementById("confetti-canvas");
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
});

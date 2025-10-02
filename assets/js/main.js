class SpinWheelGame {
    constructor() {
        this.isSpinning = false;
        this.spinCount = 0;
        this.rotation = 0;
        this.spinDuration = 4500;
        
        this.initElements();
        this.initEventListeners();
    }

    initElements() {
        this.wheel = document.getElementById('rouletteWheel');
        this.spinButton = document.getElementById('spinButton');
        this.missModal = document.getElementById('missModal');
        this.winModal = document.getElementById('winModal');
        this.spinAgainBtn = document.getElementById('spinAgainBtn');
        this.claimRewardBtn = document.getElementById('claimRewardBtn');
        this.vipForm = document.getElementById('vipForm');
        this.emailInput = document.getElementById('emailInput');
    }

    initEventListeners() {
        this.spinButton.addEventListener('click', () => this.handleSpin());
        this.spinAgainBtn.addEventListener('click', () => this.handleSpinAgain());
        this.claimRewardBtn.addEventListener('click', () => this.closeWinModal());
        this.vipForm.addEventListener('submit', (e) => this.handleVipSubmit(e));
        
        this.missModal.addEventListener('click', (e) => {
            if (e.target === this.missModal) {
                this.closeMissModal();
            }
        });
        
        this.winModal.addEventListener('click', (e) => {
            if (e.target === this.winModal) {
                this.closeWinModal();
            }
        });
    }

    handleSpin() {
        if (this.isSpinning) return;

        const isFirstSpin = this.spinCount === 0;
        const duration = isFirstSpin ? 4500 : 5200;
        this.spinDuration = duration;

        this.isSpinning = true;
        this.spinCount++;

        this.spinButton.textContent = 'SPINNING...';
        this.spinButton.disabled = true;

        const current = this.rotation;
        const remainder = ((current % 360) + 360) % 360;

        let target = current;
        if (isFirstSpin) {
            const offset = 120;
            target = current + 4 * 360 + offset;
        } else {
            const correction = (360 - remainder) % 360;
            target = current + 6 * 360 + correction;
        }

        this.rotation = target;

        this.wheel.classList.add(isFirstSpin ? 'spinning' : 'spinning-second');
        this.wheel.style.transform = `rotate(${target}deg)`;

        setTimeout(() => {
            this.isSpinning = false;
            this.spinButton.disabled = false;
            this.spinButton.textContent = 'SPIN NOW';
            this.wheel.classList.remove('spinning', 'spinning-second');

            if (isFirstSpin) {
                this.showMissModal();
            } else {
                this.showWinModal();
                triggerConfetti();
            }
        }, duration + 100);
    }

    handleSpinAgain() {
        this.closeMissModal();
        this.handleSpin();
    }

    showMissModal() {
        this.missModal.classList.add('open');
        document.body.style.overflow = 'hidden';
    }

    closeMissModal() {
        this.missModal.classList.remove('open');
        document.body.style.overflow = '';
    }

    showWinModal() {
        this.winModal.classList.add('open');
        document.body.style.overflow = 'hidden';
    }

    closeWinModal() {
        this.winModal.classList.remove('open');
        document.body.style.overflow = '';
        if (confetti) {
            confetti.stop();
        }
    }

    handleVipSubmit(e) {
        e.preventDefault();
        const email = this.emailInput.value.trim();
        
        if (email) {
            alert(`Thank you! VIP access request submitted for: ${email}`);
            this.emailInput.value = '';
        }
    }
}

class CountdownTimer {
    constructor() {
        this.targetTime = new Date().getTime() + (2 * 60 + 54) * 1000; // 2:54 from now
        this.init();
    }

    init() {
        this.updateTimer();
        setInterval(() => this.updateTimer(), 1000);
    }

    updateTimer() {
        const now = new Date().getTime();
        const distance = this.targetTime - now;

        if (distance < 0) {
            // Reset the timer
            this.targetTime = new Date().getTime() + (2 * 60 + 54) * 1000;
            return;
        }

        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        const timerElements = document.querySelectorAll('.text-orange-400');
        timerElements.forEach(element => {
            if (element.textContent.includes('Offer resets in')) {
                element.textContent = `Offer resets in ${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
            }
        });
    }
}

// Vault stock counter
class VaultCounter {
    constructor() {
        this.stock = 92;
        this.init();
    }

    init() {
        setInterval(() => {
            if (this.stock > 50 && Math.random() < 0.3) {
                this.stock--;
                this.updateDisplay();
            }
        }, (Math.random() * 90 + 30) * 1000);
    }

    updateDisplay() {
        const stockElements = document.querySelectorAll('.text-red-400');
        stockElements.forEach(element => {
            const parent = element.parentElement;
            if (parent && parent.textContent.includes('digital vaults left')) {
                element.textContent = this.stock.toString();
            }
        });
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new SpinWheelGame();
    new CountdownTimer();
    new VaultCounter();
    
    addVisualEnhancements();
});

function addVisualEnhancements() {
    const buttons = document.querySelectorAll('.btn');
    buttons.forEach(button => {
        button.addEventListener('mouseenter', () => {
            button.style.transform = 'translateY(-2px)';
        });
        
        button.addEventListener('mouseleave', () => {
            button.style.transform = 'translateY(0)';
        });
    });

    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const hero = document.querySelector('.hero-bg');
        if (hero) {
            hero.style.transform = `translateY(${scrolled * 0.5}px)`;
        }
    });

    
}





// Safari-smooth fixed background shim
(function () {
  // Detect iOS Safari / Safari (robustish)
  const ua = navigator.userAgent || navigator.vendor || window.opera;
  const isIOS = /iP(hone|od|ad)/.test(navigator.platform) || 
                (navigator.maxTouchPoints && /MacIntel/.test(navigator.platform));
  const isSafari = /^((?!chrome|android).)*safari/i.test(ua);
  const isMobileSafari = isIOS && isSafari && !/CriOS|FxiOS|OPiOS|EdgiOS|Android/i.test(ua);

  // Run for Safari (desktop and mobile Safari) — but limit to devices that need it
  if (!isSafari && !isMobileSafari) return;

  const bg = document.querySelector('.fixed-bg');
  if (!bg) return;

  // Switch to absolute so we control visual position via transform
  bg.style.position = 'absolute';
  bg.style.top = '0';
  bg.style.left = '0';
  bg.style.width = '100%';
  bg.style.height = '100%';
  bg.style.willChange = 'transform';
  bg.style.webkitTransform = 'translate3d(0,0,0)';
  bg.style.transform = 'translate3d(0,0,0)';

  let latestKnownScrollY = 0;
  let ticking = false;

  function onScroll() {
    latestKnownScrollY = window.scrollY || window.pageYOffset || 0;
    if (!ticking) {
      window.requestAnimationFrame(update);
      ticking = true;
    }
  }

  function update() {
    // Move the background down by the scroll amount so it stays visually fixed
    const y = Math.round(latestKnownScrollY);
    const t = `translate3d(0, ${y}px, 0)`;
    bg.style.webkitTransform = t;
    bg.style.transform = t;
    ticking = false;
  }

  // Use passive listener for better performance
  window.addEventListener('scroll', onScroll, { passive: true });

  // in case page is already scrolled on load
  onScroll();
})();

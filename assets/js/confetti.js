
class ConfettiEffect {
    constructor(container) {
        this.container = container;
        this.particles = [];
        this.isActive = false;
    }

    createParticle() {
        const colors = ['#ffd700', '#ff6b6b', '#4ecdc4', '#45b7d1', '#f39c12', '#e74c3c', '#9b59b6'];
        const particle = document.createElement('div');
        
        particle.style.position = 'absolute';
        particle.style.width = Math.random() * 10 + 5 + 'px';
        particle.style.height = Math.random() * 10 + 5 + 'px';
        particle.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        particle.style.left = Math.random() * window.innerWidth + 'px';
        particle.style.top = '-10px';
        particle.style.opacity = '0.8';
        particle.style.borderRadius = '50%';
        particle.style.pointerEvents = 'none';
        particle.style.zIndex = '999';
        
        const xVelocity = (Math.random() - 0.5) * 4;
        const yVelocity = Math.random() * 3 + 2;
        const rotation = Math.random() * 360;
        const rotationSpeed = (Math.random() - 0.5) * 10;
        
        particle.xVelocity = xVelocity;
        particle.yVelocity = yVelocity;
        particle.rotation = rotation;
        particle.rotationSpeed = rotationSpeed;
        particle.gravity = 0.1;
        
        this.container.appendChild(particle);
        this.particles.push(particle);
    }

    updateParticles() {
        this.particles.forEach((particle, index) => {
            const rect = particle.getBoundingClientRect();
            
            particle.xVelocity *= 0.99;
            particle.yVelocity += particle.gravity;
            particle.rotation += particle.rotationSpeed;
            
            const left = parseFloat(particle.style.left) + particle.xVelocity;
            const top = parseFloat(particle.style.top) + particle.yVelocity;
            
            particle.style.left = left + 'px';
            particle.style.top = top + 'px';
            particle.style.transform = `rotate(${particle.rotation}deg)`;
            
            if (top > window.innerHeight + 10) {
                particle.remove();
                this.particles.splice(index, 1);
            }
        });
    }

    start() {
        if (this.isActive) return;
        
        this.isActive = true;
        let particleCount = 0;
        const maxParticles = 150;
        
        const createInterval = setInterval(() => {
            if (particleCount < maxParticles) {
                this.createParticle();
                this.createParticle();
                particleCount += 2;
            } else {
                clearInterval(createInterval);
            }
        }, 50);
        
        const updateLoop = () => {
            if (this.isActive || this.particles.length > 0) {
                this.updateParticles();
                requestAnimationFrame(updateLoop);
            }
        };
        
        updateLoop();
        
        // Stop creating new particles after 3 seconds
        setTimeout(() => {
            this.isActive = false;
        }, 3000);
    }

    stop() {
        this.isActive = false;
        this.particles.forEach(particle => particle.remove());
        this.particles = [];
    }
}

let confetti = null;

function initConfetti() {
    const container = document.getElementById('confettiContainer');
    if (container) {
        confetti = new ConfettiEffect(container);
    }
}

function triggerConfetti() {
    if (confetti) {
        confetti.start();
    }
}

document.addEventListener('DOMContentLoaded', initConfetti);

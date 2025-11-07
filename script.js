document.addEventListener('DOMContentLoaded', () => {
  const particleContainer = document.createElement('div');
  particleContainer.id = 'particle-container';
  document.body.appendChild(particleContainer);

  const numParticles = 100;

  for (let i = 0; i < numParticles; i++) {
    const particle = document.createElement('div');
    particle.classList.add('particle');
    particle.style.left = `${Math.random() * 100}%`;
    particle.style.top = `${Math.random() * 100}%`;
    particle.style.animationDelay = `${Math.random() * 5}s`;
    particleContainer.appendChild(particle);
  }
});

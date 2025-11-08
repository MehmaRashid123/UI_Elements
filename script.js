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


// Handle login
loginButton.addEventListener('click', async () => {
  const email = loginEmailInput.value;
  const password = loginPasswordInput.value;
  const { data, error } = await _supabase.auth.signInWithPassword({ email, password });
  if (error) {
    showToast(error.message, 'error');
  } else {
    showToast('Logged in successfully!');
  }
});

// Handle signup
signupButton.addEventListener('click', async () => {
  const email = signupEmailInput.value;
  const password = signupPasswordInput.value;
  const { data, error } = await _supabase.auth.signUp({ email, password });
  if (error) {
    showToast(error.message, 'error');
  } else {
    showToast('Check your email for a confirmation link!');
  }
});

// Handle logout
logoutButton.addEventListener('click', async () => {
  const { error } = await _supabase.auth.signOut();
  if (error) {
    showToast(error.message, 'error');
  }
});

// Handle password reset
resetPasswordButton.addEventListener('click', async () => {
  const email = resetEmailInput.value;
  console.log('Attempting to send password reset for email:', email);
  const { data, error } = await _supabase.auth.resetPasswordForEmail(email, {
    redirectTo: window.location.href, // Using href for more specific redirect
  });

  if (error) {
    console.error('Error sending password reset email:', error);
    showToast(error.message, 'error');
  } else {
    console.log('Password reset email sent successfully. Data:', data);
    showToast('Check your email for a password reset link!');
  }
});

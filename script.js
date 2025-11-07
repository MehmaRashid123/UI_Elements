const { createClient } = supabase;
const _supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const authSection = document.getElementById('auth-section');
const mainContent = document.getElementById('main-content');

// Forms
const loginForm = document.getElementById('login-form');
const signupForm = document.getElementById('signup-form');
const forgotPasswordForm = document.getElementById('forgot-password-form');

// Buttons
const loginButton = document.getElementById('login-button');
const signupButton = document.getElementById('signup-button');
const logoutButton = document.getElementById('logout-button');
const resetPasswordButton = document.getElementById('reset-password-button');

// Inputs
const loginEmailInput = document.getElementById('login-email');
const loginPasswordInput = document.getElementById('login-password');
const signupEmailInput = document.getElementById('signup-email');
const signupPasswordInput = document.getElementById('signup-password');
const resetEmailInput = document.getElementById('reset-email');

// Links
const showSignup = document.getElementById('show-signup');
const showLogin = document.getElementById('show-login');
const forgotPasswordLink = document.getElementById('forgot-password-link');
const backToLogin = document.getElementById('back-to-login');

// --- Form Switching ---
showSignup.addEventListener('click', (e) => {
  e.preventDefault();
  loginForm.style.display = 'none';
  signupForm.style.display = 'block';
  forgotPasswordForm.style.display = 'none';
});

showLogin.addEventListener('click', (e) => {
  e.preventDefault();
  loginForm.style.display = 'block';
  signupForm.style.display = 'none';
  forgotPasswordForm.style.display = 'none';
});

forgotPasswordLink.addEventListener('click', (e) => {
  e.preventDefault();
  loginForm.style.display = 'none';
  signupForm.style.display = 'none';
  forgotPasswordForm.style.display = 'block';
});

backToLogin.addEventListener('click', (e) => {
  e.preventDefault();
  loginForm.style.display = 'block';
  signupForm.style.display = 'none';
  forgotPasswordForm.style.display = 'none';
});

const showToast = (text, type = 'success') => {
  const backgroundColor = type === 'success' ? 'linear-gradient(to right, #00b09b, #96c93d)' : 'linear-gradient(to right, #ff5f6d, #ffc371)';
  Toastify({
    text: text,
    duration: 3000,
    close: true,
    gravity: "top", // `top` or `bottom`
    position: "right", // `left`, `center` or `right`
    stopOnFocus: true, // Prevents dismissing of toast on hover
    hideProgressBar: false,
    style: {
      background: backgroundColor,
    },
  }).showToast();
};

// --- Authentication ---

// Function to handle showing the correct form based on URL hash
const handlePasswordRecovery = async () => {
  const hash = window.location.hash;
  if (hash.includes('type=recovery')) {
    const params = new URLSearchParams(hash.substring(1));
    const accessToken = params.get('access_token');
    if (!accessToken) {
        console.error('Recovery token not found in URL');
        return;
    }

    // Set the session from the recovery token
    const { error } = await _supabase.auth.setSession({ access_token: accessToken, refresh_token: '' });
    if(error){
        console.error('Error setting session from recovery token:', error);
        return;
    }

    authSection.style.display = 'flex';
    mainContent.style.display = 'none';
    loginForm.style.display = 'none';
    signupForm.style.display = 'none';
    forgotPasswordForm.style.display = 'none';
    const updatePasswordForm = document.getElementById('update-password-form');
    updatePasswordForm.style.display = 'block';

    const updatePasswordButton = document.getElementById('update-password-button');
    updatePasswordButton.addEventListener('click', async () => {
      const newPassword = document.getElementById('new-password').value;
      const { data, error } = await _supabase.auth.updateUser({ password: newPassword });
      if (error) {
        showToast(error.message, 'error');
      } else {
        showToast('Password updated successfully! You can now log in.');
        window.location.hash = ''; // Clear the hash
        updatePasswordForm.style.display = 'none';
        loginForm.style.display = 'block';
      }
    });

    return true; //Indicate that we are in recovery mode
  }
  return false; // Not in recovery mode
};

// Handle Authentication State Change
_supabase.auth.onAuthStateChange(async (event, session) => {
    // This will handle login/logout events while the app is active
    if (!session) {
        authSection.style.display = 'flex';
        mainContent.style.display = 'none';
        loginForm.style.display = 'block';
        signupForm.style.display = 'none';
        forgotPasswordForm.style.display = 'none';
    } else {
        authSection.style.display = 'none';
        mainContent.style.display = 'grid';
    }
});


// Initial Load
document.addEventListener('DOMContentLoaded', async () => {
  const inRecoveryMode = await handlePasswordRecovery();
  if (inRecoveryMode) {
    return; // Stop further processing if we are in recovery mode
  }

  // Check user session if not in recovery mode
  const { data: { session } } = await _supabase.auth.getSession();
  if (session) {
    authSection.style.display = 'none';
    mainContent.style.display = 'grid';
  } else {
    authSection.style.display = 'flex';
    mainContent.style.display = 'none';
  }
  
  // Particle animation
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

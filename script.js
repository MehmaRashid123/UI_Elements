const { createClient } = supabase;

const ui = {
    authSection: document.getElementById('auth-section'),
    mainContent: document.getElementById('main-content'),
    loginForm: document.getElementById('login-form'),
    signupForm: document.getElementById('signup-form'),
    forgotPasswordForm: document.getElementById('forgot-password-form'),
    loginButton: document.getElementById('login-button'),
    signupButton: document.getElementById('signup-button'),
    logoutButton: document.getElementById('logout-button'),
    resetPasswordButton: document.getElementById('reset-password-button'),
    loginEmailInput: document.getElementById('login-email'),
    loginPasswordInput: document.getElementById('login-password'),
    signupEmailInput: document.getElementById('signup-email'),
    signupPasswordInput: document.getElementById('signup-password'),
    resetEmailInput: document.getElementById('reset-email'),
    showSignup: document.getElementById('show-signup'),
    showLogin: document.getElementById('show-login'),
    forgotPasswordLink: document.getElementById('forgot-password-link'),
    backToLogin: document.getElementById('back-to-login'),
    updatePasswordForm: document.getElementById('update-password-form'),
    updatePasswordButton: document.getElementById('update-password-button'),
    newPasswordInput: document.getElementById('new-password'),
};

// --- Form Switching ---
const formManager = {
    show: (formToShow) => {
        ['loginForm', 'signupForm', 'forgotPasswordForm', 'updatePasswordForm'].forEach(form => {
            ui[form].style.display = 'none';
        });
        if (formToShow) {
            ui[formToShow].style.display = 'block';
        }
    }
};

ui.showSignup.addEventListener('click', (e) => {
  e.preventDefault();
  formManager.show('signupForm');
});

ui.showLogin.addEventListener('click', (e) => {
  e.preventDefault();
  formManager.show('loginForm');
});

ui.forgotPasswordLink.addEventListener('click', (e) => {
  e.preventDefault();
  formManager.show('forgotPasswordForm');
});

ui.backToLogin.addEventListener('click', (e) => {
  e.preventDefault();
  formManager.show('loginForm');
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

const auth = {
    _supabase: createClient(SUPABASE_URL, SUPABASE_ANON_KEY),

    async handlePasswordRecovery() {
        const hash = window.location.hash;
        if (hash.includes('type=recovery')) {
            const params = new URLSearchParams(hash.substring(1));
            const accessToken = params.get('access_token');
            if (!accessToken) {
                console.error('Recovery token not found in URL');
                return;
            }

            const { error } = await this._supabase.auth.setSession({ access_token: accessToken, refresh_token: '' });
            if(error){
                console.error('Error setting session from recovery token:', error);
                return;
            }

            ui.authSection.style.display = 'flex';
            ui.mainContent.style.display = 'none';
            formManager.show('updatePasswordForm');

            return true;
        }
        return false;
    },

    handleAuthStateChange() {
        this._supabase.auth.onAuthStateChange(async (event, session) => {
            if (!session) {
                ui.authSection.style.display = 'flex';
                ui.mainContent.style.display = 'none';
                formManager.show('loginForm');
            } else {
                ui.authSection.style.display = 'none';
                ui.mainContent.style.display = 'grid';
            }
        });
    },

    async login() {
        const email = ui.loginEmailInput.value;
        const password = ui.loginPasswordInput.value;
        const { data, error } = await this._supabase.auth.signInWithPassword({ email, password });
        if (error) {
            showToast(error.message, 'error');
        } else {
            showToast('Logged in successfully!');
        }
    },

    async signup() {
        const email = ui.signupEmailInput.value;
        const password = ui.signupPasswordInput.value;
        const { data, error } = await this._supabase.auth.signUp({ email, password });
        if (error) {
            showToast(error.message, 'error');
        } else {
            showToast('Check your email for a confirmation link!');
            formManager.show('loginForm');
        }
    },

    async logout() {
        const { error } = await this._supabase.auth.signOut();
        if (error) {
            showToast(error.message, 'error');
        }
    },

    async resetPassword() {
        const email = ui.resetEmailInput.value;
        const { data, error } = await this._supabase.auth.resetPasswordForEmail(email, {
            redirectTo: window.location.href,
        });

        if (error) {
            showToast(error.message, 'error');
        } else {
            showToast('Check your email for a password reset link!');
        }
    },

    async updatePassword() {
        const newPassword = ui.newPasswordInput.value;
        const { data, error } = await this._supabase.auth.updateUser({ password: newPassword });
        if (error) {
            showToast(error.message, 'error');
        } else {
            showToast('Password updated successfully! You can now log in.');
            window.location.hash = '';
            formManager.show('loginForm');
        }
    }
};


document.addEventListener('DOMContentLoaded', async () => {
    const inRecoveryMode = await auth.handlePasswordRecovery();
    if (inRecoveryMode) {
        return;
    }

    const { data: { session } } = await auth._supabase.auth.getSession();
    if (session) {
        ui.authSection.style.display = 'none';
        ui.mainContent.style.display = 'grid';
    } else {
        ui.authSection.style.display = 'flex';
        ui.mainContent.style.display = 'none';
        formManager.show('loginForm');
    }

    auth.handleAuthStateChange();

    ui.loginButton.addEventListener('click', () => auth.login());
    ui.signupButton.addEventListener('click', () => auth.signup());
    ui.logoutButton.addEventListener('click', () => auth.logout());
    ui.resetPasswordButton.addEventListener('click', () => auth.resetPassword());
    ui.updatePasswordButton.addEventListener('click', () => auth.updatePassword());

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

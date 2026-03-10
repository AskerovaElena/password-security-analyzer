const passwordInput = document.getElementById('passwordInput');
const toggleIcon = document.getElementById('toggleIcon');
const strengthBar = document.getElementById('strengthBar');
const strengthText = document.getElementById('strengthText');
const bruteForceText = document.getElementById('bruteForceText');
const suggestionList = document.getElementById('suggestionList');

// Şifrəni göstər/gizlə (İkon dəyişməsi ilə)
toggleIcon.addEventListener('click', () => {
    const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
    passwordInput.setAttribute('type', type);
    
    // İkonu dəyişdir
    toggleIcon.classList.toggle('fa-eye');
    toggleIcon.classList.toggle('fa-eye-slash');
});

passwordInput.addEventListener('input', () => {
    const val = passwordInput.value;
    analyzePassword(val);
});

function analyzePassword(pwd) {
    let score = 0;
    let suggestions = [];

    if (!pwd) {
        resetUI();
        return;
    }

    // Analiz məntiqi
    if (pwd.length >= 8) score++; else suggestions.push("Daha uzun şifrə seçin.");
    if (/[A-Z]/.test(pwd)) score++; else suggestions.push("Böyük hərf çatışmır.");
    if (/[0-9]/.test(pwd)) score++; else suggestions.push("Rəqəm əlavə edin.");
    if (/[^A-Za-z0-9]/.test(pwd)) score++; else suggestions.push("Simvol (!@#) istifadə edin.");

    // UI Yeniləmə
    const colors = ['#ff4b2b', '#ff9068', '#fbc02d', '#4caf50'];
    const labels = ['Çox Zəif', 'Zəif', 'Orta', 'Təhlükəsiz'];
    
    let index = Math.max(0, score - 1);
    strengthBar.style.width = (score * 25) + "%";
    strengthBar.style.background = colors[index];
    strengthText.textContent = labels[index];
    strengthText.style.color = colors[index];

    suggestionList.innerHTML = suggestions.length > 0 
        ? suggestions.map(s => `<li>${s}</li>`).join('')
        : "<li><i class='fa-solid fa-check'></i> Şifrə qaydasındadır!</li>";

    calculateBruteForce(pwd);
}

function calculateBruteForce(pwd) {
    let charset = 0;
    if (/[a-z]/.test(pwd)) charset += 26;
    if (/[A-Z]/.test(pwd)) charset += 26;
    if (/[0-9]/.test(pwd)) charset += 10;
    if (/[^A-Za-z0-9]/.test(pwd)) charset += 32;

    const combinations = Math.pow(charset, pwd.length);
    const speed = 1e10; // Saniyədə 10 milyard cəhd
    const seconds = combinations / speed;

    const formatter = new Intl.RelativeTimeFormat('az', { numeric: 'auto' });
    
    if (seconds < 1) bruteForceText.textContent = "Saniyələr içində";
    else if (seconds < 3600) bruteForceText.textContent = Math.round(seconds/60) + " dəqiqə";
    else if (seconds < 86400) bruteForceText.textContent = Math.round(seconds/3600) + " saat";
    else if (seconds < 31536000) bruteForceText.textContent = Math.round(seconds/86400) + " gün";
    else bruteForceText.textContent = Math.round(seconds/31536000) + " il";
}

function resetUI() {
    strengthBar.style.width = "0%";
    strengthText.textContent = "Zəif";
    bruteForceText.textContent = "-";
    suggestionList.innerHTML = "<li>Analiz üçün şifrə yazın...</li>";
}
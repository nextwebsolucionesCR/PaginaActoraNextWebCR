
// ==========================================
// ANTI-INSPECTION MEASURES
// ==========================================
document.addEventListener('contextmenu', (e) => {
    e.preventDefault();
}, false);

document.addEventListener('keydown', (e) => {
    // Prevent F12
    if (e.key === 'F12' || e.keyCode === 123) {
        e.preventDefault();
    }

    // Prevent Ctrl+Shift+I (DevTools), Ctrl+Shift+J (Console), Ctrl+Shift+C (Inspect)
    if (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'J' || e.key === 'C')) {
        e.preventDefault();
    }

    // Prevent Ctrl+U (View Source)
    if (e.ctrlKey && (e.key === 'U' || e.key === 'u')) {
        e.preventDefault();
    }
});

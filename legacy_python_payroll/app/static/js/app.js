// Payroll Management Global Helpers
document.addEventListener('DOMContentLoaded', () => {
    // Preserve active month in links if query param is set
    const urlParams = new URLSearchParams(window.location.search);
    const month = urlParams.get('month');
    if (month) {
        document.querySelectorAll('a[href^="/"]').forEach(a => {
            const href = a.getAttribute('href');
            if (!href.includes('month=') && !href.startsWith('/payslip/pdf/') && !href.startsWith('/export/')) {
                const separator = href.includes('?') ? '&' : '?';
                a.setAttribute('href', `${href}${separator}month=${month}`);
            }
        });
    }
});

(function () {
    var elements = document.querySelectorAll('[data-ga-event]');
    elements.forEach(function (el) {
        el.addEventListener('click', function () {
            if (typeof gtag !== 'function') return;
            gtag('event', el.dataset.gaEvent, {
                event_category: 'engagement',
                event_label: el.dataset.gaLocation || '',
                item_name: el.dataset.gaItem || ''
            });
        });
    });
})();
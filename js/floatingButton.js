(function () {
    const floatBtn = document.querySelector('.whatsapp-float');
    const contactSection = document.getElementById('kontakt');
    if (!floatBtn || !contactSection) return;

    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                floatBtn.classList.toggle('is-hidden', entry.isIntersecting);
            });
        },
        { threshold: 0.3 }
    );

    observer.observe(contactSection);
})();
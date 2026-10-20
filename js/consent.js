(function () {
    var GA_ID = 'G-SZ9KCWGFEX';
    var KEY = 'analytics-consent';

    function read() { try { return localStorage.getItem(KEY); } catch (e) { return null; } }
    function write(value) { try { localStorage.setItem(KEY, value); } catch (e) { } }

    function afterLoad(fn) {
        if (document.readyState === 'complete') fn();
        else window.addEventListener('load', fn);
    }

    function loadAnalytics() {
        window['ga-disable-' + GA_ID] = false;
        if (window.__gaLoaded) return;
        window.__gaLoaded = true;

        var script = document.createElement('script');
        script.async = true;
        script.src = 'https://www.googletagmanager.com/gtag/js?id=' + GA_ID;
        document.head.appendChild(script);

        window.dataLayer = window.dataLayer || [];
        function gtag() { window.dataLayer.push(arguments); }
        window.gtag = gtag;
        gtag('js', new Date());
        gtag('config', GA_ID);
    }

    function stopAnalytics() {
        window['ga-disable-' + GA_ID] = true;
        var host = location.hostname.replace(/^www\./, '');
        var past = '=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/';
        document.cookie.split(';').forEach(function (cookie) {
            var name = cookie.split('=')[0].trim();
            if (name === '_ga' || name === '_gid' || name.indexOf('_ga_') === 0) {
                document.cookie = name + past;
                document.cookie = name + past + '; domain=' + location.hostname;
                document.cookie = name + past + '; domain=.' + host;
            }
        });
    }

    function showBanner() {
        var banner = document.getElementById('consent-banner');
        if (banner) { banner.hidden = false; return; }

        banner = document.createElement('div');
        banner.id = 'consent-banner';
        banner.className = 'consent';
        banner.setAttribute('role', 'dialog');
        banner.setAttribute('aria-label', 'Kolačići');
        banner.innerHTML =
            '<p class="consent-text">Koristimo Google Analytics kako bismo razumeli kako se sajt koristi i poboljšali vaše korisničko iskustvo. ' +
            'Kolačići za analitiku se postavljaju samo ako date pristanak.</p>' +
            '<div class="consent-actions">' +
            '<button type="button" class="consent-btn" data-consent="denied">Odbijam</button>' +
            '<button type="button" class="consent-btn" data-consent="granted">Prihvatam</button>' +
            '</div>';

        banner.addEventListener('click', function (event) {
            var button = event.target.closest('[data-consent]');
            if (!button) return;
            var choice = button.dataset.consent;
            write(choice);
            banner.hidden = true;
            if (choice === 'granted') loadAnalytics(); else stopAnalytics();
        });

        if (document.querySelector('link[href$="consent.css"]')) {
            document.body.appendChild(banner);
        } else {
            css.onload = css.onerror = function () { document.body.appendChild(banner); };
            document.head.appendChild(css);
        }
    }

    var saved = read();
    if (saved === 'granted') afterLoad(loadAnalytics);
    else if (saved !== 'denied') showBanner();

    document.addEventListener('click', function (event) {
        if (event.target.closest('[data-cookie-settings]')) showBanner();
    });

    document.addEventListener('click', function (event) {
        var el = event.target.closest('[data-ga-event]');
        if (!el) return;
        if (typeof window.gtag !== 'function') return;

        window.gtag('event', el.dataset.gaEvent, {
            event_category: 'engagement',
            event_label: el.dataset.gaLocation || '',
            item_name: el.dataset.gaItem || ''
        });
    });
})();
(function () {
    'use strict';
    function init() {
        var root = document.querySelector('.w8');
        if (!root || root.classList.contains('w8-wishes-page')) return;
        var reduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        var scale = root.getBoundingClientRect().width / 320;
        var envelope = root.querySelectorAll('.w8-envelope');
        var reveals = root.querySelectorAll('[data-reveal]');
        var supportsMotion = typeof root.animate === 'function';
        function show(element) { element.style.opacity = '1'; }
        if (!reduced && supportsMotion) {
            root.classList.add('w8-motion');
            // Source SBS: hold 1s, move 3s; the lower envelope then fades for 1s.
            var upperFrames = [{ transform: 'translate(0,0)', offset: 0 }, { transform: 'translate(0,0)', offset: .25 }, { transform: 'translate(0,' + (-490 * scale) + 'px)', offset: 1 }];
            var lowerFrames = [{ transform: 'translate(0,0)', opacity: 1, offset: 0 }, { transform: 'translate(0,0)', opacity: 1, offset: .2 }, { transform: 'translate(' + (-6 * scale) + 'px,' + (377 * scale) + 'px)', opacity: 1, offset: .8 }, { transform: 'translate(' + (-6 * scale) + 'px,' + (377 * scale) + 'px)', opacity: 0, offset: 1 }];
            var imageReady = Array.from(root.querySelectorAll('.w8-envelope-top,.w8-envelope-bottom,.w8-envelope-seal img')).map(function (image) { return image.decode ? image.decode().catch(function () {}) : Promise.resolve(); });
            Promise.all(imageReady).then(function () {
                envelope.forEach(function (element) {
                    var isLower = element.classList.contains('w8-envelope-bottom');
                    var animation = element.animate(isLower ? lowerFrames : upperFrames, { duration: isLower ? 5000 : 4000, easing: 'linear', fill: 'forwards' });
                    animation.onfinish = function () { element.style.display = 'none'; animation.cancel(); };
                });
            }).catch(function () { envelope.forEach(function (element) { element.style.display = 'none'; }); });
            function reveal(element) {
                var kind = element.dataset.reveal;
                var distance = Number(element.dataset.distance || 100) * scale;
                var from = 'translate(0,0)';
                if (kind === 'up') from = 'translateY(' + distance + 'px)';
                if (kind === 'left') from = 'translateX(' + distance + 'px)';
                if (kind === 'right') from = 'translateX(' + (-distance) + 'px)';
                if (kind === 'zoom') from = 'scale(' + Number(element.dataset.scale || 0) + ')';
                var animation = element.animate([{ opacity: 0, transform: from }, { opacity: 1, transform: 'translate(0,0) scale(1)' }], { duration: Number(element.dataset.duration || 5) * 1000, delay: Number(element.dataset.delay || 0) * 1000, easing: 'cubic-bezier(.19,1,.22,1)', fill: 'both' });
                animation.onfinish = function () { show(element); animation.cancel(); };
            }
            if ('IntersectionObserver' in window) {
                function observerFor(margin) { return new IntersectionObserver(function (entries, observer) { entries.forEach(function (entry) { if (entry.isIntersecting) { observer.unobserve(entry.target); reveal(entry.target); } }); }, { threshold: 0, rootMargin: margin }); }
                var normalObserver = observerFor('0px');
                var zoomObserver = observerFor('0px 0px -50px 0px');
                reveals.forEach(function (element) { (element.dataset.duration === '10' ? zoomObserver : normalObserver).observe(element); });
            } else reveals.forEach(show);
        } else {
            envelope.forEach(function (element) { element.style.display = 'none'; });
            reveals.forEach(show);
        }
        root.addEventListener('focusin', function (event) { var element = event.target.closest('[data-reveal]'); if (element) { if (element.getAnimations) element.getAnimations().forEach(function (animation) { animation.finish(); }); show(element); } });
        var musicShortcut = root.querySelector('.w8-music-shortcut');
        if (musicShortcut) musicShortcut.addEventListener('click', function () { var playing = window.audio && !window.audio.paused; var button = document.querySelector(playing ? '.w8-dock .sound-off' : '.w8-dock .sound-on'); if (button) button.click(); });
        var timer = root.querySelector('.w8-countdown');
        if (timer) {
            var deadline = Number(timer.dataset.deadline);
            var interval;
            function update() {
                var remaining = Math.max(0, Math.floor((deadline - Date.now()) / 1000));
                var values = { days: Math.floor(remaining / 86400), hours: Math.floor(remaining / 3600) % 24, minutes: Math.floor(remaining / 60) % 60, seconds: remaining % 60 };
                Object.keys(values).forEach(function (unit) { var element = timer.querySelector('[data-unit="' + unit + '"]'); if (element) element.textContent = String(values[unit]).padStart(2, '0'); });
                if (remaining === 0 && interval) clearInterval(interval);
                return remaining > 0;
            }
            if (Number.isFinite(deadline) && update()) interval = setInterval(update, 1000);
        }
    }
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
    else init();
})();

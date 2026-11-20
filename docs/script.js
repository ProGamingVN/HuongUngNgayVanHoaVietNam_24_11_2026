/* =========================================================
   Ngày Văn hóa Việt Nam 24/11 – script dùng chung
   (menu di động, tiến độ đọc, hiện dần, xem ảnh phóng to, đếm ngày)
   ========================================================= */
(function () {
    'use strict';

    var d = document, w = window;
    function $(s, c) { return (c || d).querySelector(s); }
    function $$(s, c) { return Array.prototype.slice.call((c || d).querySelectorAll(s)); }

    /* ---------- Loader (hiện lần đầu, tự tắt, không chờ ảnh nặng) ---------- */
    var loader = $('.page-loader');
    function hideLoader() {
        if (!loader || loader.classList.contains('hide')) return;
        loader.classList.add('hide');
        setTimeout(function () {
            d.documentElement.classList.remove('loading');
            loader.style.display = 'none';
        }, 600);
    }
    if (loader) {
        setTimeout(hideLoader, 1000);
        setTimeout(hideLoader, 2500); // dự phòng
    }

    /* ---------- Menu điện thoại ---------- */
    var toggle = $('.nav-toggle'), menu = $('#menu');
    function closeMenu() {
        if (!toggle || !menu) return;
        menu.classList.remove('open');
        toggle.classList.remove('active');
        toggle.setAttribute('aria-expanded', 'false');
    }
    if (toggle && menu) {
        toggle.addEventListener('click', function () {
            var open = menu.classList.toggle('open');
            toggle.classList.toggle('active', open);
            toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
        });
        d.addEventListener('click', function (e) {
            if (!menu.contains(e.target) && !toggle.contains(e.target)) closeMenu();
        });
        w.addEventListener('resize', closeMenu);
    }

    /* ---------- Cuộn: thanh tiến độ, bóng header, nút lên đầu trang ---------- */
    var header = $('.site-header'), bar = $('.progress'), topBtn = $('.scroll-top'), ticking = false;
    function onScroll() {
        var y = w.pageYOffset || d.documentElement.scrollTop;
        var max = d.documentElement.scrollHeight - d.documentElement.clientHeight;
        if (bar) bar.style.width = (max > 0 ? Math.min(100, (y / max) * 100) : 0) + '%';
        if (header) header.classList.toggle('scrolled', y > 20);
        if (topBtn) topBtn.classList.toggle('visible', y > 400);
        ticking = false;
    }
    w.addEventListener('scroll', function () {
        if (!ticking) { ticking = true; w.requestAnimationFrame(onScroll); }
    }, { passive: true });
    onScroll();
    if (topBtn) topBtn.addEventListener('click', function () { w.scrollTo({ top: 0, behavior: 'smooth' }); });

    /* ---------- Hiện dần khi cuộn tới ---------- */
    var reveals = $$('.reveal');
    if ('IntersectionObserver' in w) {
        var io = new IntersectionObserver(function (entries) {
            entries.forEach(function (en) {
                if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); }
            });
        }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });
        reveals.forEach(function (el) { io.observe(el); });
    } else {
        reveals.forEach(function (el) { el.classList.add('in'); });
    }

    /* ---------- Ảnh lỗi: hiện khung báo thay vì ô trống ---------- */
    $$('.gallery figure img').forEach(function (img) {
        function mark() { img.parentNode.classList.add('broken'); }
        if (img.complete && img.naturalWidth === 0) mark();
        else img.addEventListener('error', mark);
    });

    /* ---------- Xem ảnh phóng to (bấm ảnh) ---------- */
    var figs = $$('.gallery figure');
    if (figs.length) {
        var lb = d.createElement('div');
        lb.className = 'lightbox';
        lb.setAttribute('role', 'dialog');
        lb.setAttribute('aria-modal', 'true');
        lb.setAttribute('aria-label', 'Xem ảnh');
        lb.innerHTML =
            '<button class="lb-btn lb-close" aria-label="Đóng">&times;</button>' +
            '<button class="lb-btn lb-prev" aria-label="Ảnh trước">&#8249;</button>' +
            '<img alt="">' +
            '<button class="lb-btn lb-next" aria-label="Ảnh sau">&#8250;</button>' +
            '<div class="lb-count"></div>';
        d.body.appendChild(lb);

        var lbImg = $('img', lb), lbCount = $('.lb-count', lb), idx = 0, lastFocus = null;

        function show(i) {
            idx = (i + figs.length) % figs.length;
            var src = $('img', figs[idx]);
            lbImg.src = src.getAttribute('src');
            lbImg.alt = src.getAttribute('alt') || '';
            lbCount.textContent = (idx + 1) + ' / ' + figs.length;
        }
        function open(i) {
            lastFocus = d.activeElement;
            show(i);
            lb.classList.add('open');
            d.body.style.overflow = 'hidden';
            $('.lb-close', lb).focus();
        }
        function close() {
            lb.classList.remove('open');
            d.body.style.overflow = '';
            lbImg.removeAttribute('src');
            if (lastFocus) lastFocus.focus();
        }

        figs.forEach(function (f, i) {
            f.setAttribute('tabindex', '0');
            f.setAttribute('role', 'button');
            f.setAttribute('aria-label', 'Phóng to ảnh ' + (i + 1));
            f.addEventListener('click', function () { open(i); });
            f.addEventListener('keydown', function (e) {
                if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(i); }
            });
        });

        $('.lb-close', lb).addEventListener('click', close);
        $('.lb-prev', lb).addEventListener('click', function () { show(idx - 1); });
        $('.lb-next', lb).addEventListener('click', function () { show(idx + 1); });
        lb.addEventListener('click', function (e) { if (e.target === lb) close(); });
        d.addEventListener('keydown', function (e) {
            if (!lb.classList.contains('open')) return;
            if (e.key === 'Escape') close();
            else if (e.key === 'ArrowLeft') show(idx - 1);
            else if (e.key === 'ArrowRight') show(idx + 1);
        });

        // Vuốt trái/phải trên điện thoại
        var x0 = null;
        lb.addEventListener('touchstart', function (e) { x0 = e.changedTouches[0].clientX; }, { passive: true });
        lb.addEventListener('touchend', function (e) {
            if (x0 === null) return;
            var dx = e.changedTouches[0].clientX - x0;
            if (Math.abs(dx) > 50) show(dx < 0 ? idx + 1 : idx - 1);
            x0 = null;
        }, { passive: true });
    }

    /* ---------- Đếm ngược tới 24/11 ---------- */
    var cd = $('#countdown');
    if (cd) {
        var now = new Date(), y = now.getFullYear();
        var today = new Date(y, now.getMonth(), now.getDate());
        var target = new Date(y, 10, 24);
        var diff = Math.round((target - today) / 864e5);
        if (diff === 0) {
            cd.innerHTML = 'Hôm nay là <b>Ngày Văn hóa Việt Nam</b> &ndash; 24/11';
        } else {
            if (diff < 0) { target = new Date(y + 1, 10, 24); diff = Math.round((target - today) / 864e5); }
            cd.innerHTML = 'Còn <b>' + diff + '</b> ngày nữa đến Ngày Văn hóa Việt Nam (24/11/' + target.getFullYear() + ')';
        }
    }
})();

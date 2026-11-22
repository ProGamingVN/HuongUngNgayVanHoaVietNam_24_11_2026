/* =========================================================
   Ngày Văn hóa Việt Nam 24/11 – script dùng chung
   (menu di động, tiến độ đọc, hiện dần, xem ảnh phóng to, đếm ngày)
   ========================================================= */
(function () {
    'use strict';

    var d = document, w = window;
    function $(s, c) { return (c || d).querySelector(s); }
    function $$(s, c) { return Array.prototype.slice.call((c || d).querySelectorAll(s)); }

    d.addEventListener('click', function (e) {
        var target = e.target;
        while (target && target !== d) {
            if (target.tagName === 'A' && target.target === '_blank') {
                if (!w.confirm('Bạn sắp mở một trang web bên ngoài. Bạn có muốn tiếp tục không?')) {
                    e.preventDefault();
                }
                return;
            }
            target = target.parentNode;
        }
    });

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
    /* Nguồn ảnh bắt đầu từ trang chủ, rồi tiếp tục từ Bản sắc trở đi. */
    var IMAGE_SOURCES = {
        'image31.jpg': 'https://es.pinterest.com/pin/920352873852559892/',
        'image27.jpg': 'https://chus.vn/tat-tan-tat-ve-qua-tang-qua-bieu-quoc-khanh-2-9/',
        'image33.jpg': 'https://share.google/3seut8r4mrr3EjyIt',
        'image8.jpg': 'https://share.google/XUvXNRbig40jyVZd3',
        'image19.jpg': 'https://share.google/vcdQv4mHgzMuAFUIs',
        'image6.jpg': [
            'https://share.google/9TTy5UmFUKHWGm3LF',
            'https://www.pinterest.com/pin/5488830782244320/'
        ],
        'image17.jpg': 'https://share.google/3wjNChQCe07VphXXl',
        'image4.jpg': 'https://kinhte.congthuong.vn/y-nghia-nhung-mon-an-truyen-thong-ngay-tet-nguyen-dan-239851.html',
        'image23.jpg': 'https://share.google/07BgWZYUzjdUfUyxN',
        'image26.jpg': 'https://share.google/hF7pHfcS6m43L4smE',
        'image25.jpg': 'https://share.google/peSYMIaaC2lrm58zl',
        'image20.jpg': 'https://share.google/uUGns9fDbaxY2Ffso',
        'image1.jpg': 'https://share.google/iwFJWKHd0AiQurhEd',
        'image12.jpg': 'https://share.google/Aw1PuJZBlIt0hgPwB',
        'image15.jpg': 'https://share.google/PMWFFMYg0Ed9RnNA2',
        'image32.jpg': 'https://heritagevietnamairlines.com/tag/lang-viet/',
        'image29.jpg': 'https://share.google/HUlpt2Bgyx78DrJJf',
        'image7.jpg': 'https://share.google/IsZFcnzpZ7W58ds2N',
        'image28.jpg': 'https://share.google/A237XOOjNFo4udJVx',
        'image30.jpg': 'https://share.google/UQyenIQq5sSK4CvXR',
        'image14.jpg': 'https://share.google/g490YKnJRa53ni8oG',
        'image18.jpg': 'https://share.google/COvuC6R3MDPwjuu8I',
        'image10.jpg': 'https://share.google/PeZzhKXwGt1ZPhAp0',
        'new1.jpg': 'https://share.google/O23En4URDkzAOwB7b',
        'new2.jpg': 'https://share.google/YzNFYisz8WJmZo9Ze',
        'new3.jpg': 'https://share.google/FVlS8BncSZgP3F6ng',
        'new4.jpg': 'https://share.google/ucsFUy1ztVd0oVsLu',
        'new5.jpg': 'https://share.google/UnYml4St8teUSIXEf',
        'image22.jpg': 'https://share.google/TE8dqlwfpxjRolPJk',
        'image9.jpg': 'https://share.google/x0wJUpjKmI3oQsJTf',
        'image3.jpg': 'https://share.google/8qO2N1LuFLvoDvgou',
        'image24.jpg': 'https://share.google/PGvydcWBVr7pFlJ6n',
        'image5.jpg': 'https://share.google/BYltMEDgihjzqS0ez',
        'image16.jpg': 'https://share.google/P4Pje5Bxy2lbcEPOs'
    };

    var figs = $$('.gallery figure, .hero-figure, .banner');
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
            '<div class="lb-details"><div class="lb-caption"></div>' +
            '<div class="lb-sources"></div></div>' +
            '<button class="lb-btn lb-next" aria-label="Ảnh sau">&#8250;</button>' +
            '<div class="lb-count"></div>';
        d.body.appendChild(lb);

        var lbImg = $('img', lb), lbCount = $('.lb-count', lb), lbCaption = $('.lb-caption', lb),
            lbSources = $('.lb-sources', lb), idx = 0, lastFocus = null;

        function show(i) {
            idx = (i + figs.length) % figs.length;
            var src = $('img', figs[idx]);
            lbImg.src = src.getAttribute('src');
            lbImg.alt = src.getAttribute('alt') || '';
            lbCount.textContent = (idx + 1) + ' / ' + figs.length;
            var file = (src.getAttribute('src') || '').split('/').pop();
            var source = figs[idx].hasAttribute('data-no-source') ? '' :
                (figs[idx].getAttribute('data-src') || IMAGE_SOURCES[file] || '');
            var links = Array.isArray(source) ? source : (source ? [source] : []);
            lbCaption.textContent = src.getAttribute('alt') || file;
            while (lbSources.firstChild) lbSources.removeChild(lbSources.firstChild);
            links.forEach(function (link) {
                var row = d.createElement('div');
                var label = d.createElement('span');
                var anchor = d.createElement('a');
                row.className = 'lb-source-row';
                label.className = 'lb-source-label';
                label.textContent = 'Nguồn:';
                anchor.className = 'lb-src';
                anchor.href = link;
                anchor.target = '_blank';
                anchor.rel = 'noopener noreferrer';
                anchor.textContent = link;
                row.appendChild(label);
                row.appendChild(anchor);
                lbSources.appendChild(row);
            });
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
            var img = $('img', f);
            var file = (img.getAttribute('src') || '').split('/').pop();
            if (!f.hasAttribute('data-no-caption')) {
                var caption = d.createElement(f.classList.contains('banner') ? 'div' : 'figcaption');
                var title = d.createElement('span');
                caption.className = 'gallery-caption';
                title.className = 'gallery-title';
                title.textContent = img.getAttribute('alt') || file;
                caption.appendChild(title);
                f.appendChild(caption);
            }
            f.setAttribute('tabindex', '0');
            f.setAttribute('role', 'button');
            f.setAttribute('aria-label', (img.getAttribute('alt') || 'Ảnh ' + (i + 1)) + '. Bấm để phóng to.');
            f.addEventListener('click', function () { open(i); });
            f.addEventListener('keydown', function (e) {
                if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(i); }
            });
        });

        $$('.gallery').forEach(function (gallery) {
            var hasSource = $$('.gallery figure', gallery).some(function (figure) {
                var img = $('img', figure);
                var file = (img.getAttribute('src') || '').split('/').pop();
                return figure.getAttribute('data-src') || IMAGE_SOURCES[file];
            });
            if (!hasSource) return;
            var note = d.createElement('p');
            note.className = 'note gallery-source-note';
            note.textContent = 'Bấm vào ảnh để xem nguồn.';
            gallery.parentNode.insertBefore(note, gallery.nextSibling);
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

/* ============================================================
   script.js — ملف الجافاسكريبت الرئيسي لموقع هبوب للسياحة
   Haboob Travel Agency — Main JavaScript File
   Web Technology 1 Project | 1447H

   المحتويات:
   1.  شريط التنقل — Navbar (تمييز الرابط النشط + القائمة الجوال)
   2.  Lightbox — عرض الصور مكبّرة في المعرض
   3.  التحقق من نموذج الحجز — Booking Form Validation
   4.  التحقق من نموذج التواصل — Contact Form Validation
   5.  الفلترة في صفحة الوجهات — Destination Filter
   6.  حاسبة الأسعار — Price Calculator
   7.  اختيار صفوف جدول المقارنة — Table Row Selection
   ============================================================ */


/* ============================================================
   1. شريط التنقل (Navbar)
   ============================================================ */

/**
 * تمييز الرابط النشط بناءً على الصفحة الحالية
 * Highlights the current page's nav link
 */
function setActiveNavLink() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('.navbar-links a, .navbar-mobile a');

    navLinks.forEach(function(link) {
        const linkPage = link.getAttribute('href');
        if (linkPage === currentPage) {
            link.classList.add('active');
        }
    });
}

/**
 * فتح وإغلاق القائمة الجوال
 * Toggles the mobile navigation menu
 */
function setupMobileMenu() {
    const toggleBtn  = document.getElementById('navToggle');
    const mobileMenu = document.getElementById('navMobile');

    if (!toggleBtn || !mobileMenu) return; // إذا لم توجد العناصر نخرج

    toggleBtn.addEventListener('click', function() {
        mobileMenu.classList.toggle('open');
    });

    // إغلاق القائمة عند النقر على أي رابط بداخلها
    mobileMenu.querySelectorAll('a').forEach(function(link) {
        link.addEventListener('click', function() {
            mobileMenu.classList.remove('open');
        });
    });
}

/**
 * إضافة ظل للشريط عند التمرير
 * Adds shadow to navbar on scroll
 */
function setupNavbarScroll() {
    const navbar = document.querySelector('.navbar');
    if (!navbar) return;

    window.addEventListener('scroll', function() {
        if (window.scrollY > 30) {
            navbar.style.boxShadow = '0 4px 20px rgba(92,61,46,0.15)';
        } else {
            navbar.style.boxShadow = '0 2px 8px rgba(92,61,46,0.08)';
        }
    });
}


/* ============================================================
   2. Lightbox (معرض الصور)
   يفتح صورة مكبّرة عند النقر عليها
   ============================================================ */

/**
 * يُعِدّ وظيفة الـ Lightbox لمعرض الصور
 * Sets up image lightbox functionality
 */
function setupLightbox() {
    const lightbox     = document.getElementById('lightbox');
    const lightboxImg  = document.getElementById('lightboxImg');
    const lightboxName = document.getElementById('lightboxName');
    const lightboxSub  = document.getElementById('lightboxSub');
    const closeBtn     = document.getElementById('lightboxClose');
    const cards        = document.querySelectorAll('.gallery-card');

    if (!lightbox) return;

    // فتح الـ lightbox عند النقر على أي بطاقة
    cards.forEach(function(card) {
        card.addEventListener('click', function() {
            const name     = card.getAttribute('data-name');
            const region   = card.getAttribute('data-region');
            const gradient = card.getAttribute('data-gradient');
            const icon     = card.getAttribute('data-icon');

            // نضع محتوى الـ lightbox
            lightboxImg.style.background = gradient;
            lightboxImg.querySelector('.lb-icon').textContent = icon;
            lightboxName.textContent = name;
            lightboxSub.textContent  = region;

            lightbox.classList.add('open');
            document.body.style.overflow = 'hidden'; // نمنع التمرير خلف الـ lightbox
        });
    });

    // إغلاق الـ lightbox بالنقر على زر الإغلاق
    if (closeBtn) {
        closeBtn.addEventListener('click', closeLightbox);
    }

    // إغلاق الـ lightbox بالنقر خارج الصندوق
    lightbox.addEventListener('click', function(e) {
        if (e.target === lightbox) {
            closeLightbox();
        }
    });

    // إغلاق الـ lightbox بمفتاح Escape
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeLightbox();
        }
    });
}

/** يغلق الـ Lightbox */
function closeLightbox() {
    const lightbox = document.getElementById('lightbox');
    if (lightbox) {
        lightbox.classList.remove('open');
        document.body.style.overflow = ''; // نعيد التمرير
    }
}


/* ============================================================
   3. التحقق من نموذج الحجز (Booking Form Validation)
   ============================================================ */

/**
 * يتحقق من الحقل ويعرض رسالة الخطأ إذا كان فارغاً
 * @param {string} fieldId — معرّف الحقل
 * @param {string} errorMsg — رسالة الخطأ
 * @returns {boolean} — true إذا كان الحقل صحيحاً
 */
function validateField(fieldId, errorMsg) {
    const group = document.querySelector('[data-field="' + fieldId + '"]');
    const input = document.getElementById(fieldId);

    if (!group || !input) return true;

    const value = input.value.trim();

    if (value === '') {
        group.classList.add('has-error');
        group.querySelector('.error-msg').textContent = errorMsg || 'هذا الحقل مطلوب';
        return false;
    }

    group.classList.remove('has-error');
    return true;
}

/**
 * يتحقق من صحة البريد الإلكتروني باستخدام Regex
 * Validates email format using a regular expression
 */
function validateEmail(fieldId) {
    const group = document.querySelector('[data-field="' + fieldId + '"]');
    const input = document.getElementById(fieldId);

    if (!group || !input) return true;

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // نمط البريد الإلكتروني
    const value = input.value.trim();

    if (!emailPattern.test(value)) {
        group.classList.add('has-error');
        group.querySelector('.error-msg').textContent = 'يرجى إدخال بريد إلكتروني صحيح';
        return false;
    }

    group.classList.remove('has-error');
    return true;
}

/**
 * يتحقق من صحة رقم الهاتف (يبدأ بـ +966 أو 05)
 * Validates Saudi phone number format
 */
function validatePhone(fieldId) {
    const group = document.querySelector('[data-field="' + fieldId + '"]');
    const input = document.getElementById(fieldId);

    if (!group || !input) return true;

    const phonePattern = /^(\+966|05)\d{8,}$/;
    const value = input.value.trim().replace(/\s/g, '');

    if (!phonePattern.test(value)) {
        group.classList.add('has-error');
        group.querySelector('.error-msg').textContent = 'الرقم يجب أن يبدأ بـ +966 أو 05';
        return false;
    }

    group.classList.remove('has-error');
    return true;
}

/**
 * يُعِدّ نموذج الحجز — التحقق والإرسال
 * Sets up booking form validation and submission
 */
function setupBookingForm() {
    const form       = document.getElementById('bookingForm');
    const successBox = document.getElementById('bookingSuccess');
    const refSpan    = document.getElementById('bookingRef');

    if (!form) return;

    // عند تغيير الحقل يُزيل رسالة الخطأ
    form.querySelectorAll('input, select, textarea').forEach(function(el) {
        el.addEventListener('input', function() {
            const group = el.closest('[data-field]');
            if (group) group.classList.remove('has-error');
        });
    });

    // تحديث الوجهات عند تغيير المنطقة المناخية
    const realmSelect = document.getElementById('realm');
    const destSelect  = document.getElementById('destination');

    if (realmSelect && destSelect) {
        realmSelect.addEventListener('change', function() {
            const destinations = {
                breezes: ['الباحة (Al-Baha)',    'الطائف (Taif)'],
                rainy:   ['أبها (Abha)',          'الأحساء (Al-Ahsa)'],
                snowy:   ['تبوك — جبل اللوز (Tabuk)', 'طريف (Turaif)']
            };

            destSelect.innerHTML = '<option value="">اختر الوجهة...</option>';

            const options = destinations[this.value] || [];
            options.forEach(function(dest) {
                const opt = document.createElement('option');
                opt.value = dest;
                opt.textContent = dest;
                destSelect.appendChild(opt);
            });
        });
    }

    // إرسال النموذج
    form.addEventListener('submit', function(e) {
        e.preventDefault(); // نمنع الإرسال الافتراضي للمتصفح

        // التحقق من جميع الحقول
        const checks = [
            validateField('fullName', 'يرجى إدخال اسمك الكامل'),
            validateEmail('email'),
            validatePhone('phone'),
            validateField('travelers', 'يرجى تحديد عدد المسافرين'),
            validateField('realm', 'يرجى اختيار المنطقة المناخية'),
            validateField('destination', 'يرجى اختيار الوجهة'),
            validateField('travelDate', 'يرجى اختيار تاريخ السفر')
        ];

        // إذا اجتازت جميع الفحوصات
        const allValid = checks.every(function(result) { return result === true; });

        if (allValid) {
            // توليد رقم حجز عشوائي
            const ref = Math.floor(100000 + Math.random() * 900000).toString();
            if (refSpan) refSpan.textContent = '#' + ref;

            // إخفاء النموذج وإظهار رسالة النجاح
            form.style.display = 'none';
            if (successBox) successBox.classList.add('visible');

            // التمرير لأعلى لرؤية رسالة النجاح
            successBox.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    });
}


/* ============================================================
   4. التحقق من نموذج التواصل (Contact Form)
   ============================================================ */

function setupContactForm() {
    const form       = document.getElementById('contactForm');
    const successBox = document.getElementById('contactSuccess');

    if (!form) return;

    form.querySelectorAll('input, select, textarea').forEach(function(el) {
        el.addEventListener('input', function() {
            const group = el.closest('[data-field]');
            if (group) group.classList.remove('has-error');
        });
    });

    form.addEventListener('submit', function(e) {
        e.preventDefault();

        const checks = [
            validateField('contactName', 'يرجى إدخال اسمك'),
            validateEmail('contactEmail'),
            validateField('contactSubject', 'يرجى اختيار الموضوع'),
            validateField('contactMessage', 'يرجى كتابة رسالتك')
        ];

        const allValid = checks.every(function(r) { return r === true; });

        if (allValid) {
            form.style.display = 'none';
            if (successBox) successBox.classList.add('visible');
        }
    });
}


/* ============================================================
   5. فلترة الوجهات (Destination Filter)
   ============================================================ */

/**
 * يُعِدّ أزرار الفلترة لصفحة الوجهات
 * Sets up the category filter buttons on the Destinations page
 */
function setupDestinationFilter() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const destCards  = document.querySelectorAll('.dest-card');

    if (filterBtns.length === 0) return;

    filterBtns.forEach(function(btn) {
        btn.addEventListener('click', function() {
            // تغيير الزر النشط
            filterBtns.forEach(function(b) { b.classList.remove('active'); });
            this.classList.add('active');

            const category = this.getAttribute('data-category'); // 'all', 'rainy', 'snowy', 'breezy'

            // إظهار أو إخفاء البطاقات
            destCards.forEach(function(card) {
                if (category === 'all' || card.getAttribute('data-category') === category) {
                    card.style.display = 'block';
                    // تأثير ظهور خفيف
                    card.style.animation = 'none';
                    card.offsetHeight; // تفعيل إعادة الرسم
                    card.style.animation = 'fadeInUp 0.4s ease';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });
}


/* ============================================================
   6. حاسبة الأسعار (Price Calculator)
   ============================================================ */

/**
 * يُعِدّ حاسبة الأسعار في صفحة المقارنة
 * Sets up the price calculator on the Compare page
 */
function setupPriceCalculator() {
    const packageSelect  = document.getElementById('calcPackage');
    const travelersInput = document.getElementById('calcTravelers');
    const totalDisplay   = document.getElementById('calcTotal');
    const calcNote       = document.getElementById('calcNote');
    const calcBtn        = document.getElementById('calcBookBtn');

    if (!packageSelect || !travelersInput || !totalDisplay) return;

    // أسعار الباقات
    const prices = {
        'rainy-abha':   450,
        'snowy-tabuk':  750,
        'breezy-albaha': 550,
        'misty-taif':   350
    };

    function calculateTotal() {
        const packageKey = packageSelect.value;
        const travelers  = parseInt(travelersInput.value) || 1;

        if (packageKey && prices[packageKey]) {
            const pricePerPerson = prices[packageKey];
            const total = pricePerPerson * travelers;

            totalDisplay.textContent = total.toLocaleString('ar-SA') + ' ريال';

            if (calcNote) {
                calcNote.textContent = travelers + ' مسافر × ' + pricePerPerson + ' ريال';
            }

            if (calcBtn) {
                calcBtn.style.display = 'block';
            }
        } else {
            totalDisplay.textContent = '— ريال';
            if (calcNote) calcNote.textContent = '';
            if (calcBtn) calcBtn.style.display = 'none';
        }
    }

    packageSelect.addEventListener('change', calculateTotal);
    travelersInput.addEventListener('input', calculateTotal);
}


/* ============================================================
   7. اختيار صفوف جدول المقارنة (Table Row Selection)
   ============================================================ */

/**
 * يُعِدّ وظيفة تظليل الصف عند النقر عليه
 * Allows the user to highlight a row in the comparison table
 */
function setupTableSelection() {
    const rows = document.querySelectorAll('.compare-table tbody tr');

    rows.forEach(function(row) {
        row.addEventListener('click', function() {
            // إزالة التظليل من الصف السابق
            rows.forEach(function(r) { r.classList.remove('selected'); });
            // إضافة التظليل للصف الذي تم النقر عليه
            this.classList.add('selected');
        });
    });
}


/* ============================================================
   تشغيل جميع الوظائف عند تحميل الصفحة
   Run all functions when the page loads (DOMContentLoaded)
   ============================================================ */
document.addEventListener('DOMContentLoaded', function() {
    setActiveNavLink();        // تمييز الرابط النشط
    setupMobileMenu();         // قائمة الجوال
    setupNavbarScroll();       // ظل الشريط عند التمرير
    setupLightbox();           // معرض الصور
    setupBookingForm();        // نموذج الحجز
    setupContactForm();        // نموذج التواصل
    setupDestinationFilter();  // فلترة الوجهات
    setupPriceCalculator();    // حاسبة الأسعار
    setupTableSelection();     // اختيار صفوف الجدول
});

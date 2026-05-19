$(function () {
    $(".sub").hide();
    $(".gnb>li:last-child").mouseenter(function () {
        $(this).children(".sub").stop().fadeIn(400);
    })
    $(".gnb>li:last-child").mouseleave(function () {
        $(this).children(".sub").stop().fadeOut(400);
    })
    let current = 0;
    const slides = $('.slide');
    const total = slides.length;

    const cursor = document.querySelector('.custom-cursor');
    // 1. querySelectorAll을 사용하고, 클래스 사이에 쉼표(,)를 넣어줍니다.
    const targetSections = document.querySelectorAll('.section03_left, .section03_right');

    // 마우스 움직임 (이건 그대로 두시면 됩니다)
    document.addEventListener('mousemove', (e) => {
        cursor.style.left = `${e.clientX}px`;
        cursor.style.top = `${e.clientY}px`;
    });

    // 2. 여러 개의 섹션이므로 forEach를 사용해 각각 이벤트를 걸어줍니다.
    targetSections.forEach((section) => {
        section.addEventListener('mouseenter', () => {
            cursor.classList.add('active');
        });

        section.addEventListener('mouseleave', () => {
            cursor.classList.remove('active');
        });
    });

    $(".fq_wrap> ul> li").click(function () {
        $(this).children(".text_info").slideToggle();
        $(this).siblings().children(".text_info").slideUp();
    });
    $(".fq_wrap> ul> li").click(function () {
        $(this).toggleClass("turn");

        if ($(this).hasClass("turn") === true) {
            $(this).siblings().removeClass("turn");

        }

    });
    var swiper = new Swiper(".mySwiper4", {
        effect: "coverflow",
        grabCursor: true,
        centeredSlides: true,
        slidesPerView: "auto",
        coverflowEffect: {
            rotate: 50,
            stretch: 0,
            depth: 100,
            modifier: 1,
            slideShadows: true,
        },
        pagination: {
            el: ".swiper-pagination",
        },
    });

})

$(window).scroll(function () {
    var height = $(window).scrollTop();
    if (height > 1080) {//아이콘이 나타나길 원하는 높이를 설정하세요
        $('.top').fadeIn();//나타날 아이콘 클래스 수정!
    } else {
        $('.top').fadeOut();//나타날 아이콘 클래스 수정!
    }



});

var didScroll;
var lastScrollTop = 0;
var delta = 5;
var navbarHeight = $('#header_wrap').outerHeight();

$(window).scroll(function (event) {
    didScroll = true;
});

setInterval(function () {
    if (didScroll) {
        hasScrolled();
        didScroll = false;
    }
}, 250);

function hasScrolled() {
    var st = $(this).scrollTop();

    // Make sure they scroll more than delta
    if (Math.abs(lastScrollTop - st) <= delta)
        return;

    // If they scrolled down and are past the navbar, add class .nav-up.
    // This is necessary so you never see what is "behind" the navbar.
    if (st > lastScrollTop && st > navbarHeight) {
        // Scroll Down
        $('#header_wrap').removeClass('nav-down').addClass('nav-up');
    } else {
        // Scroll Up
        if (st + $(window).height() < $(document).height()) {
            $('#header_wrap').removeClass('nav-up').addClass('nav-down');
        }
    }

    lastScrollTop = st;
};
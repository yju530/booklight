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

// sub01 호버 시 이미지가 커지는 슬라이드
$(function () {

    var winW = $(".mainviewcont").outerWidth(),
        target = $('.main_visual .visual'),
        target2 = $('.main_visual .visual_view'),
        textBox = target.find('.text_wrap'),
        length = 4,//박스 갯수
        idx = 0,
        css = [],
        ease = "easeInOutQuint",
        time = 1000;

    target2.find('.viewbg_wrap').each(function (e) {
        css.push({ 'width': 100 / length + '%', 'left': e * (100 / length) + '%', 'left2': -e * 100 + '%' });
        $(this).css({ 'width': css[e].width, 'left': css[e].left })
            .find('.viewbg').css({ 'width': winW, 'left': css[e].left2 });
    });

    target.find('>a').on("mouseenter", function () {
        idx = $(this).index();
        $(this).addClass('on').siblings().addClass('off');
        $('.main_visual .visual_view .viewbg_wrap').eq(idx).addClass('hover')
            .stop().animate({ 'left': '0', 'width': '100%' }, time, ease)
            .find('.viewbg').stop().animate({ 'left': 0 }, time, ease);
    });

    target.find('>a').on("mouseleave", function () {
        idx = $(this).index();
        $(this).removeClass('on').siblings().removeClass('off');
        $('.main_visual .visual_view .viewbg_wrap').eq(idx).removeClass('hover').stop().css({ 'width': css[idx].width, 'left': css[idx].left })
            .find('.viewbg').stop().css({ 'left': css[idx].left2 });
    });

});


// 책볕도서 section 01 슬라이드
$(document).ready(function () {
    // 슬라이더 이동 가로 너비 계산 (컨테이너 크기 대비 약 55%)
    var moveWidth = $('.slider-container').width() * 0.55;

    // 1. 다음 버튼 클릭 시 (왼쪽에서 오른쪽으로 밀려오는 애니메이션)
    $('.next-btn').on('click', function () {
        if ($('.slider-track').is(':animated')) return; // 중복 클릭 방지

        var $lastItem = $('.slider-item').last();

        /* [방향 수정] 
          왼쪽에서 오른쪽으로 밀려오는 느낌을 주기 위해 
          트랙 좌표를 미리 마이너스(-moveWidth) 영역으로 밀어둔 뒤,
          맨 뒤 아이템을 맨 앞으로 밀어 넣고 0 좌표로 부드럽게 당겨옵니다.
        */
        $('.slider-track').css('left', -moveWidth).prepend($lastItem);
        $('.slider-track').animate({ left: 0 }, 400, 'swing');
    });

    // 2. 이전 버튼 클릭 시 (오른쪽에서 왼쪽으로 밀려나가는 애니메이션)
    $('.prev-btn').on('click', function () {
        if ($('.slider-track').is(':animated')) return; // 중복 클릭 방지

        var $firstItem = $('.slider-item').first();

        /* [방향 수정] 
          오른쪽에서 왼쪽으로 화면이 흘러가게 만들기 위해 
          트랙을 마이너스(-moveWidth) 방향으로 먼저 밀어낸 후,
          애니메이션이 끝나면 첫 아이템을 뒤로 보내고 좌표를 0으로 리셋합니다.
        */
        $('.slider-track').animate({ left: -moveWidth }, 400, 'swing', function () {
            $('.slider-track').append($firstItem);
            $('.slider-track').css('left', 0);
        });
    });

    // 브라우저 창 크기가 변할 때 이동 너비 자동 재계산
    $(window).on('resize', function () {
        moveWidth = $('.slider-container').width() * 0.55;
    });
});

// 책볕도서 section02 부분 폴더 기능
$(document).ready(function () {
    $('.bookmark-btn').on('click', function (e) {
        e.preventDefault();

        var $currentIdx = $(this).parent('.folder-item').index();
        var $currentFolder = $(this).parent('.folder-item');

        // 이미 열려있는 탭을 다시 누른 거라면 리턴 처리
        if ($currentFolder.hasClass('on')) return;

        // 1. 상단 북마크 버튼 활성화 클래스 토글
        $currentFolder.addClass('on').siblings('.folder-item').removeClass('on');

        // 2. 아래쪽 컨텐츠 박스 그룹 중에서 동일한 순서의 박스에 .on을 붙여 강제 노출
        $('.folder_content').eq($currentIdx).addClass('on').siblings('.folder_content').removeClass('on');
    });
});
// 신간도서 
$(document).ready(function () {
    let isDown = false;
    let startX;
    let scrollLeft;

    // 드래그 기능을 적용할 대상 리스트 선택
    const $scrollList = $('.all_list');

    $scrollList.on('mousedown', function (e) {
        isDown = true;
        startX = e.pageX - this.offsetLeft;
        scrollLeft = this.scrollLeft;
    });

    $scrollList.on('mouseleave mouseup', function () {
        isDown = false;
    });

    $scrollList.on('mousemove', function (e) {
        if (!isDown) return; // 마우스 클릭 상태가 아니면 작동 안 함
        e.preventDefault();

        // 마우스 이동 거리 계산
        const x = e.pageX - this.offsetLeft;
        const walk = (x - startX) * 1.5; // 곱해지는 숫자가 높을수록 드래그 속도가 빨라집니다.

        // 리스트의 스크롤 위치를 실시간으로 갱신
        this.scrollLeft = scrollLeft - walk;
    });
});

// 책볕도서 section03 책 리스트
$(function () {
    $("#tap>li").click(function () {
        $(this).addClass("on").siblings().removeClass("on");
    })
    // 페이지 내의 모든 .bookname 요소를 가져옵니다.
    document.querySelectorAll('.bookname').forEach(function (element) {
        element.addEventListener('click', function (e) {
            // 링크 이동(a 태그) 효과가 작동하여 페이지가 넘어가는 것을 막고 하트만 토글되도록 처리
            e.preventDefault();

            /* 클릭할 때마다 on 클래스를 넣었다 뺐다(토글) 합니다. 
               클래스가 붙으면 CSS에 의해 채워진 하트로 변경됩니다. */
            this.classList.toggle('on');
        });
    });
});

// 책볕자리 기능
// section01 기능
$(document).ready(function () {

    // 탭 메뉴 버튼 클릭 이벤트 개시
    $('.sub02_sec01_tab_menu').on('click', '.sub02_sec01_tab_item', function () {

        // 1. 클릭된 탭 메뉴 스타일 활성화 및 기존 활성 상태 해제
        $('.sub02_sec01_tab_item').removeClass('active');
        $(this).addClass('active');

        // 2. 고유 속성 data-tab 문자열 추출
        var selectedTab = $(this).attr('data-tab');

        // 3. 전체 콘텐츠 판넬 숨김 후 클릭 대상 판넬 노출 처리
        $('.sub02_sec01_pane').removeClass('active');

        // 매칭되는 ID 영역 판넬 활성화 (#sub02_pane_all, #sub02_pane_essay 등)
        var $targetPane = $('#sub02_pane_' + selectedTab);
        $targetPane.addClass('active');

        // 4. 탭 교체 시 해당 판넬 내 도서 슬라이드 리스트를 항상 첫 번째 카드가 보이도록 강제 세팅
        $targetPane.find('.sub02_sec01_card').removeClass('active');
        $targetPane.find('.sub02_sec01_card').first().addClass('active');
    });

});

// 카운터 박스
$(document).ready(function ($) {
    $('.counter').counterUp({
        delay: 10,
        time: 1000
    });
});

// 검정 원형 배경이 있는 찜 버튼 
$(document).ready(function () {
    $('.recommend_group').on('click', '.heart_btn', function (e) {
        e.preventDefault();
        e.stopPropagation();

        var $btn = $(this);
        var $heartImg = $btn.find('img');
        var currentSrc = $heartImg.attr('src');

        // 1. 이미 활성화된 애니메이션 클래스가 있다면 중복 실행 방지를 위해 제거
        $btn.removeClass('ani-bounce');

        // 브라우저가 클래스 제거를 인식할 수 있도록 미세한 딜레이 후 클래스 및 이미지 변경
        setTimeout(function () {
            // 2. 애니메이션 클래스 추가 (통통 튀기 시작)
            $btn.addClass('ani-bounce');

            // 3. 이미지 경로 변경 (켜기 / 끄기)
            if (currentSrc.indexOf('like btn off.png') !== -1) {
                $heartImg.attr('src', '../images/like btn on.png');
            } else {
                $heartImg.attr('src', '../images/like btn off.png');
            }
        }, 5);

        // 4. 애니메이션이 끝나는 시점(0.45초 후)에 클래스를 제거해 다음 클릭을 준비함
        $btn.one('animationend webkitAnimationEnd oAnimationEnd', function () {
            $btn.removeClass('ani-bounce');
        });
    });
});

// 추천 도서 호버 시
$(function () {
    // 처음에 모든 오버레이를 숨깁니다.
    $(".img_overlay").hide();

    $(".books>li").mouseenter(function () {
        // $(this) : 현재 마우스가 올라간 그 'li' 태그만 의미합니다.
        // .find(".img_overlay") : 그 'li' 자식들 중에서 .img_overlay만 골라냅니다.
        $(this).find(".img_overlay").stop().fadeIn(200);
    });

    $(".books>li").mouseleave(function () {
        // 마우스가 떠난 그 'li' 안의 .img_overlay만 사라지게 합니다.
        $(this).find(".img_overlay").stop().fadeOut(200);
    });
});
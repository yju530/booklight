$(function () {
    // === [공통] GNB 서브메뉴 제어 ===
    $(".sub").hide();
    $(".gnb>li:last-child").mouseenter(function () {
        $(this).children(".sub").stop().fadeIn(400);
    });
    $(".gnb>li:last-child").mouseleave(function () {
        $(this).children(".sub").stop().fadeOut(400);
    });

    // === [공통] 탑버튼 및 헤더 스크롤 제어 ===
    $(window).scroll(function () {
        var height = $(window).scrollTop();
        if (height > 1080) {
            $('.top').fadeIn();
        } else {
            $('.top').fadeOut();
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
        if (Math.abs(lastScrollTop - st) <= delta) return;

        if (st > lastScrollTop && st > navbarHeight) {
            $('#header_wrap').removeClass('nav-down').addClass('nav-up');
        } else {
            if (st + $(window).height() < $(document).height()) {
                $('#header_wrap').removeClass('nav-up').addClass('nav-down');
            }
        }
        lastScrollTop = st;
    }

    // === [공통] 안내(FAQ) 아코디언 제어 ===
    $(".fq_wrap> ul> li").click(function () {
        $(this).children(".text_info").slideToggle();
        $(this).siblings().children(".text_info").slideUp();
        $(this).toggleClass("turn").siblings().removeClass("turn");
    });

    // === [공통] 커스텀 마우스 커서 이벤트 (section03 영역) ===
    const cursor = document.querySelector('.custom-cursor');
    const targetSections = document.querySelectorAll('.section03_left, .section03_right');

    if (cursor) {
        document.addEventListener('mousemove', (e) => {
            cursor.style.left = `${e.clientX}px`;
            cursor.style.top = `${e.clientY}px`;
        });

        targetSections.forEach((section) => {
            section.addEventListener('mouseenter', () => cursor.classList.add('active'));
            section.addEventListener('mouseleave', () => cursor.classList.remove('active'));
        });
    }

    // === [공통] 하트 찜하기 튕김 애니메이션 통합 관리 (모든 섹션 연동) ===
    // 중복되던 하트 클릭 이벤트를 단 하나로 묶어 충돌을 방지합니다.
    $(document).on('click', '.recommend_group .heart_btn, .meetings_grid_wrap .heart_btn', function (e) {
        e.preventDefault();
        e.stopPropagation();

        var $btn = $(this);
        var $heartImg = $btn.find('img');
        var currentSrc = $heartImg.attr('src');

        $btn.removeClass('ani-bounce');

        setTimeout(function () {
            $btn.addClass('ani-bounce');
            if (currentSrc.indexOf('like btn off.png') !== -1) {
                $heartImg.attr('src', '../images/like btn on.png');
            } else {
                $heartImg.attr('src', '../images/like btn off.png');
            }
        }, 5);

        $btn.one('animationend webkitAnimationEnd oAnimationEnd', function () {
            $btn.removeClass('ani-bounce');
        });
    });

    // === [sub01] 메인 비주얼 호버 슬라이드 ===
    var winW = $(".mainviewcont").outerWidth(),
        target = $('.main_visual .visual'),
        target2 = $('.main_visual .visual_view'),
        length = 4,
        idx = 0,
        css = [],
        ease = "easeInOutQuint",
        time = 1000;

    if (target.length > 0) {
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
    }

    // === [sub02] 지금 가장 많이 읽는 책 슬라이드 (section01) ===
    var moveWidth = $('.slider-container').width() * 0.55;

    $('.next-btn').on('click', function () {
        if ($('.slider-track').is(':animated')) return;
        var $lastItem = $('.slider-item').last();
        $('.slider-track').css('left', -moveWidth).prepend($lastItem);
        $('.slider-track').animate({ left: 0 }, 400, 'swing');
    });

    $('.prev-btn').on('click', function () {
        if ($('.slider-track').is(':animated')) return;
        var $firstItem = $('.slider-item').first();
        $('.slider-track').animate({ left: -moveWidth }, 400, 'swing', function () {
            $('.slider-track').append($firstItem);
            $('.slider-track').css('left', 0);
        });
    });

    $(window).on('resize', function () {
        moveWidth = $('.slider-container').width() * 0.55;
    });

    // === [sub02] 오늘의 서랍 폴더 기능 (section02) ===
    $('.bookmark-btn').on('click', function (e) {
        e.preventDefault();
        var $currentFolder = $(this).parent('.folder-item');
        if ($currentFolder.hasClass('on')) return;

        var $currentIdx = $currentFolder.index();
        $currentFolder.addClass('on').siblings('.folder-item').removeClass('on');
        $('.folder_content').eq($currentIdx).addClass('on').siblings('.folder_content').removeClass('on');
    });

    // === [sub02] 신간도서 마우스 드래그 스크롤 ===
    let isDown = false;
    let startX;
    let scrollLeft;
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
        if (!isDown) return;
        e.preventDefault();
        const x = e.pageX - this.offsetLeft;
        const walk = (x - startX) * 1.5;
        this.scrollLeft = scrollLeft - walk;
    });

    // === [sub02] 전체도서 4열 그리드 탭 전환 통합 기능 (section03) ===
    $('#sub02_section03_wrap .filter_tab_menu').on('click', '.tab_item', function () {
        var tabIndex = $(this).index();
        $(this).addClass('active').siblings().removeClass('active');
        $('#sub02_section03_wrap .tab_content').eq(tabIndex).addClass('active').siblings().removeClass('active');
    });

    // 기존 단순 북마크용 온 오프 바인딩 처리 (기능 유지)
    document.querySelectorAll('.sub02_tab_container .bookname').forEach(function (element) {
        element.addEventListener('click', function (e) {
            e.preventDefault();
            this.classList.toggle('on');
        });
    });

    // === [sub03] 책볕자리 장르 필터 판넬 스위칭 (section01) ===
    $('.sub02_sec01_tab_menu').on('click', '.sub02_sec01_tab_item', function () {
        $('.sub02_sec01_tab_item').removeClass('active');
        $(this).addClass('active');

        var selectedTab = $(this).attr('data-tab');
        $('.sub02_sec01_pane').removeClass('active');

        var $targetPane = $('#sub02_pane_' + selectedTab);
        $targetPane.addClass('active');
        $targetPane.find('.sub02_sec01_card').removeClass('active').first().addClass('active');
    });

    // === [sub03] 추천 도서 상세 오버레이 페이드 효과 ===
    $(".img_overlay").hide();
    $(".books>li").mouseenter(function () {
        $(this).find(".img_overlay").stop().fadeIn(200);
    }).mouseleave(function () {
        $(this).find(".img_overlay").stop().fadeOut(200);
    });

    // === [sub03] 전체 모임 장르 필터 스위칭 기능 + 장르 변경 시 페이지네이션 1페이지 강제 초기화 ===
    $('.meetings_header .filter_tab_menu').on('click', '.tab_item', function () {
        var tabIndex = $(this).index();

        $('.meetings_header .tab_item').removeClass('active');
        $(this).addClass('active');

        // 장르 상판 박스 스위칭
        $('.meetings_container .meetings_grid_wrap').eq(tabIndex).addClass('active').siblings('.meetings_grid_wrap').removeClass('active');

        // [추가 핵심] 장르 탭을 바꿨을 때는 하단 번호 및 내부 페이지를 무조건 '1페이지' 상태로 강제 복구 리셋합니다.
        $('.page_number_list .num_item').eq(0).addClass('active').siblings().removeClass('active');
        $('.meetings_grid_wrap.active .page-group').eq(0).addClass('active').siblings().removeClass('active');
    });

    // === [sub03 추가] 하단 페이지 번호 및 이전/다음 버튼 동작 스크립트 기능 ===

    // 1. 페이지 넘버 클릭 제어
    $('.meetings_pagination_bar').on('click', '.num_item', function () {
        var pageIndex = $(this).index(); // 클릭한 숫자의 인덱스 추출 (0=1p, 1=2p, 2=3p)

        // 버튼 번호 시각 효과 토글
        $(this).addClass('active').siblings().removeClass('active');

        // 현재 활성화된 장르(.active)의 서랍 내부 안에서만 해당 페이지 그룹 노출
        $('.meetings_grid_wrap.active .page-group').eq(pageIndex).addClass('active').siblings().removeClass('active');
    });

    // 2. 이전 페이지 버튼 클릭 제어
    $('.meetings_pagination_bar').on('click', '.prev_page_btn', function () {
        // 활성화된 페이지 숫자의 형제 번호 추출
        var currentPageIdx = $('.page_number_list .num_item.active').index();

        if (currentPageIdx > 0) { // 1페이지보다 클 때만 뒤로 이동 가능
            $('.page_number_list .num_item').eq(currentPageIdx - 1).trigger('click');
        }
    });

    // 3. 다음 페이지 버튼 클릭 제어
    $('.meetings_pagination_bar').on('click', '.next_page_btn', function () {
        var currentPageIdx = $('.page_number_list .num_item.active').index();
        var totalPages = $('.page_number_list .num_item').length; // 총 페이지 수 = 3

        if (currentPageIdx < totalPages - 1) { // 마지막 페이지 번호 전까지만 작동
            $('.page_number_list .num_item').eq(currentPageIdx + 1).trigger('click');
        }
    });

    // === [공통] 카운터 애니메이션 실행 명령어 ===
    if ($('.counter').length > 0 && typeof $.fn.counterUp !== 'undefined') {
        $('.counter').counterUp({
            delay: 10,
            time: 1500
        });
    }

    // === [공통] Swiper 플러그인 컴포넌트 초기화 ===
    if ($('.mySwiper4').length > 0) {
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
    }
});
/* ==========================================================================
   책볕 프로젝트 통합 메인 자바스크립트 제어 시트 (script.js)
   [수정완료] 찜하기 통합 이벤트 리스너 이중 실행 방지 및 문법 오류 완벽 수정
   ========================================================================== */

$(function () {

    // ==========================================================================
    // ■ 1. [전역 공통 제어 구역] - 헤더, 탑버튼, 아코디언, 하트 애니메이션
    // ==========================================================================

    // [공통] GNB 서브메뉴 페이드 드롭다운 제어
    $(".sub").hide();
    $(".gnb>li:last-child").mouseenter(function () {
        $(this).children(".sub").stop().fadeIn(400);
    });
    $(".gnb>li:last-child").mouseleave(function () {
        $(this).children(".sub").stop().fadeOut(400);
    });

    // [공통] 탑버튼 클릭 시 부드럽게 최상단 이동 (Smooth Scroll)
    $('.top').on('click', function (e) {
        e.preventDefault();
        $('html, body').stop().animate({
            scrollTop: 0
        }, 800, 'swing');
    });

    // [공통] 윈도우 스크롤 감지 - 탑버튼 노출 및 숨김 페이드 제어
    $(window).scroll(function () {
        var height = $(window).scrollTop();
        if (height > 1080) {
            $('.top').fadeIn();
        } else {
            $('.top').fadeOut();
        }
    });

    // [공통] 스크롤 방향 감지 기반 헤더 업/다운 상하 자동 숨김 로직
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

    // [공통] 안내(FAQ) 게시판 아코디언 목록 슬라이딩 다운 및 플러스 회전 제어
    $(".fq_wrap> ul> li").click(function () {
        $(this).children(".text_info").slideToggle();
        $(this).siblings().children(".text_info").slideUp();
        $(this).toggleClass("turn").siblings().removeClass("turn");
    });

    // [공통] 커스텀 매직 마우스 커서 따라다니기 핸들러 (section03 활성화)
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

    // ==========================================================================
    // ★ [통합 핵심 수동 마크] 찜하기 통통 튀는 바운스 애니메이션 및 이미지/클래스 토글 통합 제어
    // ==========================================================================
    $(document).on('click', '.recommend_group .heart_btn, .meetings_grid_wrap .heart_btn, .goods_btns .heart_btn, .sub02_tab_container .bookname', function (e) {
        e.preventDefault();
        e.stopPropagation();

        var $this = $(this);

        // 1. 애니메이션 클래스 초기화 및 부여
        $this.removeClass('ani-bounce');
        setTimeout(function () {
            $this.addClass('ani-bounce');

            // 2. 가상 요소(::before / ::after)를 사용하는 도서 타이틀형 (.bookname) 클래스 토글 제어
            if ($this.hasClass('bookname')) {
                $this.toggleClass('on');
            }
            // 3. 실제 독립된 img 태그 단추를 사용하는 카드형 하트 이미지 토글 제어
            else {
                var $heartImg = $this.find('img');
                var currentSrc = $heartImg.attr('src');

                if (currentSrc.indexOf('heart_off.png') !== -1 || currentSrc.indexOf('heart_on.png') !== -1) {
                    if (currentSrc.indexOf('heart_off.png') !== -1) {
                        $heartImg.attr('src', '../images02/heart_on.png');
                    } else {
                        $heartImg.attr('src', '../images02/heart_off.png');
                    }
                } else {
                    if (currentSrc.indexOf('like btn off.png') !== -1) {
                        $heartImg.attr('src', '../images/like btn on.png');
                    } else {
                        $heartImg.attr('src', '../images/like btn off.png');
                    }
                }
            }
        }, 5);

        $this.one('animationend webkitAnimationEnd oAnimationEnd', function () {
            $this.removeClass('ani-bounce');
        });
    });


    // ==========================================================================
    // ■ 2. [각 서브 페이지별 고유 기능 구역] - sub01, sub02, sub03, sub04, sub06
    // ==========================================================================

    // === [sub01: 책볕소개] 메인 층별 비주얼 호버 확장 슬라이드 기능 ===
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

    // === [sub02: 책볕도서] 지금 가장 많이 읽는 책 슬라이드 (section01) ===
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
        if ($('.slider-container').length > 0) {
            moveWidth = $('.slider-container').width() * 0.55;
        }
    });

    // === [sub02: 책볕도서] 오늘의 서랍 폴더 탭 활성화 체인저 (section02) ===
    $('.bookmark-btn').on('click', function (e) {
        e.preventDefault();
        var $currentFolder = $(this).parent('.folder-item');
        if ($currentFolder.hasClass('on')) return;

        var $currentIdx = $currentFolder.index();
        $currentFolder.addClass('on').siblings('.folder-item').removeClass('on');
        $('.folder_content').eq($currentIdx).addClass('on').siblings('.folder_content').removeClass('on');
    });

    // === [sub02: 책볕도서] 신간도서 구역 가로 마우스 드래그 스크롤 액션 ===
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

    // === [sub02: 책볕도서] 전체도서 장르 탭 메뉴 전환 기능 (section03) ===
    $('#sub02_section03_wrap .filter_tab_menu').on('click', '.tab_item', function () {
        var tabIndex = $(this).index();
        $(this).addClass('active').siblings().removeClass('active');
        $('#sub02_section03_wrap .tab_content').eq(tabIndex).addClass('active').siblings().removeClass('active');
    });

    // === [sub03: 책볕자리] 상단 카테고리 필터 판넬 스위칭 제어 (section01) ===
    $('.sub02_sec01_tab_menu').on('click', '.sub02_sec01_tab_item', function () {
        $('.sub02_sec01_tab_item').removeClass('active');
        $(this).addClass('active');

        var selectedTab = $(this).attr('data-tab');
        $('.sub02_sec01_pane').removeClass('active');

        var $targetPane = $('#sub02_pane_' + selectedTab);
        $targetPane.addClass('active');
        $targetPane.find('.sub02_sec01_card').removeClass('active').first().addClass('active');
    });

    // === [sub03: 책볕자리] 추천 도서 목록 마우스 호버 오버레이 패이드인/아웃 ===
    $(".img_overlay").hide();
    $(".books>li").mouseenter(function () {
        $(this).find(".img_overlay").stop().fadeIn(200);
    }).mouseleave(function () {
        $(this).find(".img_overlay").stop().fadeOut(200);
    });

    // === [🔥 sub04: 책볕굿즈] 굿즈 스토어 전용 독립 카테고리 필터 스위칭 가동 구역 ===
    // [보완 A] 페이지 초기 로드 시, 첫 번째 탭(BEST)은 1페이지뿐이므로 페이지네이션을 먼저 숨깁니다.
    if ($('#sub04_section02_wrap').length > 0) {
        $('#sub04_section02_wrap .meetings_pagination_bar').hide();
    }

    $('#sub04_section02_wrap .filter_tab_menu').on('click', '.tab_item', function () {
        var tabIndex = $(this).index();

        // 탭 스타일 활성화 교체
        $('#sub04_section02_wrap .tab_item').removeClass('active');
        $(this).addClass('active');

        // 해당하는 상품 그리드 노출 제어
        var $allWraps = $('#sub04_section02_wrap .meetings_container .meetings_grid_wrap');
        $allWraps.removeClass('active');

        var $activeGrid = $allWraps.eq(tabIndex);
        $activeGrid.addClass('active');

        // 탭 전환 시 무조건 하단 페이지네이션 번호판을 [1페이지]로 강제 리셋
        $('#sub04_section02_wrap .meetings_pagination_bar .page_number_list .num_item').eq(0).addClass('active').siblings().removeClass('active');
        $allWraps.find('.page-group').removeClass('active');
        $activeGrid.find('.page-group').eq(0).addClass('active');

        // [보완 B] 조건 처리: '전체' 탭은 HTML 구조상 2번째 li이므로 타겟 인덱스가 1입니다. 
        // 만약 '전체' 글씨를 가진 탭의 순서가 바뀌더라도 안전하게 대응하도록 클래스명(.total) 조건문도 함께 결합했습니다.
        if (tabIndex === 1 || $(this).hasClass('total')) {
            $('#sub04_section02_wrap .meetings_pagination_bar').show();
            $('#sub04_section02_wrap .total_count .count_num').text('14'); // 전체 탭 실제 개수 강제 세팅 
        } else {
            $('#sub04_section02_wrap .meetings_pagination_bar').hide();
            // 각 개별 탭의 실제 상품 개수 유기적 카운팅 노출 [cite: 119]
            var currentLiCount = $activeGrid.find('.goods_grid_list li').length;
            $('#sub04_section02_wrap .total_count .count_num').text(currentLiCount);
        }
    });

    // === [sub03 & sub04 통합] 굿즈/모임방 전용 페이지네이션 클릭 인터랙션 구역 ===
    $('.meetings_container .meetings_pagination_bar').on('click', '.num_item', function (e) {
        e.preventDefault();
        var pageIndex = $(this).index();

        $(this).addClass('active').siblings().removeClass('active');

        var $currentContainer = $(this).closest('.meetings_container');
        var $activeGrid = $currentContainer.find('.meetings_grid_wrap.active');

        // 해당 활성 탭 내부의 page-group 슬라이드 교체 스위칭
        $activeGrid.find('.page-group').removeClass('active');
        $activeGrid.find('.page-group').eq(pageIndex).addClass('active');

        var targetOffset = $currentContainer.offset().top - 60;
        $('html, body').stop().animate({ scrollTop: targetOffset }, 400, 'swing');
    });

    //이전 페이지 화살표 버튼 제어 (굿즈/모임 전용)
    $('.meetings_container .meetings_pagination_bar').on('click', '.prev_page_btn', function () {
        var currentPageIdx = $(this).siblings('.page_number_list').find('.num_item.active').index();
        if (currentPageIdx > 0) {
            $(this).siblings('.page_number_list').find('.num_item').eq(currentPageIdx - 1).trigger('click');
        }
    });

    // 다음 페이지 화살표 버튼 제어 (굿즈/모임 전용)
    $('.meetings_container .meetings_pagination_bar').on('click', '.next_page_btn', function () {
        var currentPageIdx = $(this).siblings('.page_number_list').find('.num_item.active').index();
        var totalPages = $(this).siblings('.page_number_list').find('.num_item').length;
        if (currentPageIdx < totalPages - 1) {
            $(this).siblings('.page_number_list').find('.num_item').eq(currentPageIdx + 1).trigger('click');
        }
    });

    // ==========================================================================
    // ■ [sub05_1: 공지사항] 테이블 행 데이터 페이지네이션 유기적 연동 처리
    // ==========================================================================
    if ($('.notice_container').length > 0) {

        // 초기 로드 시 1페이지 데이터만 노출시키고 나머지는 숨김
        function initNoticePage() {
            $('.notice_table tbody tr').hide();
            $('.notice_table tbody tr[data-page="1"]').show();
        }
        initNoticePage();

        // 번호판(1, 2, 3) 클릭 시 동작
        $('.notice_container .meetings_pagination_bar').on('click', '.num_item', function (e) {
            e.preventDefault();
            e.stopPropagation();

            $(this).addClass('active').siblings().removeClass('active');
            var targetPage = $(this).text().trim();

            $('.notice_table tbody tr').hide();
            $('.notice_table tbody tr[data-page="' + targetPage + '"]').fadeIn(200);

            var targetOffset = $('.notice_container').offset().top - 80;
            $('html, body').stop().animate({ scrollTop: targetOffset }, 400);
        });

        // 이전(Prev) 화살표 버튼 클릭 제어 (공지사항 전용)
        $('.notice_container .prev_page_btn').on('click', function (e) {
            e.preventDefault();
            var currentIdx = $('.notice_container .page_number_list .num_item.active').index();
            if (currentIdx > 0) {
                $('.notice_container .page_number_list .num_item').eq(currentIdx - 1).trigger('click');
            }
        });

        // 다음(Next) 화살표 버튼 클릭 제어 (공지사항 전용)
        $('.notice_container .next_page_btn').on('click', function (e) {
            e.preventDefault();
            var currentIdx = $('.notice_container .page_number_list .num_item.active').index();
            var totalPages = $('.notice_container .page_number_list .num_item').length;
            if (currentIdx < totalPages - 1) {
                $('.notice_container .page_number_list .num_item').eq(currentIdx + 1).trigger('click');
            }
        });
    }

    // === [sub06: 나의서재] 책상 확인하기 버튼 클릭 스크롤 다운 ===
    $('.scroll_btn').on('click', function (e) {
        e.preventDefault();

        var targetHref = $(this).attr('href');
        var $target = $(targetHref);

        if ($target.length > 0) {
            var targetOffset = $target.offset().top;
            $('html, body').stop().animate({
                scrollTop: targetOffset
            }, 800, 'swing');
        }
    });

    // LNB 아이콘 고정 스위칭 로직
    function switchIcon($img, status) {
        if (!$img.length) return;
        var src = $img.attr('src');

        if (status === 'on') {
            if (src && src.indexOf('_off.png') !== -1) {
                $img.attr('src', src.replace('_off.png', '_on.png'));
            }
        } else if (status === 'off') {
            if (src && src.indexOf('_on.png') !== -1) {
                $img.attr('src', src.replace('_on.png', '_off.png'));
            }
        }
    }

    $('.lnb > li.active').each(function () {
        switchIcon($(this).find('img'), 'on');
    });

    $('.lnb > li').on('mouseenter', function () {
        if ($(this).hasClass('active')) return;
        var $img = $(this).find('img');
        switchIcon($img, 'on');
    }).on('mouseleave', function () {
        if ($(this).hasClass('active')) return;
        var $img = $(this).find('img');
        switchIcon($img, 'off');
    });

    $('.lnb > li').on('click', function () {
        $('.lnb > li.active').each(function () {
            var $prevImg = $(this).find('img');
            switchIcon($prevImg, 'off');
        });

        $('.lnb > li').removeClass('active');
        $(this).addClass('active');

        var $currentImg = $(this).find('img');
        switchIcon($currentImg, 'on');
    });

    // 나의 서재 일정 캘린더 연동 스크립트
    $('.days_grid').on('click', '.day_cell', function () {
        if ($(this).hasClass('other_month')) return;

        $('.day_cell').removeClass('is_selected');
        $(this).addClass('is_selected');

        var targetPageId = $(this).attr('data-target');
        $('.calendar_page_item').removeClass('active');

        if (targetPageId && $('#' + targetPageId).length > 0) {
            $('#' + targetPageId).addClass('active');
        } else {
            $('#page_default').addClass('active');
            var clickedDateNum = $(this).text();
            $('#page_default h3').text('5월 ' + clickedDateNum + '일의 기록');
        }
    });

    // 마이페이지 도서 / 굿즈 캡슐 버튼 탭 전환
    $('.purchase_tab_menu .tab_btn').on('click', function () {
        $('.purchase_tab_menu .tab_btn').removeClass('active');
        $(this).addClass('active');

        var targetPane = $(this).attr('data-tab');
        $('.purchase_list_dynamic_matrix .purchase_pane_box').removeClass('active');
        $('#' + targetPane).addClass('active');
    });

    // 마이페이지 찜한 목록 모임/도서/굿즈 캡슐 버튼 탭 전환
    $('.liked_tab_menu .tab_btn').on('click', function () {
        $('.liked_tab_menu .tab_btn').removeClass('active');
        $(this).addClass('active');

        var targetPane = $(this).attr('data-tab');
        $('.liked_list_dynamic_matrix .liked_pane_box').removeClass('active');
        $('#' + targetPane).addClass('active');
    });

    /* ==========================================================================
       [마이페이지 sub06_2] 회원정보 수정 2단계 멀티 페이지네이션 스위칭 기능
       ========================================================================== */
    var currentProfileStep = 1;
    var totalProfileSteps = 2;

    function switchProfilePage(stepNum) {
        if (stepNum < 1 || stepNum > totalProfileSteps) return;

        currentProfileStep = stepNum;

        $('.edit_profile_page .edit_pane_box').removeClass('active');
        $('#profile_step_' + currentProfileStep).addClass('active');

        $('.edit_profile_pagination .page_number_list .num_item').removeClass('active');
        $('.edit_profile_pagination .page_number_list .num_item[data-step="' + currentProfileStep + '"]').addClass('active');
    }

    $('.edit_profile_pagination .page_number_list .num_item').on('click', function () {
        var targetStep = $(this).data('step');
        switchProfilePage(targetStep);
    });

    $('.edit_profile_pagination .prev_step_btn').on('click', function () {
        if (currentProfileStep > 1) {
            switchProfilePage(currentProfileStep - 1);
        }
    });

    $('.edit_profile_pagination .next_step_btn').on('click', function () {
        if (currentProfileStep < totalProfileSteps) {
            switchProfilePage(currentProfileStep + 1);
        }
    });

    /* ==========================================================================
       [마이페이지 sub06_2] 탭 메뉴 전환 시 우측 CTA 버튼 목적지 동적 변경 로직
       ========================================================================== */
    $('.liked_tab_menu .tab_btn').on('click', function () {
        var targetPaneId = $(this).attr('data-tab');
        var $ctaBtn = $('.dynamic_explore_btn');

        if (targetPaneId === 'liked_meeting_pane') {
            $ctaBtn.attr('href', 'sub03.html');
            $ctaBtn.find('.cta_txt').text('더 많은 모임 보러가기');
        }
        else if (targetPaneId === 'liked_book_pane') {
            $ctaBtn.attr('href', 'sub02.html');
            $ctaBtn.find('.cta_txt').text('더 많은 도서 보러가기');
        }
        else if (targetPaneId === 'liked_goods_pane') {
            $ctaBtn.attr('href', 'sub04.html');
            $ctaBtn.find('.cta_txt').text('더 많은 굿즈 보러가기');
        }
    });

    // ==========================================================================
    // ■ 3. [외부 라이브러리 및 플러그인 컴포넌트 초기화 구역]
    // ==========================================================================
    if ($('.counter').length > 0 && typeof $.fn.counterUp !== 'undefined') {
        $('.counter').counterUp({
            delay: 10,
            time: 1500
        });
    }

    if ($('.mySwiper4').length > 0) {
        var swiper4 = new Swiper(".mySwiper4", {
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

    if ($('.mySwiper2').length > 0) {
        var swiper2 = new Swiper(".mySwiper2", {
            spaceBetween: 30,
            centeredSlides: true,
            autoplay: {
                delay: 2500,
                disableOnInteraction: false,
            },
            speed: 600,
            parallax: true,
            pagination: {
                el: ".swiper-pagination",
                clickable: true,
            },
            navigation: {
                nextEl: ".swiper-button-next",
                prevEl: ".swiper-button-prev",
            },
        });
    }

});
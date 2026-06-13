'use client';

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';

export type Locale = 'en' | 'zh-HK' | 'ko' | 'id' | 'pt-BR';

type TranslationKey =
  | 'language'
  | 'nav.xGrid'
  | 'nav.twitterEffect'
  | 'nav.instagram'
  | 'nav.create'
  | 'nav.xProfile'
  | 'nav.github'
  | 'nav.openMenu'
  | 'nav.closeMenu'
  | 'hero.kicker'
  | 'hero.titleA'
  | 'hero.titleB'
  | 'hero.subtitle'
  | 'footer.description'
  | 'tool.window'
  | 'tool.private'
  | 'tool.title'
  | 'tool.subtitle'
  | 'tool.choosePlatform'
  | 'tool.chooseFormat'
  | 'tool.selectImage'
  | 'tool.crop'
  | 'tool.cover'
  | 'tool.contain'
  | 'tool.how'
  | 'tool.process'
  | 'tool.processing'
  | 'tool.reset'
  | 'tool.preview'
  | 'tool.previewHelp'
  | 'tool.downloadAll'
  | 'tool.imagesPrivate'
  | 'platform.x'
  | 'platform.xDesc'
  | 'platform.instagram'
  | 'platform.instagramDesc'
  | 'mode.xSingle'
  | 'mode.xSingleDesc'
  | 'mode.xCustom'
  | 'mode.xCustomDesc'
  | 'mode.igGrid'
  | 'mode.igGridDesc'
  | 'mode.igCarousel'
  | 'mode.igCarouselDesc'
  | 'select.single'
  | 'select.wide'
  | 'select.nine'
  | 'custom.progress'
  | 'custom.tip'
  | 'custom.main'
  | 'custom.header'
  | 'custom.footer'
  | 'custom.clickAssign'
  | 'tutorial.quickGuide'
  | 'tutorial.close'
  | 'tutorial.gotIt'
  | 'tutorial.customTip'
  | 'tutorial.xSingle1'
  | 'tutorial.xSingle2'
  | 'tutorial.xSingle3'
  | 'tutorial.xSingle4'
  | 'tutorial.xCustom1'
  | 'tutorial.xCustom2'
  | 'tutorial.xCustom3'
  | 'tutorial.xCustom4'
  | 'tutorial.igGrid1'
  | 'tutorial.igGrid2'
  | 'tutorial.igGrid3'
  | 'tutorial.igGrid4'
  | 'tutorial.igCarousel1'
  | 'tutorial.igCarousel2'
  | 'tutorial.igCarousel3'
  | 'tutorial.igCarousel4'
  | 'preview.igGridOrder'
  | 'preview.carouselOrder'
  | 'preview.xTitle'
  | 'preview.xMeta'
  | 'preview.xBody'
  | 'preview.openFull'
  | 'preview.fullImage';

const localeLabels: Record<Locale, string> = {
  en: 'English',
  'zh-HK': '繁體中文',
  ko: '한국어',
  id: 'Bahasa Indonesia',
  'pt-BR': 'Português BR',
};

const translations: Record<Locale, Record<TranslationKey, string>> = {
  en: {
    language: 'Language',
    'nav.xGrid': 'X Grid Maker',
    'nav.twitterEffect': 'Twitter Grid Effect',
    'nav.instagram': 'Instagram Grid Maker',
    'nav.create': 'Create',
    'nav.xProfile': 'X Profile',
    'nav.github': 'GitHub',
    'nav.openMenu': 'Open menu',
    'nav.closeMenu': 'Close menu',
    'hero.kicker': 'Free browser grid maker',
    'hero.titleA': 'Build better',
    'hero.titleB': 'social grids',
    'hero.subtitle':
      'Switch between X/Twitter and Instagram, preview the layout, and download ready-to-post tiles. Images stay on your device.',
    'footer.description':
      'Free browser-based image splitter for X/Twitter grids, Instagram 3x3 profile grids, and Instagram carousel tiles. Images stay on your device.',
    'tool.window': 'Local canvas tool',
    'tool.private': 'Private',
    'tool.title': 'Grid generator',
    'tool.subtitle': 'Pick a platform, choose a format, select local images, and export.',
    'tool.choosePlatform': 'Choose platform',
    'tool.chooseFormat': 'Choose format',
    'tool.selectImage': 'Select image',
    'tool.crop': 'Crop',
    'tool.cover': 'Cover',
    'tool.contain': 'Contain',
    'tool.how': 'How it works',
    'tool.process': 'Process images',
    'tool.processing': 'Processing...',
    'tool.reset': 'Reset',
    'tool.preview': 'Preview appears here',
    'tool.previewHelp': 'Process an image to check ordering, cropping, and platform layout before downloading.',
    'tool.downloadAll': 'Download all images',
    'tool.imagesPrivate': 'Images stay on your device.',
    'platform.x': 'X / Twitter',
    'platform.xDesc': '2x2 posts and grid illusions',
    'platform.instagram': 'Instagram',
    'platform.instagramDesc': '3x3 grids and carousel tiles',
    'mode.xSingle': 'X 2x2',
    'mode.xSingleDesc': 'Split one image into four parts for an X post preview.',
    'mode.xCustom': 'X Custom',
    'mode.xCustomDesc': 'Use 9 images to build the original X grid illusion.',
    'mode.igGrid': 'IG 3x3',
    'mode.igGridDesc': 'Split one image into nine square posts for an Instagram profile grid.',
    'mode.igCarousel': 'IG Carousel',
    'mode.igCarouselDesc': 'Split one wide image into square slides for an Instagram carousel.',
    'select.single': 'Select one image',
    'select.wide': 'Select one wide image',
    'select.nine': 'Select 9 images',
    'custom.progress': '{assigned}/9 slots assigned',
    'custom.tip': 'Tap a slot below, then choose one selected image from the popup.',
    'custom.main': 'Shared main image',
    'custom.header': 'Header',
    'custom.footer': 'Footer',
    'custom.clickAssign': 'Click to assign',
    'tutorial.quickGuide': 'Quick guide',
    'tutorial.close': 'Close tutorial',
    'tutorial.gotIt': 'Got it',
    'tutorial.customTip': 'Tip: the Main image is shared across the four X preview tiles. Headers and footers become the tall images people see when they open each tile.',
    'tutorial.xSingle1': 'Select one image for your X/Twitter post.',
    'tutorial.xSingle2': 'Choose cover to fill the post grid or contain to avoid cropping.',
    'tutorial.xSingle3': 'Preview the 2x2 layout.',
    'tutorial.xSingle4': 'Download all 4 images and attach them to one post.',
    'tutorial.xCustom1': 'Select exactly 9 images.',
    'tutorial.xCustom2': 'Assign the shared Main image once.',
    'tutorial.xCustom3': 'Tap each Header and Footer slot, then choose one selected image.',
    'tutorial.xCustom4': 'When every slot is filled, create and download the 4 X grid images.',
    'tutorial.igGrid1': 'Select one image you want to spread across your profile.',
    'tutorial.igGrid2': 'Choose cover to fill the squares or contain to keep the full image visible.',
    'tutorial.igGrid3': 'Download the 9 tiles.',
    'tutorial.igGrid4': 'Publish tile 09 first and tile 01 last so the profile grid lines up.',
    'tutorial.igCarousel1': 'Select one wide image or design.',
    'tutorial.igCarousel2': 'Choose cover or contain based on how much cropping you want.',
    'tutorial.igCarousel3': 'Download the square carousel slides.',
    'tutorial.igCarousel4': 'Publish them to Instagram from 01 to the last tile.',
    'preview.igGridOrder': 'Instagram profile grids appear newest-first. Publish tile 09 first and tile 01 last.',
    'preview.carouselOrder': 'Carousel tiles are ordered left to right. Publish them from 01 to {count}.',
    'preview.xTitle': 'Your post preview',
    'preview.xMeta': '@yourhandle · now',
    'preview.xBody': 'Here is how the X grid will look in the feed.',
    'preview.openFull': 'Open full image',
    'preview.fullImage': 'Full image',
  },
  'zh-HK': {
    language: '語言',
    'nav.xGrid': 'X 網格工具',
    'nav.twitterEffect': 'Twitter 網格效果',
    'nav.instagram': 'Instagram 網格工具',
    'nav.create': '開始製作',
    'nav.xProfile': 'X 個人頁',
    'nav.github': 'GitHub',
    'nav.openMenu': '開啟選單',
    'nav.closeMenu': '關閉選單',
    'hero.kicker': '免費瀏覽器網格工具',
    'hero.titleA': '製作更好的',
    'hero.titleB': '社交媒體網格',
    'hero.subtitle': '在 X/Twitter 與 Instagram 之間切換，預覽版面，下載可直接發佈的圖片。圖片只會留在你的裝置。',
    'footer.description': '免費瀏覽器圖片分割工具，支援 X/Twitter 網格、Instagram 3x3 個人頁網格及輪播圖片。圖片只會留在你的裝置。',
    'tool.window': '本機 Canvas 工具',
    'tool.private': '私密',
    'tool.title': '網格產生器',
    'tool.subtitle': '選平台、選格式、選擇本機圖片，然後匯出。',
    'tool.choosePlatform': '選擇平台',
    'tool.chooseFormat': '選擇格式',
    'tool.selectImage': '選擇圖片',
    'tool.crop': '裁切',
    'tool.cover': '填滿',
    'tool.contain': '完整保留',
    'tool.how': '使用方式',
    'tool.process': '處理圖片',
    'tool.processing': '處理中...',
    'tool.reset': '重設',
    'tool.preview': '預覽會顯示在這裡',
    'tool.previewHelp': '先處理圖片，確認排序、裁切和平台版面，再下載。',
    'tool.downloadAll': '下載全部圖片',
    'tool.imagesPrivate': '圖片只會留在你的裝置。',
    'platform.x': 'X / Twitter',
    'platform.xDesc': '2x2 貼文和網格幻覺',
    'platform.instagram': 'Instagram',
    'platform.instagramDesc': '3x3 網格和輪播圖片',
    'mode.xSingle': 'X 2x2',
    'mode.xSingleDesc': '把一張圖片分割成四張，用於 X 貼文預覽。',
    'mode.xCustom': 'X 自訂',
    'mode.xCustomDesc': '使用 9 張圖片製作原始 X 網格幻覺。',
    'mode.igGrid': 'IG 3x3',
    'mode.igGridDesc': '把一張圖片分割成九張方形 Instagram 貼文。',
    'mode.igCarousel': 'IG 輪播',
    'mode.igCarouselDesc': '把一張寬圖分割成 Instagram 輪播方形圖片。',
    'select.single': '選擇一張圖片',
    'select.wide': '選擇一張寬圖',
    'select.nine': '選擇 9 張圖片',
    'custom.progress': '已指定 {assigned}/9 個位置',
    'custom.tip': '點擊下方位置，然後在彈窗選擇已選圖片。',
    'custom.main': '共用主圖',
    'custom.header': '頂部',
    'custom.footer': '底部',
    'custom.clickAssign': '點擊指定',
    'tutorial.quickGuide': '快速指南',
    'tutorial.close': '關閉教學',
    'tutorial.gotIt': '明白',
    'tutorial.customTip': '提示：主圖會共用於四個 X 預覽圖片。頂部和底部圖片會成為開啟每張圖片後看到的長圖內容。',
    'tutorial.xSingle1': '選擇一張用於 X/Twitter 貼文的圖片。',
    'tutorial.xSingle2': '選擇填滿網格，或完整保留以避免裁切。',
    'tutorial.xSingle3': '預覽 2x2 版面。',
    'tutorial.xSingle4': '下載 4 張圖片並附加到同一篇貼文。',
    'tutorial.xCustom1': '選擇剛好 9 張圖片。',
    'tutorial.xCustom2': '先指定一次共用主圖。',
    'tutorial.xCustom3': '點擊每個頂部和底部位置，然後選擇已選圖片。',
    'tutorial.xCustom4': '所有位置填好後，建立並下載 4 張 X 網格圖片。',
    'tutorial.igGrid1': '選擇要延伸到個人頁網格的一張圖片。',
    'tutorial.igGrid2': '選擇填滿方格，或完整保留圖片。',
    'tutorial.igGrid3': '下載 9 張圖片。',
    'tutorial.igGrid4': '先發佈第 09 張，最後發佈第 01 張，個人頁網格才會對齊。',
    'tutorial.igCarousel1': '選擇一張寬圖或設計圖。',
    'tutorial.igCarousel2': '根據需要選擇填滿或完整保留。',
    'tutorial.igCarousel3': '下載方形輪播圖片。',
    'tutorial.igCarousel4': '從 01 到最後一張依序發佈到 Instagram。',
    'preview.igGridOrder': 'Instagram 個人頁網格是最新貼文在前。請先發佈 09，最後發佈 01。',
    'preview.carouselOrder': '輪播圖片由左至右排序。請從 01 發佈到 {count}。',
    'preview.xTitle': '你的貼文預覽',
    'preview.xMeta': '@yourhandle · 現在',
    'preview.xBody': '這是 X 網格在動態中的顯示效果。',
    'preview.openFull': '開啟完整圖片',
    'preview.fullImage': '完整圖片',
  },
  ko: {
    language: '언어',
    'nav.xGrid': 'X 그리드 만들기',
    'nav.twitterEffect': 'Twitter 그리드 효과',
    'nav.instagram': 'Instagram 그리드',
    'nav.create': '만들기',
    'nav.xProfile': 'X 프로필',
    'nav.github': 'GitHub',
    'nav.openMenu': '메뉴 열기',
    'nav.closeMenu': '메뉴 닫기',
    'hero.kicker': '무료 브라우저 그리드 도구',
    'hero.titleA': '더 좋은',
    'hero.titleB': '소셜 그리드 만들기',
    'hero.subtitle': 'X/Twitter와 Instagram을 전환하고, 레이아웃을 미리 본 뒤 바로 게시할 타일을 다운로드하세요. 이미지는 기기에만 남습니다.',
    'footer.description': 'X/Twitter 그리드, Instagram 3x3 프로필 그리드, Instagram 캐러셀 타일을 만드는 무료 브라우저 이미지 분할 도구입니다. 이미지는 기기에만 남습니다.',
    'tool.window': '로컬 Canvas 도구',
    'tool.private': '비공개',
    'tool.title': '그리드 생성기',
    'tool.subtitle': '플랫폼과 형식을 선택하고 로컬 이미지를 고른 뒤 내보내세요.',
    'tool.choosePlatform': '플랫폼 선택',
    'tool.chooseFormat': '형식 선택',
    'tool.selectImage': '이미지 선택',
    'tool.crop': '자르기',
    'tool.cover': '채우기',
    'tool.contain': '전체 보기',
    'tool.how': '사용 방법',
    'tool.process': '이미지 처리',
    'tool.processing': '처리 중...',
    'tool.reset': '초기화',
    'tool.preview': '여기에 미리보기가 표시됩니다',
    'tool.previewHelp': '다운로드 전에 이미지 순서, 자르기, 플랫폼 레이아웃을 확인하세요.',
    'tool.downloadAll': '모든 이미지 다운로드',
    'tool.imagesPrivate': '이미지는 기기에만 남습니다.',
    'platform.x': 'X / Twitter',
    'platform.xDesc': '2x2 게시물과 그리드 효과',
    'platform.instagram': 'Instagram',
    'platform.instagramDesc': '3x3 그리드와 캐러셀 타일',
    'mode.xSingle': 'X 2x2',
    'mode.xSingleDesc': '이미지 한 장을 X 게시물 미리보기용 네 조각으로 나눕니다.',
    'mode.xCustom': 'X 커스텀',
    'mode.xCustomDesc': '9장의 이미지로 원래 X 그리드 효과를 만듭니다.',
    'mode.igGrid': 'IG 3x3',
    'mode.igGridDesc': '이미지 한 장을 Instagram 프로필 그리드용 9개 정사각형 게시물로 나눕니다.',
    'mode.igCarousel': 'IG 캐러셀',
    'mode.igCarouselDesc': '가로 이미지를 Instagram 캐러셀용 정사각형 슬라이드로 나눕니다.',
    'select.single': '이미지 한 장 선택',
    'select.wide': '가로 이미지 선택',
    'select.nine': '이미지 9장 선택',
    'custom.progress': '{assigned}/9 슬롯 지정됨',
    'custom.tip': '아래 슬롯을 누른 뒤 팝업에서 선택한 이미지를 고르세요.',
    'custom.main': '공유 메인 이미지',
    'custom.header': '헤더',
    'custom.footer': '푸터',
    'custom.clickAssign': '눌러서 지정',
    'tutorial.quickGuide': '빠른 가이드',
    'tutorial.close': '튜토리얼 닫기',
    'tutorial.gotIt': '알겠습니다',
    'tutorial.customTip': '팁: 메인 이미지는 네 개의 X 미리보기 타일에 공유됩니다. 헤더와 푸터는 각 타일을 열었을 때 보이는 긴 이미지가 됩니다.',
    'tutorial.xSingle1': 'X/Twitter 게시물용 이미지 한 장을 선택하세요.',
    'tutorial.xSingle2': '채우기 또는 전체 보기를 선택하세요.',
    'tutorial.xSingle3': '2x2 레이아웃을 미리보세요.',
    'tutorial.xSingle4': '4개 이미지를 다운로드해 한 게시물에 첨부하세요.',
    'tutorial.xCustom1': '정확히 9장의 이미지를 선택하세요.',
    'tutorial.xCustom2': '공유 메인 이미지를 한 번 지정하세요.',
    'tutorial.xCustom3': '각 헤더와 푸터 슬롯을 누르고 선택한 이미지를 고르세요.',
    'tutorial.xCustom4': '모든 슬롯을 채운 뒤 4개의 X 그리드 이미지를 만드세요.',
    'tutorial.igGrid1': '프로필에 펼칠 이미지 한 장을 선택하세요.',
    'tutorial.igGrid2': '정사각형 채우기 또는 전체 보기를 선택하세요.',
    'tutorial.igGrid3': '9개 타일을 다운로드하세요.',
    'tutorial.igGrid4': '09번 타일부터 게시하고 01번을 마지막에 게시하세요.',
    'tutorial.igCarousel1': '가로 이미지나 디자인을 선택하세요.',
    'tutorial.igCarousel2': '원하는 자르기 방식으로 채우기 또는 전체 보기를 선택하세요.',
    'tutorial.igCarousel3': '정사각형 캐러셀 슬라이드를 다운로드하세요.',
    'tutorial.igCarousel4': '01번부터 마지막 타일까지 Instagram에 게시하세요.',
    'preview.igGridOrder': 'Instagram 프로필 그리드는 최신 게시물이 먼저 보입니다. 09번을 먼저, 01번을 마지막에 게시하세요.',
    'preview.carouselOrder': '캐러셀 타일은 왼쪽에서 오른쪽 순서입니다. 01부터 {count}까지 게시하세요.',
    'preview.xTitle': '게시물 미리보기',
    'preview.xMeta': '@yourhandle · 지금',
    'preview.xBody': 'X 피드에서 그리드가 이렇게 보입니다.',
    'preview.openFull': '전체 이미지 열기',
    'preview.fullImage': '전체 이미지',
  },
  id: {
    language: 'Bahasa',
    'nav.xGrid': 'Pembuat Grid X',
    'nav.twitterEffect': 'Efek Grid Twitter',
    'nav.instagram': 'Grid Instagram',
    'nav.create': 'Buat',
    'nav.xProfile': 'Profil X',
    'nav.github': 'GitHub',
    'nav.openMenu': 'Buka menu',
    'nav.closeMenu': 'Tutup menu',
    'hero.kicker': 'Pembuat grid gratis di browser',
    'hero.titleA': 'Buat',
    'hero.titleB': 'grid sosial lebih baik',
    'hero.subtitle': 'Beralih antara X/Twitter dan Instagram, pratinjau tata letak, lalu unduh tile siap posting. Gambar tetap di perangkat Anda.',
    'footer.description': 'Alat pemisah gambar gratis di browser untuk grid X/Twitter, grid Instagram 3x3, dan tile carousel Instagram. Gambar tetap di perangkat Anda.',
    'tool.window': 'Alat Canvas lokal',
    'tool.private': 'Privat',
    'tool.title': 'Generator grid',
    'tool.subtitle': 'Pilih platform, pilih format, pilih gambar lokal, lalu ekspor.',
    'tool.choosePlatform': 'Pilih platform',
    'tool.chooseFormat': 'Pilih format',
    'tool.selectImage': 'Pilih gambar',
    'tool.crop': 'Potong',
    'tool.cover': 'Penuhi',
    'tool.contain': 'Tampilkan penuh',
    'tool.how': 'Cara kerja',
    'tool.process': 'Proses gambar',
    'tool.processing': 'Memproses...',
    'tool.reset': 'Reset',
    'tool.preview': 'Pratinjau muncul di sini',
    'tool.previewHelp': 'Proses gambar untuk memeriksa urutan, potongan, dan tata letak sebelum mengunduh.',
    'tool.downloadAll': 'Unduh semua gambar',
    'tool.imagesPrivate': 'Gambar tetap di perangkat Anda.',
    'platform.x': 'X / Twitter',
    'platform.xDesc': 'Posting 2x2 dan ilusi grid',
    'platform.instagram': 'Instagram',
    'platform.instagramDesc': 'Grid 3x3 dan tile carousel',
    'mode.xSingle': 'X 2x2',
    'mode.xSingleDesc': 'Pisahkan satu gambar menjadi empat bagian untuk pratinjau posting X.',
    'mode.xCustom': 'X Kustom',
    'mode.xCustomDesc': 'Gunakan 9 gambar untuk membuat ilusi grid X asli.',
    'mode.igGrid': 'IG 3x3',
    'mode.igGridDesc': 'Pisahkan satu gambar menjadi sembilan posting kotak untuk grid profil Instagram.',
    'mode.igCarousel': 'IG Carousel',
    'mode.igCarouselDesc': 'Pisahkan satu gambar lebar menjadi slide kotak untuk carousel Instagram.',
    'select.single': 'Pilih satu gambar',
    'select.wide': 'Pilih satu gambar lebar',
    'select.nine': 'Pilih 9 gambar',
    'custom.progress': '{assigned}/9 slot terisi',
    'custom.tip': 'Ketuk slot di bawah, lalu pilih gambar yang sudah dipilih dari popup.',
    'custom.main': 'Gambar utama bersama',
    'custom.header': 'Header',
    'custom.footer': 'Footer',
    'custom.clickAssign': 'Klik untuk menetapkan',
    'tutorial.quickGuide': 'Panduan cepat',
    'tutorial.close': 'Tutup panduan',
    'tutorial.gotIt': 'Mengerti',
    'tutorial.customTip': 'Tips: gambar utama dipakai bersama di empat tile pratinjau X. Header dan footer menjadi gambar tinggi saat tile dibuka.',
    'tutorial.xSingle1': 'Pilih satu gambar untuk posting X/Twitter.',
    'tutorial.xSingle2': 'Pilih penuhi atau tampilkan penuh untuk mengatur potongan.',
    'tutorial.xSingle3': 'Pratinjau tata letak 2x2.',
    'tutorial.xSingle4': 'Unduh 4 gambar dan lampirkan ke satu posting.',
    'tutorial.xCustom1': 'Pilih tepat 9 gambar.',
    'tutorial.xCustom2': 'Tetapkan gambar utama bersama satu kali.',
    'tutorial.xCustom3': 'Ketuk setiap slot header dan footer, lalu pilih gambar.',
    'tutorial.xCustom4': 'Setelah semua slot terisi, buat dan unduh 4 gambar grid X.',
    'tutorial.igGrid1': 'Pilih satu gambar untuk ditampilkan di profil.',
    'tutorial.igGrid2': 'Pilih penuhi kotak atau tampilkan gambar penuh.',
    'tutorial.igGrid3': 'Unduh 9 tile.',
    'tutorial.igGrid4': 'Terbitkan tile 09 dulu dan tile 01 terakhir agar grid sejajar.',
    'tutorial.igCarousel1': 'Pilih satu gambar lebar atau desain.',
    'tutorial.igCarousel2': 'Pilih penuhi atau tampilkan penuh sesuai kebutuhan.',
    'tutorial.igCarousel3': 'Unduh slide carousel kotak.',
    'tutorial.igCarousel4': 'Terbitkan ke Instagram dari 01 sampai tile terakhir.',
    'preview.igGridOrder': 'Grid profil Instagram menampilkan yang terbaru lebih dulu. Terbitkan tile 09 dulu dan tile 01 terakhir.',
    'preview.carouselOrder': 'Tile carousel berurutan dari kiri ke kanan. Terbitkan dari 01 sampai {count}.',
    'preview.xTitle': 'Pratinjau posting',
    'preview.xMeta': '@yourhandle · sekarang',
    'preview.xBody': 'Beginilah tampilan grid X di feed.',
    'preview.openFull': 'Buka gambar penuh',
    'preview.fullImage': 'Gambar penuh',
  },
  'pt-BR': {
    language: 'Idioma',
    'nav.xGrid': 'Grade para X',
    'nav.twitterEffect': 'Efeito de Grade Twitter',
    'nav.instagram': 'Grade Instagram',
    'nav.create': 'Criar',
    'nav.xProfile': 'Perfil no X',
    'nav.github': 'GitHub',
    'nav.openMenu': 'Abrir menu',
    'nav.closeMenu': 'Fechar menu',
    'hero.kicker': 'Criador de grades grátis no navegador',
    'hero.titleA': 'Crie',
    'hero.titleB': 'grades sociais melhores',
    'hero.subtitle': 'Alterne entre X/Twitter e Instagram, visualize o layout e baixe tiles prontos para postar. Suas imagens ficam no seu dispositivo.',
    'footer.description': 'Divisor de imagens gratuito no navegador para grades do X/Twitter, grades 3x3 do Instagram e tiles de carrossel. Suas imagens ficam no seu dispositivo.',
    'tool.window': 'Ferramenta Canvas local',
    'tool.private': 'Privado',
    'tool.title': 'Gerador de grade',
    'tool.subtitle': 'Escolha a plataforma, escolha o formato, selecione imagens locais e exporte.',
    'tool.choosePlatform': 'Escolha a plataforma',
    'tool.chooseFormat': 'Escolha o formato',
    'tool.selectImage': 'Selecionar imagem',
    'tool.crop': 'Corte',
    'tool.cover': 'Preencher',
    'tool.contain': 'Mostrar tudo',
    'tool.how': 'Como funciona',
    'tool.process': 'Processar imagens',
    'tool.processing': 'Processando...',
    'tool.reset': 'Redefinir',
    'tool.preview': 'A prévia aparece aqui',
    'tool.previewHelp': 'Processe uma imagem para conferir ordem, corte e layout antes de baixar.',
    'tool.downloadAll': 'Baixar todas as imagens',
    'tool.imagesPrivate': 'As imagens ficam no seu dispositivo.',
    'platform.x': 'X / Twitter',
    'platform.xDesc': 'Posts 2x2 e ilusões de grade',
    'platform.instagram': 'Instagram',
    'platform.instagramDesc': 'Grades 3x3 e tiles de carrossel',
    'mode.xSingle': 'X 2x2',
    'mode.xSingleDesc': 'Divida uma imagem em quatro partes para prévia de post no X.',
    'mode.xCustom': 'X Personalizado',
    'mode.xCustomDesc': 'Use 9 imagens para criar a ilusão de grade original do X.',
    'mode.igGrid': 'IG 3x3',
    'mode.igGridDesc': 'Divida uma imagem em nove posts quadrados para a grade do perfil do Instagram.',
    'mode.igCarousel': 'IG Carrossel',
    'mode.igCarouselDesc': 'Divida uma imagem larga em slides quadrados para um carrossel do Instagram.',
    'select.single': 'Selecionar uma imagem',
    'select.wide': 'Selecionar uma imagem larga',
    'select.nine': 'Selecionar 9 imagens',
    'custom.progress': '{assigned}/9 espaços preenchidos',
    'custom.tip': 'Toque em um espaço abaixo e escolha uma imagem selecionada no popup.',
    'custom.main': 'Imagem principal compartilhada',
    'custom.header': 'Cabeçalho',
    'custom.footer': 'Rodapé',
    'custom.clickAssign': 'Clique para atribuir',
    'tutorial.quickGuide': 'Guia rápido',
    'tutorial.close': 'Fechar tutorial',
    'tutorial.gotIt': 'Entendi',
    'tutorial.customTip': 'Dica: a imagem principal é compartilhada nos quatro tiles de prévia do X. Cabeçalhos e rodapés viram as imagens altas vistas ao abrir cada tile.',
    'tutorial.xSingle1': 'Selecione uma imagem para o post no X/Twitter.',
    'tutorial.xSingle2': 'Escolha preencher ou mostrar tudo para controlar o corte.',
    'tutorial.xSingle3': 'Visualize o layout 2x2.',
    'tutorial.xSingle4': 'Baixe as 4 imagens e anexe todas em um post.',
    'tutorial.xCustom1': 'Selecione exatamente 9 imagens.',
    'tutorial.xCustom2': 'Atribua a imagem principal compartilhada uma vez.',
    'tutorial.xCustom3': 'Toque em cada cabeçalho e rodapé e escolha uma imagem selecionada.',
    'tutorial.xCustom4': 'Quando todos os espaços estiverem preenchidos, crie e baixe as 4 imagens da grade X.',
    'tutorial.igGrid1': 'Selecione uma imagem para espalhar no perfil.',
    'tutorial.igGrid2': 'Escolha preencher os quadrados ou mostrar a imagem inteira.',
    'tutorial.igGrid3': 'Baixe os 9 tiles.',
    'tutorial.igGrid4': 'Publique o tile 09 primeiro e o tile 01 por último para alinhar a grade.',
    'tutorial.igCarousel1': 'Selecione uma imagem larga ou um design.',
    'tutorial.igCarousel2': 'Escolha preencher ou mostrar tudo conforme o corte desejado.',
    'tutorial.igCarousel3': 'Baixe os slides quadrados do carrossel.',
    'tutorial.igCarousel4': 'Publique no Instagram do 01 até o último tile.',
    'preview.igGridOrder': 'Grades de perfil do Instagram mostram o mais recente primeiro. Publique o tile 09 primeiro e o tile 01 por último.',
    'preview.carouselOrder': 'Tiles de carrossel seguem da esquerda para a direita. Publique de 01 até {count}.',
    'preview.xTitle': 'Prévia do post',
    'preview.xMeta': '@yourhandle · agora',
    'preview.xBody': 'Veja como a grade X aparecerá no feed.',
    'preview.openFull': 'Abrir imagem completa',
    'preview.fullImage': 'Imagem completa',
  },
};

type I18nContextValue = {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: TranslationKey, values?: Record<string, string | number>) => string;
};

const I18nContext = createContext<I18nContextValue | null>(null);

export const supportedLocales = Object.keys(localeLabels) as Locale[];
export const getLocaleLabel = (locale: Locale) => localeLabels[locale];

function detectLocale(): Locale {
  if (typeof window === 'undefined') return 'en';

  const pathLocale = pathSlugToLocale(window.location.pathname.split('/')[1]);
  if (pathLocale) return pathLocale;

  const stored = window.localStorage.getItem('x-grid-locale') as Locale | null;
  if (stored && supportedLocales.includes(stored)) return stored;

  const language = navigator.language.toLowerCase();
  if (language.includes('zh-hk') || language.includes('zh-tw')) return 'zh-HK';
  if (language.startsWith('ko')) return 'ko';
  if (language.startsWith('id')) return 'id';
  if (language.startsWith('pt-br') || language.startsWith('pt')) return 'pt-BR';
  return 'en';
}

function pathSlugToLocale(slug: string): Locale | null {
  const map: Record<string, Locale> = {
    'zh-hk': 'zh-HK',
    ko: 'ko',
    id: 'id',
    'pt-br': 'pt-BR',
  };

  return map[slug] || null;
}

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>('en');

  useEffect(() => {
    // The client locale depends on browser URL/preferences and must hydrate after SSR.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLocaleState(detectLocale());
  }, []);

  const value = useMemo<I18nContextValue>(() => {
    const setLocale = (nextLocale: Locale) => {
      setLocaleState(nextLocale);
      window.localStorage.setItem('x-grid-locale', nextLocale);
      document.cookie = `x-grid-locale=${nextLocale}; path=/; max-age=31536000; SameSite=Lax`;
      document.documentElement.lang = nextLocale;
    };

    const t = (key: TranslationKey, values?: Record<string, string | number>) => {
      let value = translations[locale][key] || translations.en[key] || key;
      Object.entries(values || {}).forEach(([name, replacement]) => {
        value = value.replace(`{${name}}`, String(replacement));
      });
      return value;
    };

    return { locale, setLocale, t };
  }, [locale]);

  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error('useI18n must be used inside I18nProvider');
  }
  return context;
}

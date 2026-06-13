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
  | 'tool.uploadImage'
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
  | 'upload.single'
  | 'upload.wide'
  | 'upload.nine'
  | 'custom.progress'
  | 'custom.tip'
  | 'custom.main'
  | 'custom.assign'
  | 'custom.cancel';

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
    'tool.subtitle': 'Pick a platform, choose a format, upload, and export.',
    'tool.choosePlatform': 'Choose platform',
    'tool.chooseFormat': 'Choose format',
    'tool.uploadImage': 'Upload image',
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
    'upload.single': 'Select one image',
    'upload.wide': 'Select one wide image',
    'upload.nine': 'Select 9 images',
    'custom.progress': '{assigned}/9 slots assigned',
    'custom.tip': 'Tap a slot below, then choose one uploaded image from the popup.',
    'custom.main': 'Shared main image',
    'custom.assign': 'Assign image to {slot}',
    'custom.cancel': 'Cancel',
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
    'tool.subtitle': '選平台、選格式、上傳圖片，然後匯出。',
    'tool.choosePlatform': '選擇平台',
    'tool.chooseFormat': '選擇格式',
    'tool.uploadImage': '上傳圖片',
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
    'upload.single': '選擇一張圖片',
    'upload.wide': '選擇一張寬圖',
    'upload.nine': '選擇 9 張圖片',
    'custom.progress': '已指定 {assigned}/9 個位置',
    'custom.tip': '點擊下方位置，然後在彈窗選擇已上傳圖片。',
    'custom.main': '共用主圖',
    'custom.assign': '指定圖片到 {slot}',
    'custom.cancel': '取消',
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
    'tool.subtitle': '플랫폼과 형식을 선택하고 이미지를 업로드한 뒤 내보내세요.',
    'tool.choosePlatform': '플랫폼 선택',
    'tool.chooseFormat': '형식 선택',
    'tool.uploadImage': '이미지 업로드',
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
    'upload.single': '이미지 한 장 선택',
    'upload.wide': '가로 이미지 선택',
    'upload.nine': '이미지 9장 선택',
    'custom.progress': '{assigned}/9 슬롯 지정됨',
    'custom.tip': '아래 슬롯을 누른 뒤 팝업에서 업로드한 이미지를 선택하세요.',
    'custom.main': '공유 메인 이미지',
    'custom.assign': '{slot}에 이미지 지정',
    'custom.cancel': '취소',
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
    'tool.subtitle': 'Pilih platform, pilih format, unggah, lalu ekspor.',
    'tool.choosePlatform': 'Pilih platform',
    'tool.chooseFormat': 'Pilih format',
    'tool.uploadImage': 'Unggah gambar',
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
    'upload.single': 'Pilih satu gambar',
    'upload.wide': 'Pilih satu gambar lebar',
    'upload.nine': 'Pilih 9 gambar',
    'custom.progress': '{assigned}/9 slot terisi',
    'custom.tip': 'Ketuk slot di bawah, lalu pilih gambar yang sudah diunggah dari popup.',
    'custom.main': 'Gambar utama bersama',
    'custom.assign': 'Tetapkan gambar ke {slot}',
    'custom.cancel': 'Batal',
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
    'tool.subtitle': 'Escolha a plataforma, escolha o formato, envie e exporte.',
    'tool.choosePlatform': 'Escolha a plataforma',
    'tool.chooseFormat': 'Escolha o formato',
    'tool.uploadImage': 'Enviar imagem',
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
    'upload.single': 'Selecionar uma imagem',
    'upload.wide': 'Selecionar uma imagem larga',
    'upload.nine': 'Selecionar 9 imagens',
    'custom.progress': '{assigned}/9 espaços preenchidos',
    'custom.tip': 'Toque em um espaço abaixo e escolha uma imagem enviada no popup.',
    'custom.main': 'Imagem principal compartilhada',
    'custom.assign': 'Atribuir imagem a {slot}',
    'custom.cancel': 'Cancelar',
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

  const stored = window.localStorage.getItem('x-grid-locale') as Locale | null;
  if (stored && supportedLocales.includes(stored)) return stored;

  const language = navigator.language.toLowerCase();
  if (language.includes('zh-hk') || language.includes('zh-tw')) return 'zh-HK';
  if (language.startsWith('ko')) return 'ko';
  if (language.startsWith('id')) return 'id';
  if (language.startsWith('pt-br') || language.startsWith('pt')) return 'pt-BR';
  return 'en';
}

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>('en');

  useEffect(() => {
    setLocaleState(detectLocale());
  }, []);

  const value = useMemo<I18nContextValue>(() => {
    const setLocale = (nextLocale: Locale) => {
      setLocaleState(nextLocale);
      window.localStorage.setItem('x-grid-locale', nextLocale);
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

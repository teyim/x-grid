import type { Metadata } from 'next';
import type { GridModeId } from '@/lib/gridModes';
import { SITE_URL } from '@/lib/seo';

export type SeoLocale = 'zh-hk' | 'ko' | 'id' | 'pt-br';
export type PageKind = 'home' | 'twitter' | 'effect' | 'instagram';

export const seoLocales: SeoLocale[] = ['zh-hk', 'ko', 'id', 'pt-br'];

export const localeNames: Record<SeoLocale, string> = {
  'zh-hk': '繁體中文',
  ko: '한국어',
  id: 'Bahasa Indonesia',
  'pt-br': 'Português do Brasil',
};

export const pagePaths: Record<PageKind, string> = {
  home: '/',
  twitter: '/twitter-grid-maker',
  effect: '/create-twitter-grid-effect',
  instagram: '/instagram-grid-maker',
};

export const localizedPageSlugs: Partial<Record<SeoLocale, Partial<Record<PageKind, string>>>> = {
  id: {
    twitter: 'pembuat-grid-twitter',
    instagram: 'pembuat-grid-instagram',
    effect: 'buat-twitter-grid-effect',
  },
  'pt-br': {
    twitter: 'criador-de-grid-twitter',
    instagram: 'criador-de-grid-instagram',
    effect: 'criar-twitter-grid-effect',
  },
  'zh-hk': {
    twitter: 'twitter-網格工具',
    instagram: 'instagram-網格工具',
    effect: '建立-twitter-grid-effect',
  },
};

export const localizedSlugToPageKind = Object.fromEntries(
  Object.entries(localizedPageSlugs).flatMap(([locale, slugs]) =>
    Object.entries(slugs).map(([kind, slug]) => [`${locale}/${slug}`, kind as PageKind])
  )
) as Record<string, PageKind>;

type LocalizedPageContent = {
  title: string;
  description: string;
  kicker: string;
  heading: string;
  body: string;
  metadataTitle: string;
  metadataDescription: string;
  keywords: string[];
  toolModes?: GridModeId[];
  initialMode: GridModeId;
  seoTitle: string;
  seoIntro: string;
  steps: { title: string; text: string }[];
  sections: { title: string; text: string }[];
  faqs: { question: string; answer: string }[];
};

const zhContent: Record<PageKind, LocalizedPageContent> = {
    home: {
      title: 'X 與 Instagram 網格工具',
      description: '在瀏覽器建立 X/Twitter 與 Instagram 圖片網格。',
      kicker: '免費瀏覽器網格工具',
      heading: '製作更好的社交媒體網格',
      body: '在 X/Twitter 與 Instagram 之間切換，預覽版面，下載可直接發佈的圖片。圖片只會留在你的裝置。',
      metadataTitle: 'X 與 Instagram 網格工具 - 免費圖片分割器',
      metadataDescription: '建立 X/Twitter 網格、Twitter grid effect、Instagram 3x3 網格和輪播圖片。所有處理都在瀏覽器完成。',
      keywords: ['Twitter 網格效果', 'X 網格工具', 'Instagram 網格工具'],
      initialMode: 'x-single',
      seoTitle: '如何建立社交媒體圖片網格',
      seoIntro: '選擇平台和格式，上傳圖片，預覽結果並下載可發佈的圖片。',
      steps: [
        { title: '選擇平台', text: '使用 X/Twitter 或 Instagram 預設格式。' },
        { title: '上傳圖片', text: '圖片會在你的瀏覽器中處理，不會上傳到伺服器。' },
        { title: '下載圖片', text: '依照檔名順序發佈產生的圖片。' },
      ],
      sections: [
        { title: '私密處理', text: '圖片分割使用瀏覽器 Canvas，本機完成。' },
        { title: '支援 X/Twitter', text: '可建立 2x2 網格和自訂 Twitter grid effect。' },
        { title: '支援 Instagram', text: '可建立 3x3 個人頁網格和輪播圖片。' },
      ],
      faqs: [
        { question: '圖片會上傳嗎？', answer: '不會。圖片只會在你的瀏覽器中處理。' },
        { question: '可以建立 Instagram 網格嗎？', answer: '可以，支援 3x3 網格和輪播分割。' },
      ],
    },
    twitter: {
      title: 'Twitter 網格工具',
      description: '建立 2x2 Twitter/X 圖片網格和自訂網格幻覺。',
      kicker: 'Twitter 與 X 圖片網格工具',
      heading: '免費 Twitter 網格工具',
      body: '從一張圖片建立 2x2 Twitter/X 圖片網格，適合香港創作者、品牌公告、活動海報和個人頁視覺。圖片只會留在你的瀏覽器。',
      metadataTitle: '免費 Twitter 網格工具',
      metadataDescription: '免費建立 Twitter/X 2x2 圖片網格。預覽貼文版面並在瀏覽器下載已排序圖片。',
      keywords: ['免費 Twitter 網格工具'],
      initialMode: 'x-single',
      toolModes: ['x-single', 'x-custom'],
      seoTitle: '如何建立 Twitter 圖片網格',
      seoIntro: '此工具會產生有順序的圖片，讓 X/Twitter 貼文預覽看起來像一張大型圖片。',
      steps: [
        { title: '上傳視覺圖片', text: '可使用活動海報、產品圖、截圖或個人品牌視覺。' },
        { title: '檢查 2x2 預覽', text: '下載前先確認裁切、排序和貼文顯示效果。' },
        { title: '一起發佈', text: '把所有產生的圖片附加到同一篇 X/Twitter 貼文。' },
      ],
      sections: [
        { title: '適合香港創作者', text: '可用於活動宣傳、社群公告、作品展示和 X 個人頁視覺。' },
        { title: '單張圖片分割', text: '最快方式是把一張圖片分成四張有順序的貼文圖片。' },
        { title: '本機匯出', text: '所有 JPG 都在瀏覽器中產生，原圖不會上傳。' },
      ],
      faqs: [
        { question: '如何建立 Twitter 圖片網格？', answer: '上傳一張圖片，選擇 X 2x2，確認預覽後下載四張圖片並一起發佈。' },
        { question: '這適用於 X 嗎？', answer: '適用。Twitter 和 X 使用相同的多圖片網格顯示概念。' },
        { question: '圖片會上傳到伺服器嗎？', answer: '不會。圖片會在你的瀏覽器本機處理。' },
      ],
    },
    effect: {
      title: '建立 Twitter Grid Effect',
      description: '在線建立 Twitter/X 網格效果。',
      kicker: 'Twitter 與 X 網格效果工具',
      heading: '建立 Twitter Grid Effect',
      body: '從一張圖片製作 Twitter/X grid effect，或建立自訂 9 張圖片網格幻覺。工具會在瀏覽器中私密執行。',
      metadataTitle: '建立 Twitter Grid Effect - 免費 X 網格工具',
      metadataDescription: '在線建立 Twitter grid effect。分割 X/Twitter 圖片、預覽版面並下載網格圖片。',
      keywords: ['create twitter grid effect', 'Twitter grid effect', 'Twitter 網格效果'],
      initialMode: 'x-single',
      toolModes: ['x-single', 'x-custom'],
      seoTitle: '在線建立 Twitter grid effect',
      seoIntro: '分割圖片、檢查 X/Twitter 預覽並下載正確順序的圖片。',
      steps: [
        { title: '選擇效果', text: '使用 X 2x2 或自訂 9 圖片模式。' },
        { title: '預覽效果', text: '確認裁切、排序和貼文版面。' },
        { title: '下載圖片', text: '下載 JPG 並一起附加到 X/Twitter 貼文。' },
      ],
      sections: [
        { title: '單張圖片效果', text: '最快方式是把一張圖片分成四張。' },
        { title: '9 圖片幻覺', text: '自訂模式會產生更高的開圖效果。' },
        { title: '私密處理', text: '原圖不會上傳。' },
      ],
      faqs: [
        { question: '如何建立 Twitter grid effect？', answer: '上傳圖片、選擇 X 2x2，然後下載四張圖片。' },
        { question: '可以用一張圖片建立嗎？', answer: '可以，單張圖片模式會自動分割成四張。' },
      ],
    },
    instagram: {
      title: 'Instagram 網格工具',
      description: '建立 Instagram 3x3 網格和輪播圖片。',
      kicker: 'Instagram 圖片分割工具',
      heading: '免費 Instagram 網格工具',
      body: '把一張圖片變成 Instagram 3x3 個人頁網格，或把寬圖分割成輪播方形圖片，適合品牌、作品集和活動宣傳。',
      metadataTitle: '免費 Instagram 網格工具',
      metadataDescription: '免費建立 Instagram 3x3 個人頁網格和輪播圖片。所有圖片分割都在瀏覽器完成。',
      keywords: ['免費 Instagram 網格工具'],
      initialMode: 'instagram-grid',
      toolModes: ['instagram-grid', 'instagram-carousel'],
      seoTitle: '如何建立 Instagram 3x3 網格',
      seoIntro: '使用 Instagram 預設格式建立個人頁網格、puzzle feed 或輪播貼文。',
      steps: [
        { title: '選擇版面', text: '3x3 用於個人頁網格，輪播用於寬圖。' },
        { title: '選擇裁切', text: '填滿或完整保留圖片。' },
        { title: '下載並發佈', text: '按照檔名順序上傳。' },
      ],
      sections: [
        { title: '適合品牌視覺', text: '可用於香港品牌、創作者作品集、活動宣傳和個人頁視覺規劃。' },
        { title: '1080px 方形輸出', text: '匯出適合 Instagram 貼文使用的方形 JPG。' },
        { title: '不需上傳', text: '圖片在本機處理，不會儲存在伺服器。' },
      ],
      faqs: [
        { question: '如何建立 Instagram 3x3 網格？', answer: '上傳圖片並選擇 IG 3x3，工具會輸出九張方形圖片。' },
        { question: 'Instagram 網格應該按甚麼順序發佈？', answer: '如果要在個人頁拼成完整圖片，通常需要由最後一張開始發佈。' },
        { question: '可以建立輪播圖片嗎？', answer: '可以，選擇 IG 輪播模式即可把寬圖分割成方形輪播圖片。' },
      ],
    },
  };

const localizedContent: Record<SeoLocale, Record<PageKind, LocalizedPageContent>> = {
  'zh-hk': zhContent,
  ko: {
    home: {
      title: 'X 및 Instagram 그리드 만들기',
      description: '브라우저에서 X/Twitter와 Instagram 이미지 그리드를 만드세요.',
      kicker: '무료 브라우저 그리드 도구',
      heading: '더 좋은 소셜 그리드 만들기',
      body: 'X/Twitter와 Instagram을 전환하고, 레이아웃을 미리 본 뒤 바로 게시할 타일을 다운로드하세요. 이미지는 기기에만 남습니다.',
      metadataTitle: 'X 및 Instagram 그리드 만들기 - 무료 이미지 분할기',
      metadataDescription: 'X/Twitter 그리드, Twitter grid effect, Instagram 3x3 그리드와 캐러셀 타일을 만드세요.',
      keywords: ['Twitter grid effect', 'X grid maker', 'Instagram grid maker'],
      initialMode: 'x-single',
      seoTitle: '소셜 미디어 이미지 그리드 만드는 방법',
      seoIntro: '플랫폼과 형식을 선택하고 이미지를 업로드한 뒤 미리보기와 다운로드를 진행하세요.',
      steps: [
        { title: '플랫폼 선택', text: 'X/Twitter 또는 Instagram 형식을 선택하세요.' },
        { title: '이미지 업로드', text: '이미지는 브라우저에서 처리됩니다.' },
        { title: '타일 다운로드', text: '파일명 순서대로 게시하세요.' },
      ],
      sections: [
        { title: '비공개 처리', text: '이미지는 서버로 업로드되지 않습니다.' },
        { title: 'X/Twitter 지원', text: '2x2 그리드와 Twitter grid effect를 만들 수 있습니다.' },
        { title: 'Instagram 지원', text: '3x3 그리드와 캐러셀 타일을 만들 수 있습니다.' },
      ],
      faqs: [
        { question: '이미지가 업로드되나요?', answer: '아니요. 브라우저에서만 처리됩니다.' },
        { question: 'Instagram 그리드도 가능한가요?', answer: '네. 3x3과 캐러셀을 지원합니다.' },
      ],
    },
    twitter: makeVariant('ko', 'twitter'),
    effect: makeVariant('ko', 'effect'),
    instagram: makeVariant('ko', 'instagram'),
  },
  id: {
    home: makeVariant('id', 'home'),
    twitter: makeVariant('id', 'twitter'),
    effect: makeVariant('id', 'effect'),
    instagram: makeVariant('id', 'instagram'),
  },
  'pt-br': {
    home: makeVariant('pt-br', 'home'),
    twitter: makeVariant('pt-br', 'twitter'),
    effect: makeVariant('pt-br', 'effect'),
    instagram: makeVariant('pt-br', 'instagram'),
  },
};

function makeVariant(locale: SeoLocale, kind: PageKind): LocalizedPageContent {
  const base = zhContent[kind];
  const labels: Partial<Record<SeoLocale, Partial<Record<PageKind, Pick<LocalizedPageContent, 'title' | 'description' | 'kicker' | 'heading' | 'body' | 'metadataTitle' | 'metadataDescription' | 'seoTitle' | 'seoIntro'>>>>> = {
    'zh-hk': {},
    ko: {
      twitter: {
        title: 'Twitter 그리드 만들기',
        description: '2x2 Twitter/X 이미지 그리드와 커스텀 효과를 만드세요.',
        kicker: 'Twitter 및 X 이미지 그리드 도구',
        heading: '무료 트위터 그리드 생성기',
        body: '이미지 한 장으로 2x2 Twitter 그리드를 만들거나 커스텀 그리드 효과를 사용하세요. 이미지는 브라우저에만 남습니다.',
        metadataTitle: '무료 트위터 그리드 생성기',
        metadataDescription: '브라우저에서 무료로 Twitter/X 2x2 이미지 그리드를 만들고 정렬된 타일을 다운로드하세요.',
        seoTitle: 'Twitter/X 이미지 그리드 표시 방식',
        seoIntro: 'X/Twitter 피드에서 큰 이미지처럼 보이도록 정렬된 타일을 생성합니다.',
      },
      effect: {
        title: 'Twitter Grid Effect 만들기',
        description: '온라인에서 Twitter/X 그리드 효과를 만드세요.',
        kicker: 'Twitter 및 X 그리드 효과 도구',
        heading: 'Twitter Grid Effect 만들기',
        body: '이미지 한 장으로 Twitter/X grid effect를 만들거나 9장 커스텀 효과를 만드세요.',
        metadataTitle: 'Twitter Grid Effect 만들기 - 무료 X 그리드 도구',
        metadataDescription: '온라인에서 Twitter grid effect를 만들고 타일을 다운로드하세요.',
        seoTitle: '온라인 Twitter grid effect 만들기',
        seoIntro: '이미지를 분할하고 X/Twitter 미리보기를 확인한 뒤 올바른 순서로 다운로드하세요.',
      },
      instagram: {
        title: 'Instagram 그리드 만들기',
        description: 'Instagram 3x3 그리드와 캐러셀 타일을 만드세요.',
        kicker: 'Instagram 이미지 분할 도구',
        heading: '무료 인스타그램 그리드 생성기',
        body: '이미지 한 장을 Instagram 3x3 프로필 그리드 또는 캐러셀 타일로 나누세요.',
        metadataTitle: '무료 인스타그램 그리드 생성기',
        metadataDescription: '사진 한 장으로 Instagram 3x3 프로필 그리드와 캐러셀 타일을 무료로 만드세요.',
        seoTitle: 'Instagram 이미지 분할 방법',
        seoIntro: '프로필 그리드 또는 캐러셀 게시물용 정사각형 타일을 만드세요.',
      },
      home: {
        title: 'X 및 Instagram 그리드 만들기',
        description: '브라우저에서 소셜 이미지 그리드를 만드세요.',
        kicker: '무료 브라우저 그리드 도구',
        heading: '더 좋은 소셜 그리드 만들기',
        body: 'X/Twitter와 Instagram을 전환하고, 미리본 뒤 타일을 다운로드하세요.',
        metadataTitle: 'X 및 Instagram 그리드 만들기',
        metadataDescription: 'X/Twitter와 Instagram 이미지 그리드를 브라우저에서 만드세요.',
        seoTitle: '소셜 미디어 이미지 그리드 만드는 방법',
        seoIntro: '플랫폼과 형식을 선택하고 이미지를 업로드하세요.',
      },
    },
    id: {
      home: {
        title: 'Pembuat Grid X dan Instagram',
        description: 'Buat grid gambar sosial di browser.',
        kicker: 'Pembuat grid gratis di browser',
        heading: 'Buat grid sosial lebih baik',
        body: 'Beralih antara X/Twitter dan Instagram, pratinjau, lalu unduh tile siap posting.',
        metadataTitle: 'Pembuat Grid X dan Instagram',
        metadataDescription: 'Buat grid X/Twitter dan Instagram langsung di browser.',
        seoTitle: 'Cara membuat grid gambar media sosial',
        seoIntro: 'Pilih platform dan format, unggah gambar, lalu unduh tile.',
      },
      twitter: {
        title: 'Pembuat Grid Twitter',
        description: 'Buat grid gambar Twitter/X 2x2 dan efek kustom.',
        kicker: 'Alat grid foto Twitter dan X',
        heading: 'Pembuat Grid Twitter Gratis Online',
        body: 'Buat grid foto Twitter/X 2x2 dari satu gambar untuk post kreator, banner profil, atau promosi. Semua proses berjalan di browser.',
        metadataTitle: 'Pembuat Grid Twitter Gratis Online',
        metadataDescription: 'Buat grid Twitter/X 2x2 online gratis. Split gambar menjadi tile berurutan dan unduh langsung dari browser.',
        seoTitle: 'Cara membuat grid Twitter untuk kreator Indonesia',
        seoIntro: 'Gunakan pembuat grid Twitter untuk membagi gambar promosi, poster, atau visual profil menjadi tile yang siap diposting.',
      },
      effect: {
        title: 'Buat Twitter Grid Effect',
        description: 'Buat efek grid Twitter/X secara online.',
        kicker: 'Alat efek grid Twitter dan X',
        heading: 'Buat Twitter Grid Effect',
        body: 'Buat Twitter/X grid effect dari satu gambar atau mode kustom 9 gambar.',
        metadataTitle: 'Buat Twitter Grid Effect - Gratis',
        metadataDescription: 'Buat Twitter grid effect online dan unduh tile privat di browser.',
        seoTitle: 'Buat Twitter grid effect online',
        seoIntro: 'Pisahkan gambar, periksa pratinjau, lalu unduh tile dalam urutan benar.',
      },
      instagram: {
        title: 'Pembuat Grid Instagram',
        description: 'Buat grid Instagram 3x3 dan carousel.',
        kicker: 'Alat pemisah gambar Instagram',
        heading: 'Pembuat Grid Instagram Gratis Online',
        body: 'Ubah satu foto menjadi grid profil Instagram 3x3 atau tile carousel untuk feed kreator, brand kecil, dan kampanye lokal.',
        metadataTitle: 'Pembuat Grid Instagram Gratis Online',
        metadataDescription: 'Buat grid Instagram 3x3 gratis di browser. Split foto menjadi tile feed atau carousel tanpa upload ke server.',
        seoTitle: 'Cara membuat grid Instagram 3x3',
        seoIntro: 'Gunakan pembuat grid Instagram untuk membuat puzzle feed, grid profil, atau carousel dari satu foto.',
      },
    },
    'pt-br': {
      home: {
        title: 'Criador de Grade para X e Instagram',
        description: 'Crie grades sociais no navegador.',
        kicker: 'Criador de grades grátis no navegador',
        heading: 'Crie grades sociais melhores',
        body: 'Alterne entre X/Twitter e Instagram, visualize e baixe tiles prontos para postar.',
        metadataTitle: 'Criador de Grade para X e Instagram',
        metadataDescription: 'Crie grades para X/Twitter e Instagram direto no navegador.',
        seoTitle: 'Como criar grades de imagem para redes sociais',
        seoIntro: 'Escolha plataforma e formato, envie a imagem e baixe os tiles.',
      },
      twitter: {
        title: 'Criador de Grade para Twitter',
        description: 'Crie grades 2x2 para Twitter/X e efeitos personalizados.',
        kicker: 'Ferramenta de grade para Twitter e X',
        heading: 'Criador de Grid para Twitter Grátis',
        body: 'Crie uma grade 2x2 para Twitter/X a partir de uma imagem, com prévia e download dos tiles no navegador.',
        metadataTitle: 'Criador de Grid para Twitter Grátis',
        metadataDescription: 'Crie grid para Twitter/X grátis online. Divida imagens em tiles ordenados e baixe tudo no navegador.',
        seoTitle: 'Como criar grid para Twitter',
        seoIntro: 'Use o criador de grid para Twitter para transformar uma imagem em tiles prontos para postar.',
      },
      effect: {
        title: 'Criar Twitter Grid Effect',
        description: 'Crie um efeito de grade para Twitter/X online.',
        kicker: 'Ferramenta de efeito de grade para Twitter e X',
        heading: 'Criar Twitter Grid Effect',
        body: 'Crie um Twitter/X grid effect a partir de uma imagem ou use o modo personalizado com 9 imagens.',
        metadataTitle: 'Criar Twitter Grid Effect - Grátis',
        metadataDescription: 'Crie Twitter grid effect online e baixe os tiles no navegador.',
        seoTitle: 'Criar Twitter grid effect online',
        seoIntro: 'Divida a imagem, confira a prévia e baixe os tiles na ordem correta.',
      },
      instagram: {
        title: 'Criador de Grade para Instagram',
        description: 'Crie grades 3x3 e carrosséis para Instagram.',
        kicker: 'Ferramenta de divisão para Instagram',
        heading: 'Criador de Grid para Instagram Grátis',
        body: 'Transforme uma foto em grade 3x3 para o perfil do Instagram ou em tiles quadrados para carrossel.',
        metadataTitle: 'Criador de Grid para Instagram Grátis',
        metadataDescription: 'Crie grid para Instagram grátis online. Divida fotos em grade 3x3 ou carrossel direto no navegador.',
        seoTitle: 'Como criar grid para Instagram',
        seoIntro: 'Use presets do Instagram para criar feed puzzle, grade de perfil ou carrossel.',
      },
    },
  };

  const localized = labels[locale]?.[kind];
  const blocks = getLocalizedBlocks(locale, kind);
  return {
    ...base,
    ...localized,
    ...blocks,
    keywords: localized ? [localized.heading] : base.keywords,
  };
}

function getLocalizedBlocks(
  locale: SeoLocale,
  kind: PageKind
): Pick<LocalizedPageContent, 'steps' | 'sections' | 'faqs'> {
  if (locale === 'zh-hk') {
    const { steps, sections, faqs } = zhContent[kind];
    return { steps, sections, faqs };
  }

  const copy = {
    ko: {
      home: {
        steps: [
          { title: '플랫폼 선택', text: 'X/Twitter 또는 Instagram 형식을 선택하세요.' },
          { title: '이미지 업로드', text: '이미지는 브라우저에서만 처리됩니다.' },
          { title: '타일 다운로드', text: '파일명 순서대로 게시하세요.' },
        ],
        sections: [
          { title: '비공개 처리', text: '이미지를 서버로 업로드하지 않고 로컬 Canvas로 분할합니다.' },
          { title: 'X/Twitter 지원', text: '2x2 그리드와 커스텀 Twitter grid effect를 만들 수 있습니다.' },
          { title: 'Instagram 지원', text: '3x3 프로필 그리드와 캐러셀 타일을 만들 수 있습니다.' },
        ],
        faqs: [
          { question: '이미지가 업로드되나요?', answer: '아니요. 이미지는 사용자의 브라우저에서만 처리됩니다.' },
          { question: 'Instagram 그리드도 만들 수 있나요?', answer: '네. 3x3 그리드와 캐러셀 분할을 지원합니다.' },
        ],
      },
      twitter: {
        steps: [
          { title: '이미지 선택', text: '한 장을 분할하거나 9장 커스텀 모드를 사용하세요.' },
          { title: '미리보기 확인', text: '다운로드 전에 X/Twitter 2x2 레이아웃을 확인하세요.' },
          { title: '한 게시물에 첨부', text: '생성된 이미지를 모두 같은 게시물에 올리세요.' },
        ],
        sections: [
          { title: '단일 이미지 분할', text: '포스터, 스크린샷, 넓은 이미지에 적합합니다.' },
          { title: '커스텀 그리드 효과', text: '9장 이미지로 더 강한 열람 효과를 만들 수 있습니다.' },
          { title: '로컬 내보내기', text: '모든 JPG 파일은 브라우저에서 생성됩니다.' },
        ],
        faqs: [
          { question: 'Twitter에서도 작동하나요?', answer: '네. Twitter와 X는 같은 이미지 그리드 개념을 사용합니다.' },
          { question: '항상 9장이 필요한가요?', answer: '아니요. 9장은 커스텀 효과 모드에서만 필요합니다.' },
        ],
      },
      effect: {
        steps: [
          { title: '효과 선택', text: 'X 2x2 또는 커스텀 9장 모드를 선택하세요.' },
          { title: '미리보기 확인', text: '자르기, 순서, 게시물 레이아웃을 확인하세요.' },
          { title: '타일 다운로드', text: 'JPG 파일을 내려받아 X/Twitter 게시물에 함께 첨부하세요.' },
        ],
        sections: [
          { title: '한 장으로 빠르게 만들기', text: '가장 빠른 방법은 이미지를 네 조각으로 나누는 것입니다.' },
          { title: '9장 이미지 효과', text: '커스텀 모드는 타일을 열었을 때 보이는 이미지를 제어합니다.' },
          { title: '비공개 처리', text: '원본 이미지는 업로드되지 않습니다.' },
        ],
        faqs: [
          { question: 'Twitter grid effect는 어떻게 만드나요?', answer: '이미지를 업로드하고 X 2x2를 선택한 뒤 네 장을 다운로드하세요.' },
          { question: '이미지 한 장으로 가능한가요?', answer: '네. 단일 이미지 모드가 자동으로 네 장으로 분할합니다.' },
        ],
      },
      instagram: {
        steps: [
          { title: '형식 선택', text: '프로필 그리드는 3x3, 넓은 이미지는 캐러셀을 선택하세요.' },
          { title: '자르기 선택', text: '정사각형을 채우거나 전체 이미지를 보이게 하세요.' },
          { title: '다운로드 및 게시', text: '파일명 순서에 맞춰 업로드하세요.' },
        ],
        sections: [
          { title: '권장 크기', text: '도구는 Instagram에 쓰기 좋은 1080px 정사각형 JPG를 내보냅니다.' },
          { title: '그리드와 캐러셀', text: '그리드는 여러 게시물에 걸치고 캐러셀은 한 게시물 안에 남습니다.' },
          { title: '업로드 없음', text: '이미지는 로컬에서 처리됩니다.' },
        ],
        faqs: [
          { question: '3x3 Instagram 그리드는 어떻게 만드나요?', answer: '이미지를 업로드하고 IG 3x3 형식을 선택하세요.' },
          { question: '캐러셀 이미지도 만들 수 있나요?', answer: '네. IG 캐러셀 모드를 선택하세요.' },
        ],
      },
    },
    id: {
      home: {
        steps: [
          { title: 'Pilih platform', text: 'Gunakan preset X/Twitter atau Instagram.' },
          { title: 'Pilih gambar', text: 'Gambar diproses di browser dan tetap di perangkat Anda.' },
          { title: 'Unduh tile', text: 'Posting sesuai urutan nama file.' },
        ],
        sections: [
          { title: 'Pemrosesan privat', text: 'Pemotongan gambar memakai Canvas lokal di browser.' },
          { title: 'Dukungan X/Twitter', text: 'Buat grid 2x2 dan efek grid Twitter kustom.' },
          { title: 'Dukungan Instagram', text: 'Buat grid profil 3x3 dan tile carousel.' },
        ],
        faqs: [
          { question: 'Apakah gambar saya diunggah?', answer: 'Tidak. Gambar hanya diproses di browser Anda.' },
          { question: 'Bisa membuat grid Instagram?', answer: 'Bisa. Mode 3x3 dan carousel tersedia.' },
        ],
      },
      twitter: {
        steps: [
          { title: 'Unggah visual', text: 'Pilih poster, banner, screenshot, atau desain kampanye yang ingin dijadikan grid Twitter.' },
          { title: 'Cek pratinjau 2x2', text: 'Pastikan urutan tile terlihat rapi sebelum diunduh.' },
          { title: 'Posting di X/Twitter', text: 'Lampirkan semua tile ke satu posting agar tampil sebagai grid.' },
        ],
        sections: [
          { title: 'Untuk kreator Indonesia', text: 'Cocok untuk pengumuman komunitas, promosi produk digital, poster event, dan banner profil X.' },
          { title: 'Grid dari satu gambar', text: 'Mode cepat membagi satu gambar menjadi empat tile berurutan untuk feed Twitter/X.' },
          { title: 'Privat di browser', text: 'File dibuat langsung di perangkat Anda tanpa upload gambar ke server.' },
        ],
        faqs: [
          { question: 'Bagaimana cara membuat grid Twitter?', answer: 'Unggah satu gambar, pilih X 2x2, cek pratinjau, lalu unduh empat tile untuk diposting bersama.' },
          { question: 'Apakah bisa dipakai untuk X?', answer: 'Bisa. Twitter dan X memakai konsep grid gambar yang sama untuk posting multi-gambar.' },
          { question: 'Apakah gambar saya diunggah?', answer: 'Tidak. Pemrosesan dilakukan di browser, jadi gambar tetap berada di perangkat Anda.' },
        ],
      },
      effect: {
        steps: [
          { title: 'Pilih efek', text: 'Gunakan X 2x2 atau mode kustom 9 gambar.' },
          { title: 'Pratinjau efek', text: 'Periksa potongan, urutan, dan layout posting.' },
          { title: 'Unduh tile', text: 'Unduh JPG lalu lampirkan bersama di X/Twitter.' },
        ],
        sections: [
          { title: 'Efek satu gambar', text: 'Cara tercepat adalah membagi satu gambar menjadi empat.' },
          { title: 'Ilusi 9 gambar', text: 'Mode kustom memberi kontrol pada gambar saat tile dibuka.' },
          { title: 'Privat di browser', text: 'Gambar asli tidak diunggah.' },
        ],
        faqs: [
          { question: 'Bagaimana membuat Twitter grid effect?', answer: 'Unggah gambar, pilih X 2x2, lalu unduh empat tile.' },
          { question: 'Bisa pakai satu gambar?', answer: 'Bisa. Mode satu gambar akan membaginya otomatis.' },
        ],
      },
      instagram: {
        steps: [
          { title: 'Pilih format feed', text: 'Gunakan 3x3 untuk puzzle feed atau carousel untuk desain lebar.' },
          { title: 'Atur crop', text: 'Pilih cover agar tile penuh atau contain agar gambar tetap terlihat utuh.' },
          { title: 'Unduh dan posting', text: 'Gunakan nama file berurutan saat upload ke Instagram.' },
        ],
        sections: [
          { title: 'Untuk feed kreator', text: 'Buat puzzle feed untuk brand lokal, toko online, portofolio, atau pengumuman event.' },
          { title: 'Tile 1080px', text: 'Tool mengekspor JPG kotak 1080px yang praktis untuk posting Instagram.' },
          { title: 'Tanpa upload server', text: 'Foto diproses secara lokal di browser dan tidak disimpan oleh situs.' },
        ],
        faqs: [
          { question: 'Bagaimana cara membuat grid Instagram 3x3?', answer: 'Unggah satu foto, pilih IG 3x3, lalu unduh sembilan tile untuk diposting ke profil.' },
          { question: 'Urutan posting grid Instagram bagaimana?', answer: 'Untuk profil grid, biasanya tile terakhir diposting lebih dulu agar tampilan akhir tersusun rapi.' },
          { question: 'Bisa membuat carousel Instagram?', answer: 'Bisa. Pilih mode IG Carousel untuk membagi gambar lebar menjadi slide kotak.' },
        ],
      },
    },
    'pt-br': {
      home: {
        steps: [
          { title: 'Escolha a plataforma', text: 'Use presets para X/Twitter ou Instagram.' },
          { title: 'Envie a imagem', text: 'A imagem é processada no navegador, não no servidor.' },
          { title: 'Baixe os tiles', text: 'Publique seguindo a ordem dos nomes dos arquivos.' },
        ],
        sections: [
          { title: 'Processamento privado', text: 'A divisão usa Canvas local no navegador.' },
          { title: 'Suporte a X/Twitter', text: 'Crie grades 2x2 e Twitter grid effect personalizado.' },
          { title: 'Suporte a Instagram', text: 'Crie grades 3x3 de perfil e tiles de carrossel.' },
        ],
        faqs: [
          { question: 'Minhas imagens são enviadas?', answer: 'Não. Elas são processadas apenas no seu navegador.' },
          { question: 'Posso criar grade para Instagram?', answer: 'Sim. Há modos 3x3 e carrossel.' },
        ],
      },
      twitter: {
        steps: [
          { title: 'Envie o visual', text: 'Use um pôster, banner, captura de tela ou arte de campanha para criar o grid.' },
          { title: 'Confira a prévia 2x2', text: 'Veja corte, ordem e aparência do post antes de baixar.' },
          { title: 'Publique no X/Twitter', text: 'Anexe todos os tiles no mesmo post para formar a grade.' },
        ],
        sections: [
          { title: 'Para criadores no Brasil', text: 'Use em lançamentos, comunidades, eventos, portfólios, memes visuais e anúncios de produtos digitais.' },
          { title: 'Grid de uma imagem', text: 'O modo rápido divide uma imagem em quatro tiles ordenados para o feed do X/Twitter.' },
          { title: 'Exportação local', text: 'Todos os JPGs são gerados no navegador, sem enviar sua imagem ao servidor.' },
        ],
        faqs: [
          { question: 'Como criar grid para Twitter?', answer: 'Envie uma imagem, escolha X 2x2, confira a prévia e baixe os quatro tiles para postar juntos.' },
          { question: 'Funciona para X também?', answer: 'Sim. Twitter e X usam o mesmo conceito de grade para posts com várias imagens.' },
          { question: 'Minha imagem é enviada?', answer: 'Não. A divisão acontece no navegador e a imagem fica no seu dispositivo.' },
        ],
      },
      effect: {
        steps: [
          { title: 'Escolha o efeito', text: 'Use X 2x2 ou o modo personalizado com 9 imagens.' },
          { title: 'Confira a prévia', text: 'Verifique corte, ordem e layout do post.' },
          { title: 'Baixe os tiles', text: 'Baixe os JPGs e anexe todos no post do X/Twitter.' },
        ],
        sections: [
          { title: 'Efeito com uma imagem', text: 'O jeito mais rápido é dividir uma imagem em quatro partes.' },
          { title: 'Ilusão com 9 imagens', text: 'O modo personalizado controla o que aparece quando cada tile é aberto.' },
          { title: 'Privado no navegador', text: 'A imagem original não é enviada.' },
        ],
        faqs: [
          { question: 'Como criar Twitter grid effect?', answer: 'Envie a imagem, escolha X 2x2 e baixe os quatro tiles.' },
          { question: 'Posso usar uma única imagem?', answer: 'Sim. O modo de imagem única divide automaticamente em quatro.' },
        ],
      },
      instagram: {
        steps: [
          { title: 'Escolha o formato do feed', text: 'Use 3x3 para feed puzzle ou carrossel para imagens largas.' },
          { title: 'Ajuste o corte', text: 'Preencha os quadrados ou mantenha a imagem inteira visível.' },
          { title: 'Baixe e publique', text: 'Envie seguindo a ordem dos nomes dos arquivos.' },
        ],
        sections: [
          { title: 'Para feed puzzle', text: 'Crie layouts para marcas brasileiras, lojas, artistas, eventos, portfólios e lançamentos.' },
          { title: 'Tiles de 1080px', text: 'A ferramenta exporta JPGs quadrados de 1080px para posts do Instagram.' },
          { title: 'Sem envio ao servidor', text: 'As imagens são processadas localmente e não ficam armazenadas no site.' },
        ],
        faqs: [
          { question: 'Como criar grid para Instagram?', answer: 'Envie uma foto, escolha IG 3x3 e baixe nove tiles quadrados para publicar no perfil.' },
          { question: 'Qual é a ordem para postar um grid 3x3?', answer: 'Para montar a imagem no perfil, publique normalmente do último tile para o primeiro.' },
          { question: 'Posso criar carrossel para Instagram?', answer: 'Sim. Use o modo IG Carrossel para dividir uma imagem larga em slides quadrados.' },
        ],
      },
    },
  };

  return copy[locale][kind];
}

export function getLocalizedContent(locale: SeoLocale, kind: PageKind) {
  return localizedContent[locale][kind];
}

export function getLocalizedPath(locale: SeoLocale, kind: PageKind) {
  const localizedSlug = localizedPageSlugs[locale]?.[kind];

  if (localizedSlug) {
    return `/${locale}/${localizedSlug}`;
  }

  const path = pagePaths[kind];
  return path === '/' ? `/${locale}` : `/${locale}${path}`;
}

export function getLanguageAlternates(kind: PageKind) {
  return {
    en: `${SITE_URL}${pagePaths[kind]}`,
    'x-default': `${SITE_URL}${pagePaths[kind]}`,
    'zh-HK': `${SITE_URL}${getLocalizedPath('zh-hk', kind)}`,
    ko: `${SITE_URL}${getLocalizedPath('ko', kind)}`,
    id: `${SITE_URL}${getLocalizedPath('id', kind)}`,
    'pt-BR': `${SITE_URL}${getLocalizedPath('pt-br', kind)}`,
  };
}

export function buildLocalizedMetadata(locale: SeoLocale, kind: PageKind): Metadata {
  const content = getLocalizedContent(locale, kind);
  const path = getLocalizedPath(locale, kind);
  const url = `${SITE_URL}${path}`;

  return {
    title: content.metadataTitle,
    description: content.metadataDescription,
    alternates: {
      canonical: url,
      languages: getLanguageAlternates(kind),
    },
    keywords: content.keywords,
    openGraph: {
      title: content.metadataTitle,
      description: content.metadataDescription,
      url,
      siteName: 'X-Grid',
      type: 'website',
      locale,
    },
    twitter: {
      card: 'summary',
      title: content.metadataTitle,
      description: content.metadataDescription,
    },
  };
}

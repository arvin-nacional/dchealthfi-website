export type Locale = 'en' | 'zh'

export const translations = {
  en: {
    // Navigation
    home: 'Home',
    products: 'Products',
    about: 'About',
    contact: 'Contact',

    // Common
    learnMore: 'Learn More',
    download: 'Download',
    watch: 'Watch',
    search: 'Search',
    filter: 'Filter',
    category: 'Category',
    allCategories: 'All Categories',

    // Product/Flyer Page
    productInfo: 'Product Info',
    productVideo: 'Product Video',
    testimonialVideo: 'Testimonial Video',
    testimonials: 'Product Testimonials',
    description: 'Description',
    downloadPDF: 'Download PDF',
    additionalFiles: 'Additional Files',
    fileSize: 'File Size',

    // Language Selector
    selectLanguage: 'Select Language',
    english: 'English',
    chinese: '中文',

    // SEO
    siteTitle: 'DC Health Fi',
    siteDescription: 'Your health and wellness partner',
  },
  zh: {
    // Navigation
    home: '首页',
    products: '产品',
    about: '关于我们',
    contact: '联系我们',

    // Common
    learnMore: '了解更多',
    download: '下载',
    watch: '观看',
    search: '搜索',
    filter: '筛选',
    category: '类别',
    allCategories: '所有类别',

    // Product/Flyer Page
    productInfo: '产品信息',
    productVideo: '产品视频',
    testimonialVideo: '客户评价视频',
    testimonials: '产品评价',
    description: '描述',
    downloadPDF: '下载PDF',
    additionalFiles: '附加文件',
    fileSize: '文件大小',

    // Language Selector
    selectLanguage: '选择语言',
    english: 'English',
    chinese: '中文',

    // SEO
    siteTitle: 'DC Health Fi',
    siteDescription: '您的健康与保健伙伴',
  },
}

export function useTranslation(locale: Locale) {
  return {
    t: (key: keyof typeof translations.en) => translations[locale][key] || translations.en[key],
    locale,
  }
}

/**
 * Get locale from client-side localStorage
 */
export function getClientLocale(): Locale {
  if (typeof window === 'undefined') return 'en'
  const locale = localStorage.getItem('locale') as Locale
  return locale === 'zh' ? 'zh' : 'en'
}

/**
 * Set locale in both localStorage and cookies
 */
export function setClientLocale(locale: Locale) {
  if (typeof window === 'undefined') return
  localStorage.setItem('locale', locale)
  document.cookie = `NEXT_LOCALE=${locale};path=/;max-age=31536000`
}

import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    debug: false,
    fallbackLng: 'EN',
    interpolation: {
      escapeValue: false,
    },
    resources: {
      EN: {
        translation: {
          home: "Home",
          products: "Products",
          contact: "Contact",
          account: "Account",
          search: "Search products...",
          welcome: "Welcome to Green Farm Export",
          heroTitle: "Premium Quality Export",
          subtitle: "Farm-Fresh Fruits & Vegetables - Delivered Globally",
          viewProducts: "View Products",
          contactUs: "Contact Us",
          certifiedStandards: "Certified Quality Standards",
          productsCatalogTitle: "Our Export Catalog",
          productsCatalogSubtitle: "Premium farm-fresh produce available for bulk orders.",
          gradeLabel: "Grade:",
          packingLabel: "Packing:",
          requestQuoteBtn: "Request Quote",
          contactTitle: "Request a Price Quote",
          yourName: "Your Name",
          emailLabel: "Email",
          quantityLabel: "Quantity (Tons)",
          destinationLabel: "Destination Country",
          messageLabel: "Special Instructions",
          submitButton: "Submit Quote Request",
          successAlert: "Your Quote Request has been sent successfully!",
          errorAlert: "Failed to send request. Please try again."
        }
      },
      AR: {
        translation: {
          home: "الرئيسية",
          products: "المنتجات",
          contact: "اتصل بنا",
          account: "الحساب",
          search: "البحث عن المنتجات...",
          welcome: "مرحباً بكم في غرين فارم إكسبرورت",
          heroTitle: "تصدير بجودة ممتازة",
          subtitle: "فواكه وخضروات طازجة من المزرعة - تُسلم عالمياً",
          viewProducts: "عرض المنتجات",
          contactUs: "اتصل بنا",
          certifiedStandards: "معايير جودة معتمدة",
          productsCatalogTitle: "كتالوج التصدير الخاص بنا",
          productsCatalogSubtitle: "منتجات طازجة عالية الجودة متاحة للطلبات بالجملة.",
          gradeLabel: "الدرجة:",
          packingLabel: "التعبئة:",
          requestQuoteBtn: "طلب عرض سعر",
          contactTitle: "طلب عرض سعر",
          yourName: "اسمك",
          emailLabel: "البريد الإلكتروني",
          quantityLabel: "الكمية (بالطن)",
          destinationLabel: "دولة الوجهة",
          messageLabel: "تعليمات خاصة",
          submitButton: "إرسال طلب السعر",
          successAlert: "تم إرسال طلب عرض السعر بنجاح!",
          errorAlert: "فشل إرسال الطلب. يرجى المحاولة مرة أخرى."
        }
      },
      ZH: {
        translation: {
          home: "首页",
          products: "产品",
          contact: "联系我们",
          account: "账户",
          search: "搜索产品...",
          welcome: "欢迎来到绿色农场出口",
          heroTitle: "优质出口产品",
          subtitle: "农场新鲜果蔬 - 全球配送",
          viewProducts: "查看产品",
          contactUs: "联系我们",
          certifiedStandards: "认证质量标准",
          productsCatalogTitle: "我们的出口目录",
          productsCatalogSubtitle: "提供大量农场新鲜农产品供批量订购。",
          gradeLabel: "等级：",
          packingLabel: "包装：",
          requestQuoteBtn: "获取报价",
          contactTitle: "索取报价",
          yourName: "您的姓名",
          emailLabel: "电子邮箱",
          quantityLabel: "数量（吨）",
          destinationLabel: "目的国",
          messageLabel: "特殊说明",
          submitButton: "提交报价请求",
          successAlert: "您的报价请求已成功发送！",
          errorAlert: "发送请求失败，请重试。"
        }
      }
    }
  });

export default i18n;
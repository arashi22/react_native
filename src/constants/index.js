import keyMirror from 'keymirror';
import { Platform } from 'react-native';

export const LOCAL_STORAGE_USER = 'oratio.session';

export const ActionTypes = keyMirror({
	LOGIN: null,
	LOGIN_SUCCESS: null,
	LOGIN_FAILED: null,
	LOGOUT: null,
  SET_CURRENCY: null,
  WITHDRAW_REQUESTED: null,
  WITHDRAW_SUCCESS: null,
  WITHDRAW_FAILED: null,
  SET_DRAWER_BACKGROUND: null,
  SET_HEADER_TITLE: null,
  DRAWER_OPEN: null,
  DRAWER_CLOSE: null,
  LOAD_ACCOUNT_INFO: null,
  LOAD_ACCOUNT_INFO_SUCCESS: null,
  LOAD_ACCOUNT_INFO_FAILED: null,
  CLEAR_ACCOUNT_INFO: null,
  TRANSACTIONS_REQUESTED: null,
  TRANSACTIONS_SUCCESS: null,
  TRANSACTIONS_FAILED: null,
  TRANSACTION_DETAIL_REQUESTED: null,
  TRANSACTION_DETAIL_SUCCESS: null,
  TRANSACTION_DETAIL_FAILED: null,
  PAYMENTS_REQUESTED: null,
  PAYMENTS_SUCCESS: null,
  PAYMENTS_FAILED: null,
  PAYMENT_DETAIL_REQUESTED: null,
  PAYMENT_DETAIL_SUCCESS: null,
  PAYMENT_DETAIL_FAILED: null,
  LOAD_SESSIONS: null,
  LOAD_SESSIONS_SUCCESS: null,
  LOAD_SESSIONS_FAILED: null,
  LOAD_PRODUCTS: null,
  LOAD_PRODUCTS_SUCCESS: null,
  LOAD_PRODUCTS_FAILED: null,
  CLEAR_SESSIONS: null
});

export const API_Config = {
	baseUrl: 'http://salesdevserver.tryoratio.com/salesapp/v2/',
	appVersion: '3.31.0',
  mobileAppId: 1,
  languageCode: 1,
  deviceProperties: {
    DevicePrint: 'version=3.4.1.0_1&pm_fpua=mozilla/5.0 (windows nt 10.0; wow64) applewebkit/537.36 (khtml, like gecko) chrome/48.0.2564.109 safari/537.36|5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/48.0.2564.109 Safari/537.36|Win32&pm_fpsc=24|1920|1080|1040&pm_fpsw=&pm_fptz=2&pm_fpln=lang=en-US|syslang=|userlang=&pm_fpjv=0&pm_fpco=1&pm_fpasw=mhjfbmdgcfjbbpaeojofohoefgiehjai|pepflashplayer|internal-nacl-plugin|internal-pdf-viewer&pm_fpan=Netscape&pm_fpacn=Mozilla&pm_fpol=true&pm_fposp=&pm_fpup=&pm_fpsaw=1920&pm_fpspd=24&pm_fpsbd=&pm_fpsdx=&pm_fpsdy=&pm_fpslx=&pm_fpsly=&pm_fpsfse=&pm_fpsui=&pm_os=Windows&pm_brmjv=48&pm_br=Chrome&pm_inpt=&pm_expt=',
    DeviceToken: '0000000000000000000000000000000000000000',
    HttpAccept: 'application/json',
    HttpAcceptEncoding: '*',
    HttpAcceptLanguage: '*'
  },
  deviceId: '0000000000000000000000000000000000000000'
};

export const Fonts = {
  letterGothic: Platform.OS == 'ios' ? 'Letter Gothic Std' : 'Letter-Gothic-Std',
  letterGothicBold: Platform.OS == 'ios' ? 'LetterGothicStd-Bold' : 'Letter-Gothic-Std',
  josefinSans: Platform.OS == 'ios' ? 'Josefin Sans' : 'JosefinSans-Bold',
  josefinSansBold: 'JosefinSans-Bold'
};
export const KeywordsInfo = [
  "1 Janase Kinase",
  "2 Novel Product",
  "3 Antihistomine",
  "4 Steroid",
  "5 Long-term",
  "6 Apoquel",
  "7 Allergy",
];
export const TranscriptInfo = "Um so Apoquel controls itch in dogs with flea allergy, um food allergy, contact allergy and atopic dermatitis. You know it also delivers onset of relief within 4 hours, um comparable to steroids. It also provides onset of relief faster than um Atopica. Apoquel also provides significant long-term reduction of itch and inflammation, helping to improve the quality of life for dogs and their owners. ";

export const ProductInfo = [
  {
    ProductLabel: 'Praluent',
    details: [
      {
        itemTitle: 'Clinical Trials',
        keywords: [
          'Janas Kinase',
          'Steriods',
          'Novel products',
          'Long-term',
          'Antihistamine'
        ]
      },
      {
        itemTitle: 'Sales Pitch',
        keywords: [
          'Janas Kinase',
          'Steriods',
          'Novel products',
          'Long-term',
          'Antihistamine'
        ]
      }
    ]
  },
  {
    ProductLabel: 'Apoquel',
    details: [
      {
        itemTitle: 'Features',
        keywords: [
          'Janas Kinase',
          'Steriods',
          'Novel products',
          'Long-term',
          'Antihistamine'
        ]
      },
      {
        itemTitle: 'Sales Pitch',
        keywords: [
          'Janas Kinase',
          'Steriods',
          'Novel products',
          'Long-term',
          'Antihistamine'
        ]
      }
    ]
  }
];

export const iOSStatusBarHeight = Platform.OS == 'ios' ? 20 : 0;
export const AndroidStatusBarHeight = Platform.OS == 'ios' ? 0 : 25;
export const NavigationBarHeight = 44;

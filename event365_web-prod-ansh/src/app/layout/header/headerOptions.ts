import { localString } from '../../shared/utils/strings';
const STRINGS: any = localString;
export const navOptions: any = {
  [STRINGS.userType.lowerCaseVenuer]: [
    {
      title: STRINGS.header.home,
      icon: '',
      path: '/home',
      isActive: STRINGS.header.home,
    },
    {
      title: STRINGS.header.location,
      icon: '',
      path: '/venue/venuelocation',
      isActive: STRINGS.header.location,
    },
    {
      title: STRINGS.header.events,
      icon: '',
      path: '/event/list',
      isActive: STRINGS.header.event,
    },
    {
      title: '',
      icon: '../../../assets/img/message.svg',
      iconClass: 'header-icon',
    },
    {
      title: '',
      icon: '../../../assets/img/notifications.svg',
      iconClass: 'header-icon',
      isActive: STRINGS.header.notification,
      isNotification: true,
    },
    {
      title: '',
      icon: '../../../assets/img/host@2x.png',
      iconClass: 'profle-image',
      isProfile: true,
    },
  ],
  [STRINGS.userType.lowerCaseHost]: [
    {
      title: STRINGS.header.home,
      icon: '',
      path: '/home',
      isActive: STRINGS.header.home,
    },
    {
      title: STRINGS.header.location,
      icon: '',
      path: '/venue/venuelocation',
      isActive: STRINGS.header.location,
    },
    {
      title: STRINGS.header.events,
      icon: '',
      path: '/event/list',
      isActive: STRINGS.header.event,
    },
    {
      title: '',
      icon: '../../../assets/img/message.svg',
      iconClass: 'header-icon',
    },
    {
      title: '',
      icon: '../../../assets/img/notifications.svg',
      iconClass: 'header-icon',
      isActive: STRINGS.header.notification,
      isNotification: true,
    },
    {
      title: '',
      icon: '../../../assets/img/host@2x.png',
      iconClass: 'profle-image',
      isProfile: true,
    },
  ],
  [STRINGS.userType.member]: [
    {
      title: STRINGS.header.home,
      icon: '',
      path: '/home',
      isActive: STRINGS.header.home,
    },
    {
      title: STRINGS.header.location,
      icon: '',
      path: '/venue/venuelocation',
      isActive: STRINGS.header.location,
    },
    {
      title: STRINGS.header.events,
      icon: '',
      path: '/event/list',
      isActive: STRINGS.header.event,
    },
    {
      title: '',
      icon: '../../../assets/img/message.svg',
      iconClass: 'header-icon',
    },
    {
      title: '',
      icon: '../../../assets/img/notifications.svg',
      iconClass: 'header-icon',
      isActive: STRINGS.header.notification,
      isNotification: true,
    },
    {
      title: '',
      icon: '../../../assets/img/host@2x.png',
      iconClass: 'profle-image',
      isProfile: true,
    },
  ],
  [STRINGS.userType.lowerCasePromoter]: [
    {
      title: STRINGS.header.home,
      icon: '',
      path: '/home',
      isActive: STRINGS.header.home,
    },
    {
      title: STRINGS.header.events,
      icon: '',
      path: '/event/list',
      isActive: STRINGS.header.event,
    },
    {
      title: STRINGS.header.location,
      icon: '',
      path: '/venue/venuelocation',
      isActive: STRINGS.header.location,
    },
    {
      title: '',
      icon: '../../../assets/img/message.svg',
      iconClass: 'header-icon',
    },
    {
      title: '',
      icon: '../../../assets/img/notifications.svg',
      iconClass: 'header-icon',
      isActive: STRINGS.header.notification,
      isNotification: true,
    },
    {
      title: '',
      icon: '../../../assets/img/host@2x.png',
      iconClass: 'profle-image',
      isProfile: true,
    },
  ],
  [STRINGS.userType.lowercaseUser]: [
    {
      title: STRINGS.header.nearBy,
      icon: '',
      path: '/home',
      isActive: STRINGS.header.home,
    },
    {
      title: STRINGS.header.recommendation,
      icon: '',
      path: '/user/recommendations',
      isActive: STRINGS.header.recommendation,
    },
    {
      title: STRINGS.header.rsvp,
      icon: '../../../assets/img/rsvp.svg',
      iconClass: 'rsvp-icon',
      path: '/rsvp/group-ticket',
      isActive: STRINGS.header.rsvp,
      isRsvp:true 
    },
  

    {
      title: '',
      icon: '../../../assets/img/message.svg',
      iconClass: 'header-icon',
    },
    {
      title: '',
      icon: '../../../assets/img/notifications.svg',
      iconClass: 'header-icon',
      isActive: STRINGS.header.notification,
      isNotification: true,
    },
    {
      title: '',
      icon: '../../../assets/img/host@2x.png',
      iconClass: 'profle-image',
      isProfile: true,
    },
  ],
  [STRINGS.userType.guestUser]: [
    {
      title: STRINGS.header.nearBy,
      icon: '',
      path: '/home',
      isActive: STRINGS.header.home,
    },
    {
      title: STRINGS.header.recommendation,
      icon: '',
      path: '/user/recommendations',
      isActive: STRINGS.header.recommendation,
    },
    { title: '', icon: '', divider: true },
    {
      title: STRINGS.header.listEvent,
      icon: '',
      path: '/auth/login',
      isActive: STRINGS.header.event,
    },
    { title: STRINGS.header.loginSignup, icon: '', loginSignup: true },
  ],
};

export const userProfileOptions: any = {
  [STRINGS.userType.partner]: [
    { title: STRINGS.header.manageUsers, path: '/profile/user-list' },
    { title: STRINGS.header.getPaid, path: '/getpaid' },
    { title: STRINGS.header.help, path: '/user/contact-us' },
    { title: STRINGS.header.settings, path: '/profile/settings' },
  ],
  [STRINGS.userType.lowerCaseHost]: [
    { title: STRINGS.header.getPaid, path: '/getpaid' },
    { title: STRINGS.header.help, path: '/user/contact-us' },
    { title: STRINGS.header.settings, path: '/profile/settings' },
  ],
  [STRINGS.userType.member]: [
    { title: STRINGS.header.help, path: '/user/contact-us' },
    { title: STRINGS.header.settings, path: '/profile/settings' },
  ],
  [STRINGS.userType.user]: [
    { title: STRINGS.header.favourite, path: '/user/favourites' },
    { title: STRINGS.header.bookedEvents, path: '/user/booked-events' },
    { title: STRINGS.header.preferences, path: '/user/preferences-list' },
    { title: STRINGS.header.settings, path: '/profile/settings' },
    { title: STRINGS.header.contactUs, path: '/user/contact-us' },
    { title: STRINGS.header.aboutUs, path: '/user/about-us' },
  ],
 
};


//... navigation for mobile.......
export const navMobOptions: any = {
  [STRINGS.userType.lowerCaseVenuer]: [
    {
      title: '',
      icon: '../../../assets/img/host@2x.png',
      iconClass: 'profle-image',
      isProfile: true,
    },
    {
      title: STRINGS.header.home,
      icon: '',
      path: '/home',
      isActive: STRINGS.header.home,
    },
    {
      title: STRINGS.header.location,
      icon: '',
      path: '/venue/venuelocation',
      isActive: STRINGS.header.location,
    },
    {
      title: STRINGS.header.events,
      icon: '',
      path: '/event/list',
      isActive: STRINGS.header.event,
    },
    {
      title: STRINGS.header.message,
      icon: '',
      path: '',
      isActive: STRINGS.header.message,
    },
  ],
  [STRINGS.userType.lowerCaseHost]: [
    {
      title: '',
      icon: '../../../assets/img/host@2x.png',
      iconClass: 'profle-image',
      isProfile: true,
    },
    {
      title: STRINGS.header.home,
      icon: '',
      path: '/home',
      isActive: STRINGS.header.home,
    },
    {
      title: STRINGS.header.events,
      icon: '',
      path: '/event/list',
      isActive: STRINGS.header.event,
    },
    {
      title: STRINGS.header.location,
      icon: '',
      path: '/venue/venuelocation',
      isActive: STRINGS.header.location,
    },
    {
      title: STRINGS.header.message,
      icon: '',
      path: '',
      isActive: STRINGS.header.message,
    }
  ],
  [STRINGS.userType.member]: [
    {
      title: '',
      icon: '../../../assets/img/host@2x.png',
      iconClass: 'profle-image',
      isProfile: true,
    },
    {
      title: STRINGS.header.home,
      icon: '',
      path: '/home',
      isActive: STRINGS.header.home,
    },
    {
      title: STRINGS.header.events,
      icon: '',
      path: '/event/list',
      isActive: STRINGS.header.event,
    },
    {
      title: STRINGS.header.location,
      icon: '',
      path: '/venue/venuelocation',
      isActive: STRINGS.header.location,
    },
    {
      title: STRINGS.header.message,
      icon: '',
      path: '',
      isActive: STRINGS.header.message,
    }
  ],
  [STRINGS.userType.lowerCasePromoter]: [
    {
      title: '',
      icon: '../../../assets/img/host@2x.png',
      iconClass: 'profle-image',
      isProfile: true,
    },
    {
      title: STRINGS.header.home,
      icon: '',
      path: '/home',
      isActive: STRINGS.header.home,
    },
    {
      title: STRINGS.header.events,
      icon: '',
      path: '/event/list',
      isActive: STRINGS.header.event,
    },
    {
      title: STRINGS.header.location,
      icon: '',
      path: '/venue/venuelocation',
      isActive: STRINGS.header.location,
    },
    {
      title: STRINGS.header.message,
      icon: '',
      path: '',
      isActive: STRINGS.header.message,
    },
  ],
  [STRINGS.userType.lowercaseUser]: [
    {
      title: '',
      icon: '../../../assets/img/host@2x.png',
      iconClass: 'profle-image',
      isProfile: true,
    },
    {
      title: STRINGS.header.nearBy,
      icon: '',
      path: '/home',
      isActive: STRINGS.header.home,
    },
    {
      title: STRINGS.header.recommendation,
      icon: '',
      path: '/user/recommendations',
      isActive: STRINGS.header.recommendation,
    },
    {
      title: STRINGS.header.rsvp,
      icon: '../../../assets/img/rsvp.svg',
      iconClass: 'rsvp-icon',
      path: '/rsvp/group-ticket',
      isActive: STRINGS.header.rsvp,
      extraDiv: true ,
    },
    {
      title: STRINGS.header.message,
      icon: '',
      path: '',
      isActive: STRINGS.header.message,
    },
  ],
  [STRINGS.userType.guestUser]: [
    {
      title: STRINGS.header.nearBy,
      icon: '',
      path: '/home',
      isActive: STRINGS.header.home,
    },
    {
      title: STRINGS.header.recommendation,
      icon: '',
      path: '/user/recommendations',
      isActive: STRINGS.header.recommendation,
    },
    {
      title: STRINGS.header.listEvent,
      icon: '',
      path: '/home',
      isActive: STRINGS.header.event,
    },
    { title: STRINGS.header.loginSignup, icon: '', loginSignup: true },
  ],
};
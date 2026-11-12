// Tek yerden değiştir: site adı, domain, AdSense kimliği.
export const SITE = {
  name: 'MediaCraft',
  tagline: 'Free tools that run in your browser. Your files never leave your device.',
  url: 'https://getmediacraft.com', // astro.config.mjs de buradan okur
  contactEmail: 'hello@getmediacraft.com',
  // AdSense onayı gelince doldur: 'ca-pub-XXXXXXXXXXXXXXXX'. Boşken reklam kodu hiç yüklenmez.
  adsenseClient: '',
  // AdSense panelinde oluşturduğun reklam birimlerinin slot ID'leri
  adSlots: {
    top: '',
    inContent: '',
    bottom: '',
  },
};

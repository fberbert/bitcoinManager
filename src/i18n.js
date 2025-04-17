// src/i18n.js
import { I18n } from 'i18n-js';

import en from './locales/en.json';
import pt_BR from './locales/pt_BR.json';

const i18n = new I18n({
  ...pt_BR,
  ...en,
});

i18n.locale = 'pt_BR';
i18n.fallbacks = true;
i18n.translations = { pt_BR, en };
i18n.defaultLocale = 'pt_BR';

export default i18n;

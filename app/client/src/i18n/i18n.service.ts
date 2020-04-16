import { EventEmitter, Inject, Injectable, InjectionToken } from '@angular/core';
import { HttpClient } from '@angular/common/http';

export type LanguageDirection = 'ltr'|'rtl';

export interface Language {
  code: string;
  name: string;
  file: string;
  direction: LanguageDirection;
  default: boolean;
}

interface I18nServiceConfig {
  languages: Language[];
}

export const I18N_SERVICE_CONFIG = new InjectionToken<I18nServiceConfig>('I18n config');

@Injectable()
export class I18nService {
  private _translations:{[key:string]:string};

  private _currentLanguage: Language;
  public get currentLanguage():Language { return this._currentLanguage; }

  public readonly currentLanguageChanged:EventEmitter<string> = new EventEmitter();

  public get languages(): Language[] { return this.config.languages; }

  constructor(private http: HttpClient, @Inject(I18N_SERVICE_CONFIG) private config: I18nServiceConfig) {
    this._translations = {};
    this._currentLanguage = this.config.languages.find(lang => lang.default) || this.config.languages[0];
    this.loadTranslations(this._currentLanguage);
  }

  async setLanguage(code: string) {
    const language = this.config.languages.find(lang => lang.code == code);
    if(!language) {
      throw new Error("Language not found: " + code);
    }
    this._currentLanguage = language;
    await this.loadTranslations(language);
  }

  async loadTranslations(lang: Language) {
    console.log(`Loading translations: ${lang.code}`);
    try {
      this._translations = await this.http.get<{[key: string]:string}>(lang.file).toPromise();
    } catch(err) {
      console.warn('Error loading translation file', err);
      this._translations = {};
    }
    console.log(`Translations loaded: ${lang.code}`);
    this.currentLanguageChanged.emit(lang.code);
  }

  getTranslation(key: string) {
    return this._translations[key];
  }
}

import { Injectable } from '@nestjs/common';
import { I18nService } from 'nestjs-i18n';
import { I18nTranslations } from 'src/generated/i18n.generated';

@Injectable()
export class MyI18nService {
  constructor(private readonly i18n: I18nService<I18nTranslations>) {}

  async translate(key: any, lang: string, options?: any): Promise<string> {
    const message = this.i18n.translate(key, { lang });
    return message;
  }
}

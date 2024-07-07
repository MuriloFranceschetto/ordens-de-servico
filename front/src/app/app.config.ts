import { provideRouter, withComponentInputBinding } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { ApplicationConfig, DEFAULT_CURRENCY_CODE, ErrorHandler, LOCALE_ID } from '@angular/core';
import { MAT_DIALOG_DEFAULT_OPTIONS, MatDialogRef } from '@angular/material/dialog';
import { MAT_SNACK_BAR_DEFAULT_OPTIONS } from '@angular/material/snack-bar';
import { provideAnimations } from '@angular/platform-browser/animations';
import { CURRENCY_MASK_CONFIG, CurrencyMaskConfig } from 'ng2-currency-mask';

import { routes } from './app.routes';
import { GlobalErrorHandler } from './shared/globals/global-error-handler';
import { GlobalSnackBarConfig } from './shared/globals/global-snackbar-config';
import { GlobalDialogConfig } from './shared/globals/global-dialog-config';
import { DATE_PIPE_DEFAULT_OPTIONS, registerLocaleData } from '@angular/common';

import localePt from '@angular/common/locales/pt';
import { MyCustomPaginatorIntl } from './shared/globals/global-paginator-config';
import { MatPaginatorIntl } from '@angular/material/paginator';

export const CustomCurrencyMaskConfig: CurrencyMaskConfig = {
  align: "left",
  allowNegative: true,
  decimal: ",",
  precision: 2,
  prefix: "R$ ",
  suffix: "",
  thousands: "."
};

registerLocaleData(localePt);

export const appConfig: ApplicationConfig = {
  providers: [

    // ? - CONFIGURAÇÕES PRÓPRIAS DO PROJETO
    { provide: ErrorHandler, useClass: GlobalErrorHandler },
    { provide: MAT_DIALOG_DEFAULT_OPTIONS, useClass: GlobalDialogConfig },
    { provide: MAT_SNACK_BAR_DEFAULT_OPTIONS, useClass: GlobalSnackBarConfig },

    // ? - CONFIGS BRAZUCAS
    { provide: DATE_PIPE_DEFAULT_OPTIONS, useValue: { dateFormat: 'mediumDate' } },
    { provide: LOCALE_ID, useValue: 'pt-BR' },
    { provide: DEFAULT_CURRENCY_CODE, useValue: 'BRL' },
    { provide: CURRENCY_MASK_CONFIG, useValue: CustomCurrencyMaskConfig },
    { provide: MatPaginatorIntl, useClass: MyCustomPaginatorIntl },

    // ? - PARA QUE COMPONENTES POSSAM SER RENDERIZADOS POR DIALOG OU NÃO
    { provide: MatDialogRef, useValue: undefined },

    provideRouter(routes, withComponentInputBinding()),
    provideAnimations(),
    provideHttpClient(),
  ]
};

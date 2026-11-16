import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { App } from './app/app';
import { Amplify } from 'aws-amplify';

// Tramo 8.3 · Amplify.configure va ANTES de bootstrapApplication: si el
// primer componente pregunta por la sesion antes de esto, el error es
// "AuthUserPoolException: Auth UserPool not configured".
//
// Los cuatro valores salen de tu propio user pool de Cognito (L3, tramos 1 al
// 4) y estan en tu ficha.txt. Ninguno es secreto: un cliente publico no
// tiene secretos.
Amplify.configure({
  Auth: {
    Cognito: {
      userPoolId:       'us-east-1_Q2e77d04l',
      userPoolClientId: '621p24cerjscvq9g8vrfsu9nit',
      loginWith: {
        oauth: {
          domain:          'biblioteca-l12-139658837350.auth.us-east-1.amazoncognito.com',
          scopes:          ['openid', 'profile', 'biblioteca/libros.leer'],
          // E3: dos URL en cada lista. Amplify usa la que coincide con el origen de la pagina:
          // localhost con ng serve, y la de Azure cuando lo sirve Caddy en gw-azure.
          redirectSignIn:  ['http://localhost:4200/callback',
                            'https://biblioteca-l10.northcentralus.cloudapp.azure.com/callback'],
          redirectSignOut: ['http://localhost:4200/',
                            'https://biblioteca-l10.northcentralus.cloudapp.azure.com/'],
          responseType:    'code',
        },
      },
    },
  },
});

// Hace que Amplify escuche la vuelta del login y canjee el codigo solo. Sin
// esto, vuelves de Cognito con un `?code=` en la barra de direcciones y no
// pasa absolutamente nada.
import 'aws-amplify/auth/enable-oauth-listener';

bootstrapApplication(App, appConfig).catch((err) => console.error(err));

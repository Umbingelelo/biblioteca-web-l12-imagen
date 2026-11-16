import { HttpInterceptorFn } from '@angular/common/http';
import { fetchAuthSession } from 'aws-amplify/auth';
import { from, switchMap } from 'rxjs';
import { GATEWAY } from '../biblioteca';

// Lista blanca: el token solo va al gateway. En Azure GATEWAY es '' (mismo origen), asi que se
// compara contra '/v1/': nada de otro dominio recibe el token.
export const tokenInterceptor: HttpInterceptorFn = (req, next) => {
  if (!req.url.startsWith(`${GATEWAY}/v1/`)) {
    return next(req);
  }

  return from(fetchAuthSession()).pipe(
    switchMap(({ tokens }) => {
      const jwt = tokens?.accessToken?.toString();
      return next(
        jwt ? req.clone({ setHeaders: { Authorization: `Bearer ${jwt}` } }) : req,
      );
    }),
  );
};

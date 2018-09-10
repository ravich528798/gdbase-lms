import { Injectable } from "@angular/core";
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from "@angular/common/http";
import { Observable } from "rxjs";

@Injectable()

export class GlobalInterceptor implements HttpInterceptor  {
  intercept(request: HttpRequest<any>, next: HttpHandler):Observable<HttpEvent<any>>{
    const cloned  = request.clone({
      // headers: request.headers.set('Access-Control-Allow-Origin','http://localhost:4200')
    })
    return next.handle(cloned)
  }

}
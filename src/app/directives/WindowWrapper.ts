import { Injectable } from '@angular/core';
@Injectable()
//@ts-ignore
export class WindowWrapper extends Window { }
export function getWindow() { return window; }
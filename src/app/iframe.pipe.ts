import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer} from '@angular/platform-browser';

//sanitize Iframe URL
@Pipe({
  name: 'safeUrl'
})
export class IframePipe implements PipeTransform {

  constructor(private domSanitizer: DomSanitizer) {}
  transform(url:any) {
    return this.domSanitizer.bypassSecurityTrustResourceUrl(url);
  }
} 
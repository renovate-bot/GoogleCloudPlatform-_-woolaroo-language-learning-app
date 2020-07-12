import { Component, ViewChild } from '@angular/core';
import { CameraPreviewComponent } from 'components/camera-preview/camera-preview';
import { I18nService, Language } from 'i18n/i18n.service';
import { EndangeredLanguage, EndangeredLanguageService } from 'services/endangered-language';
import { Router } from '@angular/router';
import { AppRoutes } from 'app/routes';

@Component({
  selector: 'app-change-language',
  templateUrl: './change-language.html',
  styleUrls: ['./change-language.scss']
})
export class ChangeLanguagePageComponent {
  @ViewChild(CameraPreviewComponent)
  private cameraPreview: CameraPreviewComponent|null = null;

  public get uiLanguages(): Language[] { return this.i18nService.languages; }

  private _currentUILanguageIndex: number = 0;
  public get currentUILanguageIndex(): number { return this._currentUILanguageIndex; }

  public get endangeredLanguages():EndangeredLanguage[] { return this.endangeredLanguageService.languages; }

  private _currentEndangeredLanguageIndex: number = 0;
  public get currentEndangeredLanguageIndex(): number { return this._currentEndangeredLanguageIndex; }

  constructor(private router: Router,
              private i18nService: I18nService,
              private endangeredLanguageService: EndangeredLanguageService) {
    this._currentUILanguageIndex = this.i18nService.languages.indexOf(this.i18nService.currentLanguage);
    this._currentEndangeredLanguageIndex = this.endangeredLanguageService.languages.indexOf(this.endangeredLanguageService.currentLanguage);
  }

  ngAfterViewInit() {
    if (!this.cameraPreview) {
      console.error('Camera preview not found');
    } else {
      this.cameraPreview.start().then(
        () => console.log('Camera started'),
        err => console.warn('Error starting camera', err)
      );
    }
  }

  onUILanguageChanged(index: number) {
    this._currentUILanguageIndex = index;
    this.i18nService.setLanguage(this.i18nService.languages[index].code);
  }

  onEndangeredLanguageChanged(index: number) {
    this._currentEndangeredLanguageIndex = index;
    this.endangeredLanguageService.setLanguage(this.endangeredLanguageService.languages[index].code);
  }

  onCloseClick() {
    this.router.navigateByUrl(AppRoutes.CaptureImage);
  }

  onNextClick() {
    this.router.navigateByUrl(AppRoutes.CaptureImage);
  }
}
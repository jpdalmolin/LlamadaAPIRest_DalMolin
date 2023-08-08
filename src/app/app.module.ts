import { LOCALE_ID, NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';
import { ClassModule } from './dashboard/pages/class/class.module';
import { CoursesModule } from './dashboard/pages/courses/courses.module';
import { HttpClientModule } from '@angular/common/http';
import { MatCardModule } from '@angular/material/card';
import { SharedModule } from './shared/shared.module';
import eslocale from '@angular/common/locales/es-AR'
import { registerLocaleData } from '@angular/common';

registerLocaleData(eslocale);

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
   // DashboardModule, // dashboard module
   // AuthModule,
    MatCardModule,
    ClassModule,
    CoursesModule,
    HttpClientModule,
  ],
  providers: [
    {
      provide: LOCALE_ID,
      useValue: 'es-AR'
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

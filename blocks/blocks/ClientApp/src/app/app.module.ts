import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { AppComponent } from './app.component';
import { SearchComponent } from './search/search.component';
import { LayoutComponent } from './layout/layout.component';
import { BlockComponent } from './block/block.component';
import { ToolbarComponent } from './toolbar/toolbar.component';
import { MainComponent } from './main/main.component';

import { MaterialModule } from './material/material.module';
import { ToolbarService } from './services/toolbar.service';
import { SearchService } from './services/search.service';

import { EffectsModule } from '@ngrx/effects';
import { AppEffects } from './app.effects';
import { StoreModule } from '@ngrx/store';
import { StockReducer } from './store/stock.reducer';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AlertModule } from 'ngx-bootstrap';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { GoogleChartsModule } from 'angular-google-charts';

@NgModule({

  declarations: [
    AppComponent,
    SearchComponent,
    LayoutComponent,
    MainComponent,
    BlockComponent,
    ToolbarComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    BrowserAnimationsModule,
    MaterialModule,
    FlexLayoutModule,
    HttpModule,
    NgxChartsModule,
    ReactiveFormsModule,
    NgbModule,
    BsDropdownModule.forRoot(),
    AlertModule.forRoot(),
    StoreDevtoolsModule.instrument({maxAge:10}),
    StoreModule.forRoot({stocks: StockReducer}),
    EffectsModule.forRoot([AppEffects]),
    GoogleChartsModule.forRoot(),
    CommonModule
  ],
  providers: [SearchService, ToolbarService],
  bootstrap: [AppComponent],
  entryComponents: [BlockComponent]

})
export class AppModule { }

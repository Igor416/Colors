import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CalculatorComponent } from './components/calculator/calculator.component';
import { PickerComponent } from './components/picker/picker.component';
import { SchemesComponent } from './components/schemes/schemes.component';
import { ModelsComponent } from './components/models/models.component';
import { CalculatorHelpComponent } from './components/calculator-help/calculator-help.component';
import { YearsComponent } from './components/trends/years/years.component';
import { DecadesComponent } from './components/trends/decades/decades.component';
import { LogInComponent } from './components/auth/log-in/log-in.component';
import { SignInComponent } from './components/auth/sign-in/sign-in.component';
import { ProfileComponent } from './components/profile/profile.component';
import { MenuComponent } from './components/menu/menu.component';
import { RestoreComponent } from './components/auth/restore/restore.component';

@NgModule({
  declarations: [
    AppComponent,
    CalculatorComponent,
    PickerComponent,
    SchemesComponent,
    CalculatorHelpComponent,
    ModelsComponent,
    YearsComponent,
    DecadesComponent,
    LogInComponent,
    SignInComponent,
    ProfileComponent,
    MenuComponent,
    RestoreComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

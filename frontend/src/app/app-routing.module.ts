import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { PickerComponent } from './components/picker/picker.component';
import { CalculatorComponent } from './components/calculator/calculator.component';
import { SchemesComponent } from './components/schemes/schemes.component';
import { ModelsComponent } from './components/models/models.component';
import { CalculatorHelpComponent } from './components/calculator-help/calculator-help.component';
import { YearsComponent } from './components/trends/years/years.component';
import { DecadesComponent } from './components/trends/decades/decades.component';
import { LogInComponent } from './components/auth/log-in/log-in.component';
import { SignInComponent } from './components/auth/sign-in/sign-in.component';
import { RestoreComponent } from './components/auth/restore/restore.component';
import { ProfileComponent } from './components/profile/profile.component';

const routes: Routes = [
  {path: 'picker', component: PickerComponent},
  {path: 'calculator', component: CalculatorComponent},
  {path: 'calculator/help', component: CalculatorHelpComponent},
  {path: 'trends/years', component: YearsComponent},
  {path: 'trends/decades/:decade', component: DecadesComponent},
  {path: 'schemes/:scheme', component: SchemesComponent},
  {path: 'models', component: ModelsComponent},
  {path: 'profile', component: ProfileComponent},
  {path: 'log_in', component: LogInComponent},
  {path: 'sign_up', component: SignInComponent},
  {path: 'restore', component: RestoreComponent},
  {path: '**', redirectTo: '/'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes,
    //{ enableTracing: true }
  )],
  exports: [RouterModule]
})
export class AppRoutingModule { }

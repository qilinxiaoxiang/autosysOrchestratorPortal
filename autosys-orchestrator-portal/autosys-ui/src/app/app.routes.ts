import {Routes} from '@angular/router';
import {GlobalTemplateComponent} from './global-template/global-template.component';
import {EnvironmentsComponent} from './environments/environments.component';
import {GeneratorComponent} from './generator/generator.component';
import {ActualityComponent} from './actuality/actuality.component';

export const routes: Routes = [
  {path: 'global-template', component: GlobalTemplateComponent},
  {path: 'environments', component: EnvironmentsComponent},
  {path: 'generator', component: GeneratorComponent},
  {path: 'actuality', component: ActualityComponent},
  {path: '', redirectTo: '/global-template', pathMatch: 'full'}
];

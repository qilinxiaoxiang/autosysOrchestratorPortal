import {Component} from '@angular/core';
import {RouterLink, RouterOutlet} from '@angular/router';
import {TabViewModule} from "primeng/tabview";
import {GlobalTemplateComponent} from "./global-template/global-template.component";
import {EnvironmentsComponent} from "./environments/environments.component";
import {ActualityComponent} from "./actuality/actuality.component";
import {CommonModule} from "@angular/common";
import {GeneratorComponent} from "./generator/generator.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, TabViewModule, GlobalTemplateComponent, EnvironmentsComponent, ActualityComponent, GeneratorComponent,],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'autosys-ui';
}

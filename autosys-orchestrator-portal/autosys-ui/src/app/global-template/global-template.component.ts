import {Component, OnInit} from '@angular/core';
import {FormsModule} from "@angular/forms";
import {ButtonModule} from "primeng/button";
import {DataService, GlobalTemplate} from '../data.service'
import {InputTextareaModule} from "primeng/inputtextarea";

@Component({
  selector: 'app-global-template',
  standalone: true,
  imports: [
    FormsModule,
    ButtonModule,
    InputTextareaModule
  ],
  templateUrl: './global-template.component.html',
  styleUrl: './global-template.component.scss'
})

export class GlobalTemplateComponent implements OnInit {
  templateContent: string | undefined;

  constructor(private dataService: DataService) {
  }

  ngOnInit(): void {
    this.templateContent = '';
    for (const globalTemplate of this.dataService.getGlobalTemplates()) {
      this.templateContent += 'name: ' + globalTemplate.name + '\n'
      this.templateContent += 'job_type: ' + globalTemplate.type + '\n'
      this.templateContent += globalTemplate.content + '\n'
    }
  }

  saveTemplate(): void {
    if (typeof this.templateContent === "string") {
      // define a list to store the global templates
      const globalTemplateArray: GlobalTemplate[] = [];
      const globalTemplateRawArray = this.templateContent.split("\n\n");
      for (const globalTemplateRawItem of globalTemplateRawArray) {
        const globalTemplate = {} as GlobalTemplate;
        const globalTemplateRawItemArray = globalTemplateRawItem.split("\n");
        for (const globalTemplateRawItemLine of globalTemplateRawItemArray) {
          const globalTemplateRawItemLineArray = globalTemplateRawItemLine.split(": ");
          const key = globalTemplateRawItemLineArray[0];
          const value = globalTemplateRawItemLineArray[1];
          if (key === "name") {
            globalTemplate.name = value;
          } else if (key === "job_type") {
            globalTemplate.type = value;
          } else {
            globalTemplate.content = (globalTemplate.content || "") + globalTemplateRawItemLine + "\n";
          }
        }
        // if key is not found, skip this item
        if (globalTemplate.name === undefined || globalTemplate.type === undefined || globalTemplate.content === undefined) {
          continue;
        }
        globalTemplateArray.push(globalTemplate);
      }
      this.dataService.saveGlobalTemplates(globalTemplateArray);
    }
  }
}

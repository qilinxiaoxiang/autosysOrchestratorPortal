import {Component, OnInit} from '@angular/core';
import {DataService, Env, ExistingItem} from '../data.service'
import {FormsModule} from "@angular/forms";
import {InputTextareaModule} from "primeng/inputtextarea";
import {ButtonModule} from "primeng/button";
import {DropdownModule} from "primeng/dropdown";

@Component({
  selector: 'app-actuality',
  standalone: true,
  imports: [
    FormsModule,
    ButtonModule,
    InputTextareaModule,
    DropdownModule
  ],
  templateUrl: './actuality.component.html',
  styleUrl: './actuality.component.scss'
})
export class ActualityComponent implements OnInit {
  envs: Env[] = [];
  content: string | undefined;
  selectedEnv: Env | undefined;

  constructor(private dataService: DataService) {
  }

  ngOnInit(): void {
    this.envs = this.dataService.getEnvs();
  }

  envChange(): void {
    if (this.selectedEnv != undefined) {
      // @ts-ignore
      let existingItems = this.dataService.getExistingItems().filter((item) => item.env === this.selectedEnv.name);
      this.content = '';
      for (const existItem of existingItems) {
        this.content += 'name: ' + existItem.name + '\n'
        this.content += 'job_type: ' + existItem.type + '\n'
        this.content += existItem.content + '\n'
      }
    } else {
      this.content = undefined;
    }
  }

  saveContent(): void {
    if (this.selectedEnv != undefined && this.content != undefined) {
      let existingItems: ExistingItem[] = [];
      let contentArray = this.content.split("\n\n");
      // filter out empty content
      contentArray = contentArray.filter((item) => item.length > 0);
      for (const contentItem of contentArray) {
        const existingItem = {} as ExistingItem;
        existingItem.env = this.selectedEnv.name;
        let contentItemArray = contentItem.split("\n");
        for (const contentItemLine of contentItemArray) {
          let contentItemLineArray = contentItemLine.split(": ");
          let key = contentItemLineArray[0];
          let value = contentItemLineArray[1];
          if (key === "name") {
            existingItem.name = value;
          } else if (key === "job_type") {
            existingItem.type = value;
          } else {
            existingItem.content = (existingItem.content || "") + contentItemLine + "\n";
          }
        }
        existingItems.push(existingItem);
      }
      this.dataService.saveExistingItems(existingItems, this.selectedEnv.name);
    }

  }
}

import {Component, OnInit} from '@angular/core';
import {CheckboxModule} from "primeng/checkbox";
import {DataService, Env, ExistingItem, GlobalTemplate} from '../data.service'
import {CommonModule, NgForOf} from "@angular/common";
import {FormsModule} from "@angular/forms";
import {FieldsetModule} from "primeng/fieldset";
import {InputTextareaModule} from "primeng/inputtextarea";
import {InputSwitchModule} from "primeng/inputswitch";
import {ButtonModule} from "primeng/button";
import {EditorModule} from "primeng/editor";
import {TableModule} from "primeng/table";
import {DialogModule} from "primeng/dialog";

@Component({
  selector: 'app-generator',
  standalone: true,
  imports: [
    CommonModule,
    CheckboxModule,
    NgForOf,
    FormsModule,
    FieldsetModule,
    InputTextareaModule,
    InputSwitchModule,
    ButtonModule,
    EditorModule,
    TableModule,
    DialogModule,
  ],
  templateUrl: './generator.component.html',
  styleUrl: './generator.component.scss'
})
export class GeneratorComponent implements OnInit {
  envs: Env[] = [];
  selectedEnvs: Env[] = [];
  generateDeletion: boolean = false;
  dialogHeader: string = '';
  dialogContent: string = '';
  jilScripts: { server: string, content: string }[] = [];
  visible: boolean = false;

  constructor(private dataService: DataService) {
  }

  showDialog(server: string, content: string) {
    this.dialogHeader = server + '.jil';
    this.dialogContent = content;
    this.visible = true;
  }

  ngOnInit(): void {
    this.envs = this.dataService.getEnvs();
  }

  generate(): void {
    if (this.selectedEnvs.length === 0) {
      alert("Please select at least one environment");
      return;
    }
    this.jilScripts = [];
    // convert envList to a map, server to env list
    let envMap: { [server: string]: Env[] } = {};
    for (const env of this.selectedEnvs) {
      if (!envMap[env.server]) {
        envMap[env.server] = [];
      }
      envMap[env.server].push(env);
    }
    let existingItems = this.dataService.getExistingItems();
    // filter existing items with this.selectedEnvs with comparing Env.name with ExistingItem.env
    existingItems = existingItems.filter((existingItem) => {
      return this.selectedEnvs.some((env) => {
        return env.name === existingItem.env;
      });
    });
    // convert existingItems to a map, key is env, value is another map, key is name, value is ExistingItem
    let existingItemMap: { [env: string]: { [name: string]: ExistingItem } } = {};
    for (const existingItem of existingItems) {
      if (!existingItemMap[existingItem.env]) {
        existingItemMap[existingItem.env] = {};
      }
      existingItemMap[existingItem.env][existingItem.name] = existingItem;
    }
    let environmentVariables = this.dataService.getEnvironmentVariables();
    // filter environmentVariables with this.selectedEnvs with comparing Env.name with EnvironmentVariable.env
    environmentVariables = environmentVariables.filter((environmentVariable) => {
      return this.selectedEnvs.some((env) => {
        return env.name === environmentVariable.env;
      });
    });
    // convert environmentVariables to a map, key is env, value is another map whose key is key, value is value
    let environmentVariableMap: { [env: string]: { [key: string]: string } } = {};
    for (const environmentVariable of environmentVariables) {
      if (!environmentVariableMap[environmentVariable.env]) {
        environmentVariableMap[environmentVariable.env] = {};
      }
      environmentVariableMap[environmentVariable.env][environmentVariable.key] = environmentVariable.value;
    }
    // get global templates
    let globalTemplates = this.dataService.getGlobalTemplates();
    for (const server of Object.keys(envMap)) {
      let jilScript = "";
      let envList = envMap[server];
      // for each env, get environmentVariables
      for (const env of envList) {
        let environmentVariablesInEnv = environmentVariableMap[env.name];
        // for each global template, format it with environmentVariablesInEnv since global template contains ${variable} format placeholders in its name and content attributes
        let formattedGlobalTemplates = []
        for (const globalTemplate of globalTemplates) {
          // deep copy globalTemplate since we need to format it with different environmentVariablesInEnvs
          let formattedGlobalTemplate: GlobalTemplate = {
            name: globalTemplate.name,
            type: globalTemplate.type,
            content: globalTemplate.content
          };
          for (const key of Object.keys(environmentVariablesInEnv)) {
            formattedGlobalTemplate.name = formattedGlobalTemplate.name.replace("${" + key + "}", environmentVariablesInEnv[key]);
            formattedGlobalTemplate.content = formattedGlobalTemplate.content.replace("${" + key + "}", environmentVariablesInEnv[key]);
          }
          formattedGlobalTemplates.push(formattedGlobalTemplate);
          let existingItem = existingItemMap[env.name][formattedGlobalTemplate.name];
          if (existingItem) {
            // compare content
            let updatedContent = "";
            let formattedGlobalTemplateContentArray = formattedGlobalTemplate.content.split("\n");
            // filter out empty lines
            formattedGlobalTemplateContentArray = formattedGlobalTemplateContentArray.filter((formattedGlobalTemplateContentItem) => {
              return formattedGlobalTemplateContentItem !== "";
            });
            let existingItemContentArray = existingItem.content.split("\n");
            // filter out empty lines
            existingItemContentArray = existingItemContentArray.filter((existingItemContentItem) => {
              return existingItemContentItem !== "";
            });
            let formattedGlobalTemplateContentMap: { [key: string]: string } = {};
            let existingItemContentMap: { [key: string]: string } = {};
            for (const formattedGlobalTemplateContentItem of formattedGlobalTemplateContentArray) {
              let [key, value] = formattedGlobalTemplateContentItem.split(": ");
              formattedGlobalTemplateContentMap[key] = value;
            }
            for (const existingItemContentItem of existingItemContentArray) {
              let [key, value] = existingItemContentItem.split(": ");
              existingItemContentMap[key] = value;
            }
            for (const key of Object.keys(formattedGlobalTemplateContentMap)) {
              if (existingItemContentMap[key] === undefined) {
                updatedContent += key + ": " + formattedGlobalTemplateContentMap[key] + "\n";
              } else if (existingItemContentMap[key] !== formattedGlobalTemplateContentMap[key]) {
                updatedContent += key + ": " + formattedGlobalTemplateContentMap[key] + "\n";
              }
            }
            for (const key of Object.keys(existingItemContentMap)) {
              if (formattedGlobalTemplateContentMap[key] === undefined) {
                updatedContent += key + ": \n";
              }
            }
            if (updatedContent !== "") {
              jilScript += "update_job: " + formattedGlobalTemplate.name + "\n";
              jilScript += "job_type: " + formattedGlobalTemplate.type + "\n";
              jilScript += updatedContent + "\n";
            }
          } else {
            // append an insertion script snippet in jilScript
            // the format is insert_job: <name>\njob_type: <type>\n<content>
            jilScript += "insert_job: " + formattedGlobalTemplate.name + "\n";
            jilScript += "job_type: " + formattedGlobalTemplate.type + "\n";
            jilScript += formattedGlobalTemplate.content + "\n";
          }
        }
        // check if generateDeletion is checked
        if (this.generateDeletion) {
          // for each existingItem, if it is not in formattedGlobalTemplates, append a deletion script snippet in jilScript
          // the format is delete_job: <name>
          for (let jobName in existingItemMap[env.name]) {
            if (jobName && !formattedGlobalTemplates.some((formattedGlobalTemplate) => {
              return formattedGlobalTemplate.name === jobName;
            })) {
              jilScript += "delete_job: " + jobName + "\n";
            }
          }
        }
      }
      this.jilScripts.push({
        server: server,
        content: jilScript === "" ? "No difference" : jilScript
      });
    }
  }

  display(content: string) {
    if (content === undefined || content === "") {
      alert("No difference");
    }
    alert(content);
  }
}

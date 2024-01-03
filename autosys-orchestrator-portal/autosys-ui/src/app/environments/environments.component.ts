import {Component, OnInit} from '@angular/core';
import {TreeModule} from "primeng/tree";
import {TreeNode} from "primeng/api";
import {DataService} from '../data.service'

@Component({
  selector: 'app-environments',
  standalone: true,
  imports: [
    TreeModule
  ],
  templateUrl: './environments.component.html',
  styleUrl: './environments.component.scss'
})
export class EnvironmentsComponent implements OnInit {
  environmentVariables: TreeNode[] = [];

  constructor(private dataService: DataService) {
  }

  ngOnInit(): void {
    // get source data from this.dataService.getEnvs();
    // according to it we can build server to env map
    // get source data from this.dataService.getEnvironmentVariables();
    // according to it we can build env to envVar map
    // build a 3 level tree structure
    // root: server, middle: env, leaf: key: value
    // add TreeNode into environmentVariables
    let envs = this.dataService.getEnvs();
    // according to it we can build server to env map
    let serverToEnvMap: { [server: string]: TreeNode } = {};
    let variables = this.dataService.getEnvironmentVariables();
    // according to it we can build env to envVar map
    let envToEnvVarMap: { [env: string]: TreeNode } = {};
    variables.forEach((variable) => {
      if (!envToEnvVarMap[variable.env]) {
        envToEnvVarMap[variable.env] = {
          label: variable.env,
          children: [],
        };
      }
      // @ts-ignore
      envToEnvVarMap[variable.env].children.push({
        label: variable.key + ": " + variable.value,
      });
    });
    envs.forEach((env) => {
      if (!serverToEnvMap[env.server]) {
        serverToEnvMap[env.server] = {
          label: env.server,
          children: [],
        };
      }
      // @ts-ignore
      serverToEnvMap[env.server].children.push(envToEnvVarMap[env.name]);
    });
    // populate serverToEnvMap values into environmentVariables
    for (const server in serverToEnvMap) {
      this.environmentVariables.push(serverToEnvMap[server]);
    }
  }


}

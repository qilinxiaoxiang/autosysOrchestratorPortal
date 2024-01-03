import {Injectable} from '@angular/core';

export interface ExistingItem {
  env: string;
  name: string;
  type: string;
  content: string;
}

export interface EnvironmentVariable {
  env: string;
  key: string;
  value: string;
}

export interface GlobalTemplate {
  name: string;
  type: string;
  content: string;
}

export interface Env {
  name: string;
  server: string;
}

interface Server {
  name: string;
  endpoint: string;
}

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private existingItems: ExistingItem[] = [
    {
      env: 'SIT',
      name: 'SIT_PREPARATION_JOB',
      type: 'cmd',
      content: 'description: To trigger feed preparation\n' +
        'machine: ecsSITMachine\n' +
        'owner: ecsSITOwner\n' +
        'send_notification: y\n' +
        'command: preparation.sh\n'
    },
    {
      env: 'SIT',
      name: 'SIT_GENERATION_JOB',
      type: 'cmd',
      content: 'description: To trigger feed generation\n' +
        'machine: eapSITMachine\n' +
        'owner: eapSITOwner\n' +
        'send_notification: y\n' +
        'command: generation.sh\n'
    },
    {
      env: 'SIT',
      name: 'SIT_PUSH_JOB',
      type: 'cmd',
      content: 'description: To trigger feed push\n' +
        'machine: sftpSITMachine\n' +
        'owner: sftpSITOwner\n' +
        'send_notification: y\n' +
        'command: push.sh\n'
    },
    {
      env: 'UAT',
      name: 'UAT_PREPARATION_JOB',
      type: 'cmd',
      content: 'description: To trigger feed preparation\n' +
        'machine: ecsUATMachine\n' +
        'owner: ecsUATOwner\n' +
        'send_notification: y\n' +
        'command: preparation.sh\n'
    },
    {
      env: 'UAT',
      name: 'UAT_GENERATION_JOB',
      type: 'cmd',
      content: 'description: To trigger feed generation\n' +
        'machine: eapUATMachine\n' +
        'owner: eapUATOwner\n' +
        'send_notification: y\n' +
        'command: generation.sh\n'
    },
    {
      env: 'UAT',
      name: 'UAT_PUSH_JOB',
      type: 'cmd',
      content: 'description: To trigger feed push\n' +
        'machine: sftpUATMachine\n' +
        'owner: sftpUATOwner\n' +
        'send_notification: y\n' +
        'command: push.sh\n'
    }
  ];
  private environmentVariables: EnvironmentVariable[] = [
    {
      env: 'SIT',
      key: 'env',
      value: 'SIT',
    },
    {
      env: 'SIT',
      key: 'ecsMachine',
      value: 'ecsSITMachine',
    },
    {
      env: 'SIT',
      key: 'ecsOwner',
      value: 'ecsSITOwner',
    },
    {
      env: 'SIT',
      key: 'eapMachine',
      value: 'eapSITMachine',
    },
    {
      env: 'SIT',
      key: 'eapOwner',
      value: 'eapSITOwner',
    },
    {
      env: 'SIT',
      key: 'sftpMachine',
      value: 'sftpSITMachine',
    },
    {
      env: 'SIT',
      key: 'sftpOwner',
      value: 'sftpSITOwner',
    },
    {
      env: 'UAT',
      key: 'env',
      value: 'UAT',
    },
    {
      env: 'UAT',
      key: 'ecsMachine',
      value: 'ecsUATMachine',
    },
    {
      env: 'UAT',
      key: 'ecsOwner',
      value: 'ecsUATOwner',
    },
    {
      env: 'UAT',
      key: 'eapMachine',
      value: 'eapUATMachine',
    },
    {
      env: 'UAT',
      key: 'eapOwner',
      value: 'eapUATOwner',
    },
    {
      env: 'UAT',
      key: 'sftpMachine',
      value: 'sftpUATMachine',
    },
    {
      env: 'UAT',
      key: 'sftpOwner',
      value: 'sftpUATOwner',
    }
  ];
  private globalTemplates: GlobalTemplate[] = [
    {
      name: '${env}_PREPARATION_JOB',
      type: 'cmd',
      content: 'description: To trigger feed preparation\n' +
        'machine: ${ecsMachine}\n' +
        'owner: ${ecsOwner}\n' +
        'send_notification: y\n' +
        'command: preparation.sh\n'
    },
    {
      name: '${env}_GENERATION_JOB',
      type: 'cmd',
      content: 'description: To trigger feed generation\n' +
        'machine: ${eapMachine}\n' +
        'owner: ${eapOwner}\n' +
        'send_notification: y\n' +
        'command: generation.sh\n'
    },
    {
      name: '${env}_PUSH_JOB',
      type: 'cmd',
      content: 'description: To trigger feed push\n' +
        'machine: ${sftpMachine}\n' +
        'owner: ${sftpOwner}\n' +
        'send_notification: y\n' +
        'command: push.sh\n'
    }
  ];
  private envs: Env[] = [
    {
      name: 'SIT',
      server: 'DA3'
    },
    {
      name: 'UAT',
      server: 'QA3'
    }
  ];
  private servers: Server[] = [
    {
      name: 'DA3',
      endpoint: 'https://da3.autosys.net'
    },
    {
      name: 'QA3',
      endpoint: 'https://qa3.autosys.net'
    }
  ];

  constructor() {
  }

  // ExistingItem CRUD
  getExistingItems(): ExistingItem[] {
    return this.existingItems;
  }

  addExistingItem(item: ExistingItem): void {
    this.existingItems.push(item);
  }

  // EnvironmentVariable CRUD
  getEnvironmentVariables(): EnvironmentVariable[] {
    return this.environmentVariables;
  }

  addEnvironmentVariable(variable: EnvironmentVariable): void {
    this.environmentVariables.push(variable);
  }

  // GlobalTemplate CRUD
  getGlobalTemplates(): GlobalTemplate[] {
    return this.globalTemplates;
  }

  // ... Other CRUD operations for EnvironmentVariable

  saveGlobalTemplates(templates: GlobalTemplate[]): void {
    this.globalTemplates = templates;
  }

  saveExistingItems(items: ExistingItem[], env: string): void {
    this.existingItems = this.existingItems.filter((item) => item.env !== env);
    this.existingItems.push(...items);
  }

  // Env CRUD
  getEnvs(): Env[] {
    return this.envs;
  }

  // Server CRUD
  getServers(): Server[] {
    return this.servers;
  }

  // Utility function to generate a simple incremental ID
  private generateId(items: any[]): number {
    return items.length > 0 ? Math.max(...items.map(item => item.id)) + 1 : 1;
  }

}

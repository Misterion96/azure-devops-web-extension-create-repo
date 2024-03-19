import { IProjectInfo } from 'azure-devops-extension-api';
import { IHostContext } from 'azure-devops-extension-sdk';

export class AzureDevopsApiConfig {
    constructor(
        public host: IHostContext,
        public project: IProjectInfo,
        public accessToken: string
    ) {
    }

    public get projectUrl(): string {
        return `${this.hostUrl}/${this.project.name}`
    }

    public get hostUrl(): string {
        return `https://dev.azure.com/${this.host.name}`
    }
}

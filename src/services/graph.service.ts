import { AzureDevopsApiConfig } from './azure-devops-api.config';

export type TGraphGroup = {
    description: string,
    descriptor: string,
    displayName: string,
    domain: string,
    principalName: string,
    url: string,
    subjectKind: string,
    originId: string
}

export class GraphService {
    constructor(
        private config: AzureDevopsApiConfig
    ) {
    }

    async getGroups(): Promise<TGraphGroup[]> {
        const scopeDescription = this.config.project.id;
        const hostName = this.config.host.name;

        const response = await fetch(
            `https://vssps.dev.azure.com/${hostName}/_apis/graph/groups?api-version=7.1-preview.1&scopeDescription=${scopeDescription}`, {
                headers: {
                    'Authorization': `Bearer ${this.config.accessToken}`
                }
            })

        const payload: {
            count: number,
            value: TGraphGroup[]
        } = await response.json();

        return payload.value
    }
}

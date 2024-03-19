import { AzureDevopsApiConfig } from './azure-devops-api.config';

export interface IAccessControlEntry {
    descriptor: string,
    allow: number,
    deny: number,
    extendedInfo: {}
}

export class ACEService {
    constructor(
        private config: AzureDevopsApiConfig
    ) {
    }

    async setPermission(
        securityNamespaceId: string,
        repositoryId: string,
        aces: IAccessControlEntry[]
    ) {
        const body = {
            "token": `repoV2/${this.config.project.id}/${repositoryId}/`,
            "merge": true,
            accessControlEntries: aces,
        }

        try {
            const response = await fetch(
                `${this.config.hostUrl}/_apis/accesscontrolentries/${securityNamespaceId}?api-version=7.1-preview.1`,
                {
                    method: 'POST',
                    body: JSON.stringify(body),
                    headers: {
                        'Authorization': `Bearer ${this.config.accessToken}`,
                        'Content-Type': 'application/json'
                    }
                })

            return response.json()
        } catch (e) {
            return e
        }

    }
}

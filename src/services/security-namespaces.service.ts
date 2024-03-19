import { AzureDevopsApiConfig } from './azure-devops-api.config';

export type TSecurityNamespaceAction = {
    bit: number,
    displayName: string,
    name: string,
    namespaceId: string
}

export type TSecurityNamespace = {
    actions: TSecurityNamespaceAction[]
    dataspaceCategory: string
    extensionType: string,
    namespaceId: string,
    displayName: string
}

export class SecurityNamespacesService {
    constructor(
        private config: AzureDevopsApiConfig
    ) {
    }

    async getSecurityNamespaces(): Promise<TSecurityNamespace[]> {
        const response = await fetch(
            `${this.config.hostUrl}/_apis/securitynamespaces/?api-version=5.1`, {
                headers: {
                    'Authorization': `Bearer ${this.config.accessToken}`
                }
            })

        const {value}: {
            count: number
            value: TSecurityNamespace[];
        } = await response.json();

        return value;
    }
}

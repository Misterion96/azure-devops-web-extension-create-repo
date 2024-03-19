import { TAzureResponse } from '../types/TAzureResponse';
import { AzureDevopsApiConfig } from './azure-devops-api.config';

const queryString = (params: Record<string, any>) => Object.keys(params).map(key => key + '=' + params[key]).join('&')

export type TIdentity = {
    "id": string,
    "descriptor": string
    "subjectDescriptor": string
    "providerDisplayName": string
    "isActive":boolean
    "members": unknown[],
    "memberOf": unknown[],
    "memberIds": unknown[],
    "resourceVersion": number,
    "metaTypeId": number
}

export class IdentitiesService {
    constructor(
        private config: AzureDevopsApiConfig
    ) {
    }

    async read(ids: string[]) {
        const defaultQuery = {
            identityIds: ids.join(','),
            'api-version': '7.1-preview.1'
        }

        // const query = `api-version=7.1-preview.1`
        const response = await fetch(
            `https://vssps.dev.azure.com/${this.config.host.name}/_apis/identities?${queryString(defaultQuery)}`,
            {
                headers: {
                    'Authorization': `Bearer ${this.config.accessToken}`
                }
            })

        const payload: TAzureResponse<TIdentity> = await response.json()

        return payload.value
    }
}

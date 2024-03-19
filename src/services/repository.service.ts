import { IAuthorizationTokenProvider } from 'azure-devops-extension-api/Common';
import { TeamProjectReference } from 'azure-devops-extension-api/Core';
import { GitRepositoryRef, GitRestClient } from 'azure-devops-extension-api/Git';
import { AzureDevopsApiConfig } from './azure-devops-api.config';

export type TParentRepo = Pick<GitRepositoryRef, 'name' | 'project'>;

export class RepositoryService {
    constructor(
        private config: AzureDevopsApiConfig
    ) {
    }

    public get authTokenProvider(): IAuthorizationTokenProvider {
        return {
            getAuthorizationHeader: async (forceRefresh?: boolean) => `Bearer ${this.config.accessToken}`
        }
    }

    async create(nameRepo: string, parentRepository: TParentRepo | null = null) {
        const gitRestClient: GitRestClient = new GitRestClient({
            rootPath: `${this.config.projectUrl}/`,
            authTokenProvider: this.authTokenProvider,
        })

        return gitRestClient.createRepository({
            name: nameRepo,
            project: this.config.project as TeamProjectReference,
            parentRepository: (parentRepository as GitRepositoryRef)
        })
    }
}

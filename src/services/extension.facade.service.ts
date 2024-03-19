import { IProjectPageService } from 'azure-devops-extension-api';
import { CommonServiceIds } from 'azure-devops-extension-api/Common';
import * as SDK from 'azure-devops-extension-sdk';
import { TPermissionGroup } from '../types/TPermissionGroup';
import { ACEService, IAccessControlEntry } from './ace.service';
import { AzureDevopsApiConfig } from './azure-devops-api.config';
import { GraphService, TGraphGroup } from './graph.service';
import { GroupPermissionsService, TGroupGrade } from './group-permissions.service';
import { IdentitiesService, TIdentity } from './identities.service';
import { RepositoryService, TParentRepo } from './repository.service';
import { TSecurityNamespace, SecurityNamespacesService } from './security-namespaces.service';


export class ExtensionFacadeService {
    private config!: AzureDevopsApiConfig

    constructor() {
        this.init().then();
    }

    public async createRepository(name: string, permissionGroup: TPermissionGroup) {
        const { id} = await this.createRepo(name);

        const namespaceId = await this.getGitNamespaceId();

        const groups = await this.getGroups();

        const groupGradeRegExp = new RegExp(`${permissionGroup}-(junior|senior|lead|middle)`);
        const targetGroups = groups.filter(({displayName}) => displayName.match(groupGradeRegExp));

        const identities = await this.getIdentities(targetGroups.map(({originId}) => originId))

        const aces: IAccessControlEntry[] = this.createAccessControlEntries(identities, groupGradeRegExp);

        return this.setPermission(namespaceId, id, aces)
    }

    private async init(): Promise<void> {
        await SDK.init()
        await SDK.ready();
        SDK.register(SDK.getContributionId(), {});

        const projectService = await SDK.getService<IProjectPageService>(CommonServiceIds.ProjectPageService);

        this.config = new AzureDevopsApiConfig(
            SDK.getHost(),
            (await projectService.getProject())!,
            await SDK.getAccessToken()
        )
    }

    private async getIdentities(ids: string[]): Promise<TIdentity[]> {
        const identitiesService = new IdentitiesService(this.config)

        return identitiesService.read(ids);
    }

    private async setPermission(
        securityNamespaceId: string,
        repositoryId: string,
        aces: IAccessControlEntry[]
    ) {
        const aceService = new ACEService(this.config)

        return aceService.setPermission(securityNamespaceId, repositoryId, aces)
    }

    private async getSecurityNamespaces(): Promise<TSecurityNamespace[]> {
        const securityService = new SecurityNamespacesService(this.config)

        return securityService.getSecurityNamespaces();
    }

    private async createRepo(nameRepo: string, parentRepository: TParentRepo | null = null) {
        const repoService = new RepositoryService(this.config)

        return repoService.create(nameRepo, parentRepository)
    }

    private async getGroups(): Promise<TGraphGroup[]> {
        const graphService = new GraphService(this.config)

        return graphService.getGroups()
    }

    private async getGitNamespaceId(): Promise<string> {
        const nameSpaces = await this.getSecurityNamespaces()
        const {namespaceId} = nameSpaces.find(({dataspaceCategory}) => dataspaceCategory === 'Git')!

        return namespaceId
    }

    private createAccessControlEntries(identities: TIdentity[], groupGradeRegExp: RegExp): IAccessControlEntry[] {
        const groupPermissionService = new GroupPermissionsService();

        return identities.map(({providerDisplayName, descriptor}) => {
            const [_, groupGrade] = providerDisplayName.match(groupGradeRegExp)!;
            const allow = groupPermissionService.getGroupPermissionsSum(groupGrade as TGroupGrade);

            return {
                descriptor,
                deny: 0,
                allow,
                extendedInfo: {}
            }
        })
    }
}



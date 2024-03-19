import { Button } from 'azure-devops-ui/Button';
import { Card } from 'azure-devops-ui/Card';
import { MessageCard, MessageCardSeverity } from 'azure-devops-ui/MessageCard';
import { Spinner, SpinnerSize } from 'azure-devops-ui/Spinner';
import React, { useContext } from 'react';
import { ExtensionServiceContext } from '../providers/ExtensionProvider';
import { permissionGroups, useCreateRepoFormStore } from '../stores/create-repo-form.store';
import { TPermissionGroup } from '../types/TPermissionGroup';
import SelectGroupPermission from './SelectPermissionGroup';

const CreateRepoFormStatus = () => {
    const {
        status,
        payload,
    } = useCreateRepoFormStore()

    if (status === 'error') {
        return (
            // @ts-ignore
            <MessageCard severity={MessageCardSeverity.Error}>{payload}</MessageCard>
        )
    }

    if (status === 'loading') {
        return (
            <div className="flex-row flex-center justify-center">
                <Spinner size={SpinnerSize.medium}/>
                <span className="margin-left-16">{payload}</span>
            </div>
        )
    }

    if (status === 'success') {
        // @ts-ignore
        return <MessageCard severity={MessageCardSeverity.Info}>{payload}</MessageCard>
    }

    return null
}

const CreateRepoForm = () => {
    const extensionContext = useContext(ExtensionServiceContext);
    const {
        name,
        permissionGroup,
        onLoading,
        onError,
        onSuccess,
        onChangeName,
        onChangePermissionGroup,
        status
    } = useCreateRepoFormStore()

    const onClick = async () => {
        onLoading('Creating repo...')

        try {
            await extensionContext.createRepository(name, permissionGroup)
            onSuccess(`Repo ${name} has benn created for Group ${permissionGroup}`)
        } catch (e: any) {
            onError(e)
        }
    }

    return (
        <Card>
            <div className="flex-column justify-space-between">
                <div className={"margin-bottom-16"}>
                    <input
                        style={{width: '100%'}}
                        className="bolt-textfield-input-with-prefix bolt-textfield-input font-size-l"
                        id="repoName"
                        placeholder={"Name of repository"}
                        type="text"
                        onChange={(e) => onChangeName(e.target.value)}
                    />
                </div>
                <div className={"margin-bottom-16"}>
                    <SelectGroupPermission
                        permissions={permissionGroups}
                        selected={permissionGroup}
                        onSelect={permission => onChangePermissionGroup(permission as TPermissionGroup)}
                    ></SelectGroupPermission>
                </div>
                <Button
                    className={"margin-bottom-16"}
                    text="Submit"
                    onClick={() => onClick()}
                    primary={true}
                    disabled={status === 'loading'}
                ></Button>

                <div className="margin-vertical-16">
                    <CreateRepoFormStatus></CreateRepoFormStatus>
                </div>
            </div>
        </Card>
    )
}

export default CreateRepoForm;

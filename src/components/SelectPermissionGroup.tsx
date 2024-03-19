import { RadioButton, RadioButtonGroup } from 'azure-devops-ui/RadioButton';
import React from 'react';

export interface IPermissionGroupProps<T extends string = string> {
    permissions: T[],
    selected: T,
    onSelect: (permission: T) => void
}

const SelectGroupPermission: React.FC<IPermissionGroupProps> = (
    {
        selected,
        permissions,
        onSelect
    }
) => {

    return (
        <>
            {/*@ts-ignore*/}
            <RadioButtonGroup
                onSelect={permission => onSelect(permission)}
                selectedButtonId={selected}
                text={"Select permission group"}
            >{
                permissions.map(permission => {
                    return <RadioButton id={permission} text={permission} key={permission}/>
                })
            }</RadioButtonGroup>
        </>
    )
}

export default SelectGroupPermission

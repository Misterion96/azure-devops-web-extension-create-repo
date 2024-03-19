import { create } from 'zustand';
import { TPermissionGroup } from '../types/TPermissionGroup';

export const permissionGroups: TPermissionGroup[] = ['frontend', 'backend'];

type TCreateRepoFormStatus = 'idle' | 'error' | 'loading' | 'success'

interface State {
    name: string,
    permissionGroup: TPermissionGroup,

    onChangeName: (name: string) => void,
    onChangePermissionGroup: (permissionGroup: TPermissionGroup) => void,

    onError: (payload: string) => void,
    onSuccess: (payload: string) => void,
    onLoading: (payload: string) => void,

    status: TCreateRepoFormStatus,
    payload: string,
    reset: () => void
}

export const useCreateRepoFormStore = create<State>((set) => ({
    name: '',
    permissionGroup: permissionGroups[0],
    status: 'idle',
    payload: '',
    onChangeName: (name: string) => set(() => ({name})),
    onChangePermissionGroup: (permissionGroup: TPermissionGroup) => set({permissionGroup}),
    onError: (payload: string) => set(() => ({payload, status: 'error'})),
    onSuccess: (payload: string) => set(() => ({payload, status: 'success'})),
    onLoading: (payload: string) => set(() => ({payload, status: 'loading'})),
    reset: () => set(() => ({payload: '', status: 'idle', name: '',})),
}))

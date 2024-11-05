export interface CustomFormData {
    username: FormDataEntryValue | null;
    password: FormDataEntryValue | null;
    passwordConfirmation?: FormDataEntryValue | null;
}

export interface FileModel {
    size: string;
    id: number;
    folder_id: number | null;
    createdAt: string;
    updatedAt: string;
    name: string;
    user_id: number;
    type: string;
    storage_url: string;
}

export interface FolderModel {
    id: number;
    folder_id: number | null;
    createdAt: string;
    updatedAt: string;
    name: string;
    user_id: number;
}
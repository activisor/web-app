/**
 * interface for validating FormData
 */


interface FormDataValidation {
    validate: (body: FormData) => boolean;
}

export type { FormDataValidation };
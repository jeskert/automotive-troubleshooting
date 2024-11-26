import * as React from "react";
import { GridProps, SelectFieldProps, TextFieldProps } from "@aws-amplify/ui-react";
export declare type EscapeHatchProps = {
    [elementHierarchy: string]: Record<string, unknown>;
} | null;
export declare type VariantValues = {
    [key: string]: string;
};
export declare type Variant = {
    variantValues: VariantValues;
    overrides: EscapeHatchProps;
};
export declare type ValidationResponse = {
    hasError: boolean;
    errorMessage?: string;
};
export declare type ValidationFunction<T> = (value: T, validationResponse: ValidationResponse) => ValidationResponse | Promise<ValidationResponse>;
export declare type TicketCreateFormInputValues = {
    userId?: number;
    title?: string;
    content?: string;
    status?: string;
    resolverId?: number;
};
export declare type TicketCreateFormValidationValues = {
    userId?: ValidationFunction<number>;
    title?: ValidationFunction<string>;
    content?: ValidationFunction<string>;
    status?: ValidationFunction<string>;
    resolverId?: ValidationFunction<number>;
};
export declare type PrimitiveOverrideProps<T> = Partial<T> & React.DOMAttributes<HTMLDivElement>;
export declare type TicketCreateFormOverridesProps = {
    TicketCreateFormGrid?: PrimitiveOverrideProps<GridProps>;
    userId?: PrimitiveOverrideProps<TextFieldProps>;
    title?: PrimitiveOverrideProps<TextFieldProps>;
    content?: PrimitiveOverrideProps<TextFieldProps>;
    status?: PrimitiveOverrideProps<SelectFieldProps>;
    resolverId?: PrimitiveOverrideProps<TextFieldProps>;
} & EscapeHatchProps;
export declare type TicketCreateFormProps = React.PropsWithChildren<{
    overrides?: TicketCreateFormOverridesProps | undefined | null;
} & {
    clearOnSuccess?: boolean;
    onSubmit?: (fields: TicketCreateFormInputValues) => TicketCreateFormInputValues;
    onSuccess?: (fields: TicketCreateFormInputValues) => void;
    onError?: (fields: TicketCreateFormInputValues, errorMessage: string) => void;
    onChange?: (fields: TicketCreateFormInputValues) => TicketCreateFormInputValues;
    onValidate?: TicketCreateFormValidationValues;
} & React.CSSProperties>;
export default function TicketCreateForm(props: TicketCreateFormProps): React.ReactElement;

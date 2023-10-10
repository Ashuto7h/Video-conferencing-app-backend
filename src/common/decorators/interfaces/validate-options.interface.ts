import { TypeHelpOptions } from 'class-transformer';

interface BasicValidationOptions {
    description?: string;

    isOptional?: boolean;

    isArray?: boolean;
}

export interface IsStringOptions extends BasicValidationOptions {
    canBeEmpty?: boolean;
}

export interface IsEmailOptions extends Exclude<BasicValidationOptions, 'isArray'> {}

export interface IsNumberOptions extends BasicValidationOptions {
    min?: number;
    max?: number;
}

export interface IsDateOptions extends BasicValidationOptions {
    before?: Date;

    after?: Date;
}

export interface IsObjectOptions extends BasicValidationOptions {
    // eslint-disable-next-line @typescript-eslint/ban-types
    type: (type?: TypeHelpOptions | undefined) => Function;
}

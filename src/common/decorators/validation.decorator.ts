import { applyDecorators } from '@nestjs/common';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import {
    IsEmail,
    IsISO8601,
    IsNotEmpty,
    IsNumber,
    IsOptional,
    IsString,
    Max,
    MaxDate,
    Min,
    MinDate,
    ValidateNested,
} from 'class-validator';
import {
    IsDateOptions,
    IsEmailOptions,
    IsNumberOptions,
    IsObjectOptions,
    IsStringOptions,
} from './interfaces/validate-options.interface';

export const valueIsString = ({
    isArray,
    isOptional,
    description,
    canBeEmpty,
}: IsStringOptions = {}) => {
    const decorators = [
        isOptional ? ApiPropertyOptional({ description }) : ApiProperty({ description }),
        IsString({ each: isArray }),
        canBeEmpty ? undefined : IsNotEmpty(),
        isOptional ? IsOptional() : undefined,
    ];
    return applyDecorators(
        ...(decorators.filter((decorator) => !!decorator) as PropertyDecorator[]),
    );
};

export const valueIsEmail = ({ description, isOptional }: IsEmailOptions = {}) => {
    const decorators = [
        isOptional ? ApiPropertyOptional({ description }) : ApiProperty({ description }),
        IsEmail({}),
        isOptional ? IsOptional() : undefined,
    ];
    return applyDecorators(
        ...(decorators.filter((decorator) => !!decorator) as PropertyDecorator[]),
    );
};

export const valueIsNumber = ({
    description,
    isOptional,
    min,
    max,
    isArray,
}: IsNumberOptions = {}) => {
    const decorators = [
        isOptional ? ApiPropertyOptional({ description }) : ApiProperty({ description }),
        IsNumber({}, { each: isArray }),
        isOptional ? IsOptional() : undefined,
        min !== undefined ? Min(min) : undefined,
        max !== undefined ? Max(max) : undefined,
    ];
    return applyDecorators(
        ...(decorators.filter((decorator) => !!decorator) as PropertyDecorator[]),
    );
};

export const valueIsDate = ({
    description,
    isOptional,
    before,
    after,
    isArray,
}: IsDateOptions = {}) => {
    const decorators = [
        isOptional ? ApiPropertyOptional({ description }) : ApiProperty({ description }),
        isOptional ? IsOptional() : undefined,
        Transform(({ value }: { value?: string }) => value && new Date(value)),
        IsISO8601({ strict: true }, { each: isArray }),
        before !== undefined ? MaxDate(before) : undefined,
        after !== undefined ? MinDate(after) : undefined,
    ];
    return applyDecorators(
        ...(decorators.filter((decorator) => !!decorator) as PropertyDecorator[]),
    );
};

export const valueIsObject = ({ description, isOptional, isArray, type }: IsObjectOptions) => {
    const decorators = [
        isOptional ? ApiPropertyOptional({ description }) : ApiProperty({ description }),
        isOptional ? IsOptional() : undefined,
        ValidateNested({ each: isArray }),
        Type(type),
    ];
    return applyDecorators(
        ...(decorators.filter((decorator) => !!decorator) as PropertyDecorator[]),
    );
};

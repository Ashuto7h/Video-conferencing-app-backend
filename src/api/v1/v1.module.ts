import { Module } from '@nestjs/common';
import { APIV1Imports } from './v1.routes';

@Module({ imports: APIV1Imports })
export class APIV1Module {}

import {ModelBase} from './model-base';

export interface Product extends ModelBase{
  description: string;
  quantity: number;
}

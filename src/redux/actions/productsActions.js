import { ActionTypes } from '../../constants';

export function loadProducts() {
  const {LOAD_PRODUCTS} = ActionTypes;
  return {
    type: LOAD_PRODUCTS
  }
}
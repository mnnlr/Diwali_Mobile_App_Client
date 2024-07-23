export const ADD_TO_CART = 'ADD_TO_CART';
export const REMOVE_FROM_CART = 'REMOVE_FROM_CART';
export function addToCart(item) {
  return {
    type: ADD_TO_CART,
    data: item,
  };
}
export function removeFromCart(item) {
    return {
      type: REMOVE_FROM_CART,
      data: item,
    };
  }
  export function addToWatch(item){
    return{
      type : 'ADDTOWATCH',
      data : item
    }
  }
  export function removeToWatch(item){
    return{
      type : 'REMOVETOWATCH',
      data : item
    }
  }
  export function user(item){
    return{
      type : 'userdata',
      data : item
    }
  }
import * as actionTypes from "../constants/index";

export const initialState = {
  isOpen: [], // for active default menu
  fontFamily: `'Roboto', sans-serif`,
  borderRadius: 12,
  opened: true,
};


const customizationReducer = (state = initialState, action: any) => {
  let id;
  switch (action.type) {
    case actionTypes.MENU_OPEN:
      id = action.id;
      return {
        ...state,
        isOpen: [id],
      };
    case actionTypes.SET_MENU:
      return {
        ...state,
        opened: action.opened,
      };
    case actionTypes.SET_FONT_FAMILY:
      return {
        ...state,
        fontFamily: action.fontFamily,
      };
    case actionTypes.SET_BORDER_RADIUS:
      return {
        ...state,
        borderRadius: action.borderRadius,
      };
    default:
      return state;
  }
};

export default customizationReducer;

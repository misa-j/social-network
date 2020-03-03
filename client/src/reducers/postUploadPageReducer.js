import { postConstants } from "../_constants/postConstants";

const initialState = {
  imgSrc: null,
  imgSrcExt: null,
  cropImgSrc: null,
  canvasHasValue: false,
  divs: [],
  step: 0,
  uploading: false,
  location: {
    coordinates: [],
    locationName: ""
  }
};

export function postUpload(state = initialState, action) {
  switch (action.type) {
    case "RESET_IMAGE":
      return {
        ...state,
        ...initialState
      };
    case "PREVIOUS_PAGE":
      if (state.step > 0) {
        return {
          ...state,
          step: state.step - 1,
          divs: []
        };
      } else {
        return {
          ...state
        };
      }
    case "NEXT_PAGE":
      if (state.step < 1) {
        return {
          ...state,
          step: state.step + 1
        };
      } else {
        return {
          ...state
        };
      }
    case "ADD_IMAGE_TAG":
      return {
        ...state,
        divs: [...state.divs, action.div]
      };

    case "DELETE_IMAGE_TAG":
      return {
        ...state,
        divs: state.divs.filter(({ id }) => id !== action.id)
      };
    case postConstants.ADD_POST_REQUEST:
      return {
        ...state,
        uploading: true
      };

    case postConstants.CANVAS_HAS_VALUE:
      return {
        ...state,
        canvasHasValue: action.hasValue
      };
    case postConstants.IMAGE_SELECT:
      return {
        ...state,
        imgSrc: action.imgSrc,
        imgSrcExt: action.imgSrcExt
      };
    case postConstants.IMAGE_CROP_SELECT:
      return {
        ...state,
        cropImgSrc: action.imgSrc
      };

    case postConstants.MAP_LOCATION_SELECT:
      const { text, geometry } = action.location;
      return {
        ...state,
        location: {
          ...state.location,
          coordinates: geometry.coordinates,
          locationName: text
        }
      };
    case postConstants.ADD_POST_SUCCESS:
      return {
        ...state,
        ...initialState,
        step: 0,
        uploading: false
      };
    case postConstants.ADD_POST_FAILURE:
      return {
        ...state,
        uploading: false
      };
    default:
      return state;
  }
}

import {
  ActionProps,
  CmdActionTypes,
  CmdGuardProps,
} from '../../../types';

const initialState: CmdGuardProps = {
  data: [{
    stop: false,
  }],
};

export const reducer =
(state: CmdGuardProps = initialState, action: ActionProps): CmdGuardProps => {
  // console.log('blockchain info: ', action.type, action.payload)
  if ( action.type == CmdActionTypes.CMD_STOP ) {
    const guardData = action.payload as CmdGuardProps;
    return {...state, data: guardData.data};
  } else {
    return state;
  }
};

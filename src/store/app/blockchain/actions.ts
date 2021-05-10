import {Minima} from 'minima';

import {
  AppDispatch,
  LogsActionTypes,
  LogsProps,
  CmdActionTypes,
  TxActionTypes,
  TxData,
  CmdArgs,
} from '../../types';

import {
  Remote,
  Post,
  Dbase,
} from '../../../config';

import {write} from '../../actions';

const sleep = (ms: number) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

const doPost = (url: string, cmd: string): Promise<object> => {
  return new Promise((resolve, reject) => {
    Minima.net.POST(Remote.cmdURL, cmd, function(msg: any) {
      if ( msg.hasOwnProperty('result')) {
        const cmdObject = JSON.parse(msg.result);
        if ( cmdObject.status ) {
          resolve(cmdObject.response);
        } else {
          resolve({});
        }
      } else {
        resolve({});
      }
    });
  });
};

export const init = () => {
  return async (dispatch: AppDispatch) => {
    const txInit: TxData = {
      code: '',
      summary: '',
      time: '',
    };
    Minima.init( function(msg: any) {
      if (msg.event == 'connected') {
        dispatch(write({data: txInit})(TxActionTypes.TX_INIT));
      }
    });
  };
};

export const initTx = () => {
  return async (dispatch: AppDispatch) => {
    const txInit: TxData = {
      code: '',
      summary: '',
      time: '',
    };
    dispatch(write({data: txInit})(TxActionTypes.TX_INIT));
  };
};

/*
try {
  console.log('trying');
  const response = await axios({
    method: 'POST',
    url: Remote.cmdURL,
    headers: {
      'Content-Type': 'application/json',
    },
    data: cmd,
  });
  console.log('trying', response);
  dispatch(write({data: response.data})(CmdActionTypes.CMD_SUCCESS));
} catch (error) {
  console.log('oops', error);
  dispatch(write({data: []})(CmdActionTypes.CMD_FAILURE));
  return {};
}
*/

export const clear = () => {
  return async (dispatch: AppDispatch) => {
    dispatch(write({data: []})(CmdActionTypes.CMD_SUCCESS));
  };
};

export const command = (cmd: string) => {
  return async (dispatch: AppDispatch) => {
    dispatch(write({data: [{stop: false}]})(CmdActionTypes.CMD_STOP));
    Minima.net.POST(Remote.cmdURL, cmd, function(msg: any) {
      dispatch(write({data: [{stop: true}]})(CmdActionTypes.CMD_STOP));
      if ( msg.hasOwnProperty('result')) {
        const cmdObject = JSON.parse(msg.result);
        if ( cmdObject.status ) {
          dispatch(
              write({data: cmdObject.response})(CmdActionTypes.CMD_SUCCESS),
          );
        } else {
          dispatch(write({data: []})(CmdActionTypes.CMD_FAILURE));
        }
      }
    });
  };
};

export const commandIterate = (cmd: CmdArgs) => {
  return async (dispatch: AppDispatch, getState: Function) => {
    dispatch(write({data: [{stop: false}]})(CmdActionTypes.CMD_STOP));
    if ( cmd.forever ) {
      let state = getState();
      let stop = false;
      while (!stop) {
        const thisPost = await doPost(Remote.cmdURL, cmd.cmd);
        dispatch(write({data: thisPost})(CmdActionTypes.CMD_SUCCESS));
        await sleep(cmd.interval);
        state = getState();
        stop = state.cmdGuardData.data[0].stop;
      }
    } else {
      for ( let i = 0; i < cmd.iterations; i++ ) {
        const thisPost = await doPost(Remote.cmdURL, cmd.cmd);
        dispatch(write({data: thisPost})(CmdActionTypes.CMD_SUCCESS));
        await sleep(cmd.interval);
      }
      dispatch(write({data: [{stop: true}]})(CmdActionTypes.CMD_STOP));
    }
  };
};

export const setStop = (stop: boolean) => {
  return async (dispatch: AppDispatch) => {
    dispatch(write({data: [{stop: stop}]})(CmdActionTypes.CMD_STOP));
  };
};

export const getLogs = () => {
  return async (dispatch: AppDispatch) => {
    const d = new Date(Date.now());
    const dateText = d.toString();
    let txData = {
      code: '200',
      summary: Post.getSuccess,
      time: dateText,
    };

    const tableName = Dbase.tables.log.name;
    const selectSQL = 'Select * from ' +
      tableName +
      ' ORDER BY DATE DESC';

    Minima.sql(selectSQL, function(result: any) {
      // console.log(result);
      if ( !result.status ) {
        txData = {
          code: '503',
          summary: Post.getFailure,
          time: dateText,
        };
        dispatch(write({data: txData})(TxActionTypes.TX_FAILURE));
      } else {
        const theseLogs: LogsProps = result.response.rows.slice();
        dispatch(write({data: theseLogs})(LogsActionTypes.LOGS_SUCCESS));
        dispatch(write({data: txData})(TxActionTypes.TX_SUCCESS));
      }
    });
  };
};

/*
const get = (url: string, actionType: string) => {
  return async (dispatch: AppDispatch) => {
    try {
      const d = new Date(Date.now());
      const dateText = d.toString();

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const statusText = response.statusText;
        return response.json()
            .then((data) => {
              throw new Error(`${Post.getFailure}: ${statusText}`);
            });
      } else {
        const result = await response.json();
        dispatch(write({data: result})(actionType));
        const txData = {
          code: '200',
          summary: `${Post.getSuccess}`,
          time: `${dateText}`,
        };
        dispatch(write({data: txData})(TxActionTypes.TX_SUCCESS));
      }
    } catch ( error ) {
      console.error( error.message );
    }
  };
};

const post = (url: string, data: object) => {
  return async (dispatch: AppDispatch) => {
    // console.log("Post: ", url, data)
    const d = new Date(Date.now());
    const dateText = d.toString();
    let txData: TxData = {
      code: '404',
      summary: Post.postFailure,
      time: `${dateText}`,
    };

    fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
        .then((response) => {
          if (!response.ok) {
            const status = response.status;
            const statusText = response.statusText;
            return response.json()
                .then((data) => {
                  txData = {
                    code: status.toString(),
                    summary: `${Post.postFailure}: ${statusText}`,
                    time: `${dateText}`,
                  };
                  throw new Error();
                });
          }
          return response.json();
        })
        .then((data) => {
          txData = {
            code: '200',
            summary: `${Post.postSuccess}`,
            time: `${dateText}`,
          };
          dispatch(write({data: txData})(TxActionTypes.TX_SUCCESS));
        })
        .catch((error) => {
          dispatch(write({data: txData})(TxActionTypes.TX_FAILURE));
        });
  };
};
*/

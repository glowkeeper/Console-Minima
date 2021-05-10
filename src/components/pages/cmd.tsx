import React, {useState, useEffect, ChangeEvent} from 'react';
import {connect} from 'react-redux';

import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Switch from '@material-ui/core/Switch';

import * as Yup from 'yup';
import {useFormik} from 'formik';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Input from '@material-ui/core/Input';

import {theme, themeStyles} from '../../styles';

import {
  ApplicationState,
  AppDispatch,
  CmdProps,
  CmdArgs,
} from '../../store/types';

import {
  clear,
  command,
  commandIterate,
  setStop,
} from '../../store/app/blockchain/actions';

import {
  GeneralError,
  Cmd as CmdConfig,
} from '../../config';

const cmdSchema = Yup.object().shape({
  cmd: Yup.string()
      .required(GeneralError.required),
  iterate: Yup.boolean(),
  interval: Yup.number()
      .when('iterate', {
        is: true,
        then: Yup.number()
            .min(CmdConfig.minInterval, CmdConfig.minIntervalError),
      }),
  forever: Yup.boolean(),
  iterations: Yup.number()
      .when('iterate', {
        is: true,
        then: Yup.number()
            .when('forever', {
              is: false,
              then: Yup.number()
                  .positive(CmdConfig.minIterationError),
            }),
      }),
});

interface StateProps {
  cmd: CmdProps
  cmdStop: boolean
}

interface DispatchProps {
  clear: () => void
  command: (cmd: string) => void
  commandIterate: (cmd: CmdArgs) => void
  setStop:(stop: boolean) => void
}

type Props = StateProps & DispatchProps

const display = (props: Props) => {
  const [cmd, setCmd] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [iterateChecked, setIterateChecked] = useState(false);
  const [foreverChecked, setForeverChecked] = useState(false);
  const [interval, setInterval] = useState(0);
  const [numIterations, setNumIterations] = useState(0);
  const classes = themeStyles();

  useEffect(() => {
    if ( props.cmdStop ) {
      setIsRunning(false);
    }
  }, [props.cmdStop]);

  const formik = useFormik({
    initialValues: {
      cmd: cmd,
      iterate: iterateChecked,
      interval: interval,
      forever: foreverChecked,
      iterations: numIterations,
    },
    enableReinitialize: true,
    validationSchema: cmdSchema,
    onSubmit: (values: any) => {
      setIsRunning(true);
      if ( iterateChecked ) {
        // console.log('values!', values);
        const cmdArgs: CmdArgs = {
          cmd: cmd,
          interval: interval,
          forever: foreverChecked,
          iterations: numIterations,
        };
        props.commandIterate(cmdArgs);
      } else {
        props.command(cmd);
      }
    },
  });

  const handleCmd = (event: ChangeEvent<HTMLInputElement>) => {
    setCmd(event.target.value);
  };

  const handleIterate = (event: ChangeEvent<HTMLInputElement>) => {
    setIterateChecked(event.target.checked);
    if ( !event.target.checked ) {
      setInterval(0);
      setNumIterations(0);
      setForeverChecked(false);
    } else {
      setInterval(CmdConfig.minInterval);
      setNumIterations(1);
    }
  };

  const handleForever = (event: ChangeEvent<HTMLInputElement>) => {
    setForeverChecked(event.target.checked);
    console.log('forevert', foreverChecked, isRunning);
    if ( !event.target.checked ) {
      setNumIterations(1);
    } else {
      setNumIterations(0);
    }
  };

  const handleInterval = (event: ChangeEvent<HTMLInputElement>) => {
    const thisValue = +event.target.value || 0;
    setInterval(thisValue);
  };


  const handleNumIterations = (event: ChangeEvent<HTMLInputElement>) => {
    const thisValue = +event.target.value || 0;
    // console.log('numiterations', thisValue, numIterations);
    setNumIterations(thisValue);
  };

  const handleStop = () => {
    props.setStop(true);
  };

  const handleClear = () => {
    props.clear();
  };

  return (

    <Grid item container alignItems='flex-start' xs={12}>

      <Grid item container xs={12}>

        <Grid
          item
          container
          alignItems='flex-start'
          justify="flex-start"
          xs={12}
        >

          <Typography variant="h2">
            {CmdConfig.heading}
          </Typography>

        </Grid>

        <Grid item container justify="flex-start" xs={12}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="2000"
            height="4"
          >
            <line x2="4000" stroke="#317AFF" strokeWidth={4} />
          </svg>
        </Grid>

        <form onSubmit={formik.handleSubmit} className={classes.formSubmit}>
          <Grid item container xs={12}>

            <Grid
              item
              container
              className={classes.formLabel}
              justify="flex-start"
              alignItems="center"
              xs={4}
              lg={2}
            >
              <label htmlFor="cmd">{CmdConfig.cmd}</label>
            </Grid>
            <Grid item container xs={8} lg={10}>
              <TextField
                fullWidth
                size="small"
                name="cmd"
                type="text"
                value={formik.values.cmd}
                onChange={(event: ChangeEvent<HTMLInputElement>) => {
                  handleCmd(event);
                  formik.handleChange(event);
                }}
                InputProps={{disableUnderline: true}}
              />
            </Grid>
            {formik.errors.cmd && formik.touched.cmd ? (
              <>
                <Grid item container xs={4} lg={2}>
                  <Typography variant="body1">
                    &nbsp;
                  </Typography>
                </Grid>
                <Grid
                  className={classes.formError}
                  item container
                  xs={8}
                  lg={10}
                >
                  {formik.errors.cmd}
                </Grid>
              </>
              ) : null
            }
          </Grid>
          <Grid item container xs={12}>
            <Grid
              item
              container
              className={classes.formLabel}
              justify="flex-start"
              alignItems="center"
              xs={4}
              lg={2}
            >
              <label htmlFor="iterate">{CmdConfig.iterate}</label>
            </Grid>
            <Grid item container xs={8} lg={10}>
              <Switch
                size='medium'
                color="primary"
                name="iterate"
                checked={iterateChecked}
                onChange={(event: ChangeEvent<HTMLInputElement>) => {
                  handleIterate(event);
                  formik.handleChange(event);
                }}
                inputProps={{'aria-label': 'primary checkbox'}}
              />
            </Grid>

          </Grid>

          <Grid item container xs={12}>

            <Grid
              item
              container
              className={classes.formLabel}
              justify="flex-start"
              alignItems="center"
              xs={4}
              lg={2}
            >
              <label htmlFor="interval">{CmdConfig.interval}</label>
            </Grid>
            <Grid item container xs={8} lg={10}>
              <Input
                fullWidth
                disableUnderline={true}
                disabled={!iterateChecked}
                name="interval"
                type="number"
                value={formik.values.interval}
                onChange={(event: ChangeEvent<HTMLInputElement>) => {
                  handleInterval(event);
                  formik.handleChange(event);
                }}
              />
            </Grid>
            {formik.errors.interval && formik.touched.interval ? (
              <>
                <Grid item container xs={4} lg={2}>
                  <Typography variant="body1">
                  &nbsp;
                  </Typography>
                </Grid>
                <Grid
                  className={classes.formError}
                  item container
                  xs={8}
                  lg={10}
                >
                  {formik.errors.interval}
                </Grid>
              </>
              ) : null
            }
          </Grid>

          <Grid item container xs={12}>
            <Grid
              item
              container
              className={classes.formLabel}
              justify="flex-start"
              alignItems="center"
              xs={4}
              lg={2}
            >
              <label htmlFor="forever">{CmdConfig.forever}</label>
            </Grid>
            <Grid item container xs={8} lg={10}>
              <Switch
                disabled={!iterateChecked}
                size='medium'
                color="primary"
                name="forever"
                checked={foreverChecked}
                onChange={(event: ChangeEvent<HTMLInputElement>) => {
                  handleForever(event);
                  formik.handleChange(event);
                }}
                inputProps={{'aria-label': 'primary checkbox'}}
              />
            </Grid>

          </Grid>

          <Grid item container xs={12}>

            <Grid
              item
              container
              className={classes.formLabel}
              justify="flex-start"
              alignItems="center"
              xs={4}
              lg={2}
            >
              <label htmlFor="iterations">{CmdConfig.iterations}</label>
            </Grid>
            <Grid item container xs={8} lg={10}>
              <Input
                fullWidth
                disableUnderline={true}
                disabled={iterateChecked ?
                  (foreverChecked ? true : false) :
                  true
                }
                name="iterations"
                type="number"
                value={formik.values.iterations}
                onChange={(event: ChangeEvent<HTMLInputElement>) => {
                  handleNumIterations(event);
                  formik.handleChange(event);
                }}
              />
            </Grid>
            {formik.errors.iterations && formik.touched.iterations ? (
                <>
                  <Grid item container xs={4} lg={2}>
                    <Typography variant="body1">
                    &nbsp;
                    </Typography>
                  </Grid>
                  <Grid
                    className={classes.formError}
                    item container
                    xs={8}
                    lg={10}
                  >
                    {formik.errors.iterations}
                  </Grid>
                </>
              ) : null
            }
          </Grid>

          <Grid item container xs={12}>

            <Grid item container xs={4} lg={2}>
              <Typography variant="body1">
                &nbsp;
              </Typography>
            </Grid>

            <Grid item container xs={8} lg={10} justify='flex-start'>

              <Grid
                className={classes.formButton}
                item
              >
                <Button
                  disableElevation={true}
                  disabled={isRunning}
                  type='submit'
                  color="primary"
                  size='medium'
                  variant="contained"
                >
                  {CmdConfig.cmdButton}
                </Button>
              </Grid>

              <Grid
                className={classes.formButton}
                item
              >
                <Button
                  disableElevation={true}
                  disabled={!foreverChecked || !isRunning}
                  onClick={handleStop}
                  color="primary"
                  size='medium'
                  variant="contained"
                  style={{
                    marginLeft: theme.spacing(1),
                    marginRight: theme.spacing(1),
                  }}
                >
                  {CmdConfig.stopButton}
                </Button>
              </Grid>

              <Grid
                className={classes.formButton}
                item
              >
                <Button
                  disableElevation={true}
                  onClick={handleClear}
                  color="primary"
                  size='medium'
                  variant="contained"
                >
                  {CmdConfig.clearButton}
                </Button>
              </Grid>
            </Grid>

          </Grid>

        </form>

        <Grid item container justify="flex-start" xs={12}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="2000"
            height="4"
          >
            <line x2="4000" stroke="#317AFF" strokeWidth={4} />
          </svg>
        </Grid>

        <div>
          <pre>
            {(((JSON.stringify(props.cmd.data, undefined, 2))
                .slice(1, -1))
                .replace(/(^[ \t]*\n)/gm, ''))
                .replace(/\\n/g, '\n')
            }
          </pre>
        </div>
      </Grid>

    </Grid>
  );
};

/* Removes first and last characters and then any empty lines
{((JSON.stringify(props.cmd.data, undefined, 2))
    .slice(1,-1))
    .replace(/(^[ \t]*\n)/gm, "")
}
*/

const mapStateToProps = (state: ApplicationState): StateProps => {
  return {
    cmd: state.cmdData as CmdProps,
    cmdStop: state.cmdGuardData.data[0].stop,
  };
};

const mapDispatchToProps = (dispatch: AppDispatch): DispatchProps => {
  return {
    clear: () => dispatch(clear()),
    command: (cmd: string) => dispatch(command(cmd)),
    commandIterate: (cmd: CmdArgs) => dispatch(commandIterate(cmd)),
    setStop: (stop: boolean) => dispatch(setStop(stop)),
  };
};

export const Cmd = connect<StateProps, DispatchProps, {}, ApplicationState>(
    mapStateToProps,
    mapDispatchToProps,
)(display);

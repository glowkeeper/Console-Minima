import React, {useState, ChangeEvent} from 'react';
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
} from '../../store/types';

import {command} from '../../store/app/blockchain/actions';

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
      .when('forever', {
        is: true,
        then: Yup.number()
            .positive(CmdConfig.minIterationError),
      }),
});

interface StateProps {
  cmd: CmdProps
}

interface DispatchProps {
  command: (cmd: string) => void
}

type Props = StateProps & DispatchProps

const display = (props: Props) => {
  const [cmd, setCmd] = useState('');
  const [iterateChecked, setIterateChecked] = useState(false);
  const [foreverChecked, setForeverChecked] = useState(false);
  const [interval, setInterval] = useState(0);
  const [numIterations, setNumIterations] = useState(0);
  const classes = themeStyles();

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
      console.log('values!', values);
      props.command(values.cmd);
    },
  });

  const handleCmd = (event: ChangeEvent<HTMLInputElement>) => {
    setCmd(event.target.value);
  };

  const handleIterateChanged = (event: ChangeEvent<HTMLInputElement>) => {
    setIterateChecked(event.target.checked);
    if ( !event.target.checked ) {
      setInterval(0);
    } else {
      setInterval(CmdConfig.minInterval);
    }
  };

  const handleForeverChanged = (event: ChangeEvent<HTMLInputElement>) => {
    setForeverChecked(event.target.checked);
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
    // do stuff
  };

  return (
    <Grid className={classes.loggedInContent} item container xs={12}>

      <Grid item container xs={12}>

        <Grid item container justify="flex-start" xs={12}>

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
            <line x2="2000" stroke="#317AFF" strokeWidth={4} />
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
              xs={2}
            >
              <label htmlFor="cmd">{CmdConfig.cmd}</label>
            </Grid>
            <Grid item container xs={10}>
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
              <Grid
                item
                container
                className={classes.formError}
                xs={12}
              >
                <Grid item container xs={2}>
                  <Typography variant="h2">
                    &nbsp;
                  </Typography>
                </Grid>
                <Grid item container xs={10}>
                  {formik.errors.cmd}
                </Grid>
              </Grid>
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
              xs={2}
            >
              <label htmlFor="iterate">{CmdConfig.iterate}</label>
            </Grid>
            <Grid item container xs={10}>
              <Switch
                size='medium'
                color="primary"
                name="iterate"
                checked={iterateChecked}
                onChange={(event: ChangeEvent<HTMLInputElement>) => {
                  handleIterateChanged(event);
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
              xs={2}
            >
              <label htmlFor="interval">{CmdConfig.interval}</label>
            </Grid>
            <Grid item container xs={10}>
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
              <Grid
                item
                container
                className={classes.formError}
                xs={12}
              >
                <Grid item container xs={2}>
                  <Typography variant="h2">
                    &nbsp;
                  </Typography>
                </Grid>
                <Grid item container xs={10}>
                  {formik.errors.interval}
                </Grid>
              </Grid>
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
              xs={2}
            >
              <label htmlFor="forever">{CmdConfig.forever}</label>
            </Grid>
            <Grid item container xs={10}>
              <Switch
                disabled={!iterateChecked}
                size='medium'
                color="primary"
                name="forever"
                checked={foreverChecked}
                onChange={(event: ChangeEvent<HTMLInputElement>) => {
                  handleForeverChanged(event);
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
              xs={2}
            >
              <label htmlFor="iterations">{CmdConfig.iterations}</label>
            </Grid>
            <Grid item container xs={10}>
              <Input
                fullWidth
                disableUnderline={true}
                disabled={!foreverChecked}
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
              <Grid
                item
                container
                className={classes.formError}
                xs={12}
              >
                <Grid item container xs={2}>
                  <Typography variant="h2">
                    &nbsp;
                  </Typography>
                </Grid>
                <Grid item container xs={10}>
                  {formik.errors.iterations}
                </Grid>
              </Grid>
              ) : null
            }
          </Grid>

          <Grid item container xs={12}>

            <Grid item container xs={2}>
              <Typography variant="h2">
                &nbsp;
              </Typography>
            </Grid>

            <Grid className={classes.formButton} item container xs={2}>
              <Button
                type='submit'
                color="primary"
                size='medium'
                variant="contained"
              >
                {CmdConfig.cmdButton}
              </Button>
            </Grid>

            <Grid className={classes.formButton} item container xs={2}>
              <Button
                disabled={!foreverChecked}
                onChange={handleStop}
                color="primary"
                size='medium'
                variant="contained"
                style={{
                  marginLeft: theme.spacing(2),
                }}
              >
                {CmdConfig.stopButton}
              </Button>
            </Grid>

          </Grid>

        </form>

        <Grid item container justify="flex-start" xs={12}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="2000"
            height="4"
          >
            <line x2="2000" stroke="#317AFF" strokeWidth={4} />
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
  };
};

const mapDispatchToProps = (dispatch: AppDispatch): DispatchProps => {
  return {
    command: (cmd: string) => dispatch(command(cmd)),
  };
};

export const Cmd = connect<StateProps, DispatchProps, {}, ApplicationState>(
    mapStateToProps,
    mapDispatchToProps,
)(display);

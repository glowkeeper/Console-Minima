import React, {useEffect, useState} from 'react';

import GoogleFontLoader from 'react-google-font-loader';

import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';

import minimaIcon from '../../images/minimaIcon.svg';

import {Content} from '../content';

import {themeStyles} from '../../styles';

import {Home, App} from '../../config';
import {AppInit} from '../appInit';

export const Main = () => {
  const [isLoading, setIsLoading] = useState(true);
  const classes = themeStyles();

  useEffect(() => {
    setIsLoading(false);
  }, []);

  return (

    <>

      { isLoading?

        <AppInit/> :

        (
          <Grid className={classes.root}>

            <GoogleFontLoader
              fonts={[
                {
                  font: 'Manrope',
                  weights: [300, 400, 500, 600, 700],
                },
                {
                  font: 'Roboto',
                  weights: [300, 400, 500, 600, 700],
                },
              ]}
            />
            <Grid item container className={classes.header} xs={12}>

              <Typography variant="h1">
                {Home.heading}
              </Typography>

            </Grid>

            <Grid className={classes.content} item container xs={12}>
              <Content/>
            </Grid>

            <Grid className={classes.footer} item container xs={12}>

              <Grid
                item
                container
                alignItems="center"
                justify="flex-start"
                xs={10}
              >

                <Typography variant="caption">
                  {App.catchLine}<br />
                  {App.copyright}
                </Typography>

              </Grid>

              <Grid
                item
                container
                alignItems="center"
                justify="flex-end"
                xs={2}
              >

                <img className={classes.appIcon} src={minimaIcon} />

              </Grid>

            </Grid>

          </Grid>
        )
      }
    </>
  );
};

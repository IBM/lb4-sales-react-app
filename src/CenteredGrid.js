import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';

import { baseUrl } from './config';

const styles = theme => ({
  root: {
    flexGrow: 1,
  },
  paper: {
    padding: theme.spacing.unit * 2,
    textAlign: 'center',
    color: theme.palette.text.secondary,
  },
});

class CenteredGrid extends React.Component {
  constructor() {
    super();

    this.state = {
      totalNumberOfSales: 0,
      totalRevenueOfSales: 0,
    }
  }

  async componentDidMount() {
    const [ totalNumberOfSales, totalRevenueOfSales ] = await Promise.all([
      fetch(`${baseUrl}/sales/count`).then(res => res.json()).catch(err => err),
      fetch(`${baseUrl}/sales`).then(res => res.json()).catch(err => err)
    ]);

    this.setState({ 
      totalNumberOfSales: totalNumberOfSales.count || 0,
      totalRevenueOfSales: Array.isArray(totalRevenueOfSales) ? 
        totalRevenueOfSales.reduce((sum, curr) => sum + curr.total, 0) : 0,
    });
  }



  render() {
    const { classes } = this.props;
    return (
    <div className={classes.root}>
      <Grid container spacing={24}>
        <Grid item xs={6}>
          <Paper className={classes.paper}>
          <h3>Total Number Of Sales</h3>
          { this.state.totalNumberOfSales }
          </Paper>
        </Grid>
        <Grid item xs={6}>
          <Paper className={classes.paper}>
          <h3>Total Revenue From Sales</h3>
          ${ this.state.totalRevenueOfSales }
          </Paper>
        </Grid>
      </Grid>
    </div>
  );
  }
}
export default withStyles(styles)(CenteredGrid);
import React from 'react';
import ResponsiveContainer from 'recharts/lib/component/ResponsiveContainer';
import LineChart from 'recharts/lib/chart/LineChart';
import Line from 'recharts/lib/cartesian/Line';
import XAxis from 'recharts/lib/cartesian/XAxis';
import YAxis from 'recharts/lib/cartesian/YAxis';
import CartesianGrid from 'recharts/lib/cartesian/CartesianGrid';
import Tooltip from 'recharts/lib/component/Tooltip';
import Legend from 'recharts/lib/component/Legend';

import { baseUrl, availableCountries } from './config';

const CALC_PERIOD_IN_MONTHS = 12;

class SimpleLineChart extends React.Component {
  constructor() {
    super();

    this.state = {
      graphData: [],
      dates: []
    };

    const MONTHS_IN_TEXT = ['JAN', 'FEB', 'MAR','APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
    const currentYear = new Date().getUTCFullYear();
    const currentMonth = new Date().getUTCMonth();
    
    for (let i = 0; i < CALC_PERIOD_IN_MONTHS; i++) {
      const date = new Date(currentYear, currentMonth - 12 + i, 1);
      
      this.state.dates[i] = {
        label: MONTHS_IN_TEXT[date.getUTCMonth()],
        year: date.getUTCFullYear(),
        month: date.getUTCMonth(),
      };
    }
  }

  async componentDidMount() {
    const monthlyCountrySales = await Promise.all(this.state.dates.map(date => {
      const month = date.month;
      const year = date.year;

      return Promise.all(availableCountries.map(country => 
        fetch(`${baseUrl}/sales/analytics/${country}/${year}/${month+1}`)
          .then(res => res.json())
          .catch(err => err)));

        
    }));

    const monthlyGraphData = monthlyCountrySales.map((monthCountrySales, i) => {
      const monthGraphData = { name: `${this.state.dates[i].label}${this.state.dates[i].year}` };
      
      monthCountrySales.forEach((country, j) => monthGraphData[availableCountries[j]] = typeof country === 'number' ? country : 0);
      
      return monthGraphData
    });

    this.setState({ graphData: monthlyGraphData });
  }

  randomColor() {
    const allowed = 'ABCDEF0123456789';
    let color = '#';
   
    while(color.length < 7){
      color += allowed.charAt(Math.floor((Math.random()*16)+1));
    }
    
    return color;
  }

  render() {
    return (
      <ResponsiveContainer width="99%" height={320}>
        <LineChart data={this.state.graphData}>
          <XAxis dataKey="name" />
          <YAxis />
          <CartesianGrid vertical={false} strokeDasharray="3 3" />
          <Tooltip />
          <Legend />
          {
            availableCountries.map(country => 
              <Line type="monotone" key={country} dataKey={country} stroke={this.randomColor()} activeDot={{ r: 8 }} />
            )
          }
        </LineChart>
      </ResponsiveContainer>
    );
  }
}

export default SimpleLineChart;
import React, { useContext } from 'react';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    Legend,
  } from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';
import dataContext from './context'
import { get_delay_in_hours } from './axios'

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    Legend
  );

const colorOptions = [{ color: '#6699ff' }, 
                      { color: '#ff6666' }, 
                      { color: '#fc8403' },
                      { color: '#ffff66' },
                      { color: '#f803fc' }];

export function LineChart() {
  const { value, value2, rows } = React.useContext(dataContext);
  const [all_delay, setAll_delay] = React.useState([]);

  React.useEffect(() => {
    const formatDate = (date) => {
      return date.format('YYYY-MM-DDTHH:mm:ss')
    };
    const get_all_delay_in_hours = async (timestamp) => {
      const promises = rows.map(async (row) => get_delay_in_hours(row[0], timestamp));
      const res = await Promise.all(promises);
      console.log(res);
      setAll_delay(res);
    };
    if (rows.length > 0) {
      const timestamp = {
        from: formatDate(value), 
        to: formatDate(value2),
      };
      // showLoading(true);
      get_all_delay_in_hours(timestamp);
    }
  },[rows]);
                         
  const data = {
    labels: ['6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18'],
    datasets: all_delay.map((delay_route, index) => {
      let valid_timestamp = delay_route ? delay_route.slice(6, 19) : [];
      return {
        label: rows[index][0].toString(),
        data: valid_timestamp,
        fill: false,
        borderColor: colorOptions[index].color,
        tension: 0.1,
      }
    })
  };
  const options = {
    scales: {
      y: {
        title: {
          display: true,
          text: 'Delay Time'
        }
      },
      x: {
        title: {
          display: true,
          text: 'Hour of Day'
        }
      },
      maintainAspectRatio: false,
    }     
  }
  return <Line data={data} options={options} />;
}

export function BarChart() {
  const { rows } = React.useContext(dataContext);

  const route_name = rows.map(row => row[0]);
  const delay_time = rows.map(row => row[1]);

  const labels = route_name;
  const data2 = {
    labels: labels,
    datasets: [
      {
        label: 'delay time',
        data: delay_time,
        backgroundColor: [colorOptions[0].color, colorOptions[1].color, colorOptions[2].color, 
                          colorOptions[3].color, colorOptions[4].color]
      }
    ]
  };
  const options = {
    scales: {
      y: {
        title: {
          display: true,
          text: 'Delay Time'
        }
      },
      x: {
        title: {
          display: true,
          text: 'Route Name'
        }
      },
      maintainAspectRatio: false,
    }     
  }
  return <Bar data={data2} options={options} />;
}

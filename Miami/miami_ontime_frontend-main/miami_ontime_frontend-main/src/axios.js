import axios from 'axios';

export function get_route( route_short_name ) {
    console.log( 'get_route' );
    return axios.get('/api/route', {
        params: {
            route_short_name: route_short_name
        }}
    ).then(response => {
        return response.data;
    })
    .catch(error => console.log(error));
}

export function get_stops( route_short_name ) {
    console.log( 'get_stops' );
    return axios.get('/api/stops', {
        params: {
            route_short_name: route_short_name
        }}
    ).then(response => {
        return response.data;
    })
   .catch(error => console.log(error));
}

export function get_top_five_delay_route( timestamp, from_route_names ) {
    console.log( 'get_top_five_delay_route' );
    return axios.get('/api/top_route', {
        params: {
            fromDate: timestamp.fromDate,
            toDate: timestamp.toDate,
            fromTime: timestamp.fromTime,
            toTime: timestamp.toTime,
            from_route_names: [...from_route_names].toString(),
        }}
    )
    .then(response => {
        return response.data;
    });
}

export function get_delay_in_hours( route_short_name, timestamp ) {
    console.log( 'get_delay_in_hours' );
    return axios.get('/api/delay_in_hours', {
        params: {
            route_short_name: route_short_name,
            from: timestamp.from,
            to: timestamp.to
        }}
    ).then(response => {
        if (response.data.length > 0) {
            return response.data;
        }
        return [];
    })
  .catch(error => console.log(error));
}

export function get_datetime_limit() {
    console.log('get_datetime_limit');
    return axios.get('/api/datetime_limit')
    .then(response => {
        return response.data;
    }).catch (err => console.log(err));
}

export function send_issue(data) {
    return axios.post('/api/send_issue', JSON.stringify(data))
    .then(response => {
      return response.data;
    }).catch(err => console.log(err));
}

export function get_issue() {
    return axios.get('api/get_issue')
    .then(response => {
        return response.data;
    }).catch(err => console.log(err));
}
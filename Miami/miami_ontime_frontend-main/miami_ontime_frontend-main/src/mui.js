import * as React from 'react';
import dayjs from 'dayjs';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import Divider from '@mui/material/Divider';
import LoadingButton from '@mui/lab/LoadingButton';
import { GlobalLoading, showLoading } from 'react-global-loading';
import { get_top_five_delay_route, send_issue, get_issue } from './axios'
import dataContext from './context';
import Checkbox from '@mui/material/Checkbox';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import FormGroup from '@mui/material/FormGroup';
import Stack from '@mui/material/Stack';
import FormControl from '@mui/material/FormControl';
import TextField from '@mui/material/TextField';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import TablePagination from '@mui/material/TablePagination';


export function ContextProvider({ children }) {

  const [value, setValue] = React.useState(dayjs("2023-01-01T00:00:00"));
  const [value2, setValue2] = React.useState(dayjs("2023-01-02T00:00:00"));
  const [rows, setRows] = React.useState([]);
  const [displayRoute, setDisplayRoute] = React.useState(true)
  const [loading, setLoading] = React.useState(false);
  const [array, setArray] = React.useState(['1', '10', '101', '102', '104', '105', '107', '108', '11', '110', '112', '113', '115', '119', '12', '120', '132', '135', '136', '137', '150', '155', '16', '17', '183', '19', '2', '200', '202', '204', '207', '208', '21', '210', '211', '212', '217', '22', '2300', '238', '24', '241', '246', '248', '252', '254', '267', '27', '272', '277', '286', '287', '288', '29', '297', '3', '301', '302', '31', '32', '33', '338', '34', '344', '35', '36', '37', '38', '40', '42', '46', '500', '51', '52', '54', '56', '57', '62', '7', '71', '72', '73', '75', '77', '79', '8', '82', '836', '837', '87', '88', '9', '93', '95', '99', 'CGABLE', 'MMI', 'MMO', 'RAIL']);
  const [selectedRoute, setSelectedRoute] = React.useState(new Set([...array]));


  const updateValue = (newValue) => {
    setValue(newValue);
  }

  const updateValue2 = (newValue) => {
    setValue2(newValue);
  }

  const updateRows = (newData) => {
    setRows(newData);
  }

  const updateRoute = (isRoute) => {
    setDisplayRoute(isRoute);
  }

  const updateLoading = (isLoading) => {
    setLoading(isLoading);
  }

  return (
    <dataContext.Provider value={{ 
      value,  
      updateValue, 
      value2, 
      updateValue2, 
      rows, 
      updateRows,
      displayRoute,
      updateRoute,
      loading,
      updateLoading,
      selectedRoute,
      setSelectedRoute,
      array,
      
      }}>
      {children}
    </dataContext.Provider>
  );
}

/**
 * function DateTimePickerValue
 * param {subtractMonth} set the default value of start date to be current date minus the number of months specified
 * param {label} the label of the DateTimePicker
 */

export function DateTimePickerValue() {
  const { value, updateValue, value2, updateValue2 } = React.useContext(dataContext);

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DemoContainer components={['DateTimePicker']}>
        <DateTimePicker
          label='From Date'
          slotProps={{ textField: { size: 'small' } }}
          value={value}
          ampm={false}
          minDate={dayjs("2022-10-01")}
          onChange={(newValue) => {
            updateValue(newValue);
          }}
        />
      </DemoContainer>
      <DemoContainer components={['DateTimePicker']}>
        <DateTimePicker
          label='To Date'
          slotProps={{ textField: { size: 'small' } }}
          value={value2}
          ampm={false}
          minDate={dayjs("2022-10-01")}
          onChange={(newValue) => {
            updateValue2(newValue);
          }}
        />
      </DemoContainer>
    </LocalizationProvider>
  );
}

export function FixedContainer({ children }) {
  return (
    <React.Fragment>
      <CssBaseline />
      <Container fixed>
        <Box sx={{ bgcolor: '#cfe8fc', marginTop: '5%', marginLeft: '-7%', width: '100%', height: '105.4%'}}>
          {children}
        </Box>
      </Container>
    </React.Fragment>
  );
}

export function BasicTable() {
  const { value, value2, updateRows, rows, loading, selectedRoute } = React.useContext(dataContext);

  React.useEffect(() => {
    async function getRows() {
      try {
        const timestamp = {
          fromDate: value.format('YYYY-MM-DD'),
          toDate: value2.format('YYYY-MM-DD'),
          fromTime: value.format('HH:mm:ss'),
          toTime: value2.format('HH:mm:ss'),
        }
        showLoading(true);

        const res = await get_top_five_delay_route(timestamp, selectedRoute);
        updateRows(res);

      } catch(error) {
        console.log(error);
      }
    }
    console.log(value + " " + value2);
    getRows();
  }, [loading]);

  return (
    <TableContainer component={Paper}>
      <Table sx={{ maxWidth: 500 }} size={'small'} padding='normal' aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell align="left">RouteID</TableCell>
            <TableCell align="right">Average Delayed Time (min)</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row, index) => (
            <TableRow
              key={index}
              sx={{ '&:last-child td, &:last-child th': { border: 0 }}}
            >
              <TableCell align="right">{row[0]}</TableCell>
              <TableCell align="right">{parseFloat(row[1]).toFixed(2)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export function ControlledSwitches() {
  const {displayRoute, updateRoute} = React.useContext(dataContext);

  const handleChange = (event) => {
    updateRoute(event.target.checked);
  };

  return (
      <FormControlLabel 
        control={<Switch />} 
        label= { "Stop Station" }
        onChange={handleChange}
        checked={displayRoute}
      />
  );
}

export function BoxSx({children}) {
  return (
    <Box
      sx={{
        width: 300,
        height: 100,
        p: 0, 
        border: '1px solid grey',
      }}
    >
      {children}
    </Box>
  );
}

export function InsetDividers() {

  function MakeColor({ color }) {
    const circleStyle = {
      width: '50px',
      height: '50px',
      borderRadius: '50%',
      backgroundColor: color,
    };
  
    return <div style={circleStyle}></div>;
  }
  const { rows } = React.useContext(dataContext);
  const route_name = rows.map((row) => row[0]);

  return (
    <List
      sx={{
        width: '100%',
        maxWidth: 360,
        bgcolor: 'background.paper',
      }}
    >
      <ListItem sx={{ paddingY: '3px' }}>
        <ListItemAvatar>
          <Avatar sx={{ width: '25px', height: '25px' }}>
            <MakeColor color= '#6699ff' />
          </Avatar>
        </ListItemAvatar>
        <ListItemText primary= {'Route name: ' + route_name[0]} />
      </ListItem>
      <Divider variant="inset" component="li" />
      <ListItem sx={{ paddingY: '3px' }}>
        <ListItemAvatar>
          <Avatar sx={{ width: '25px', height: '25px' }}>
          <MakeColor color= '#ff6666' />
          </Avatar>
        </ListItemAvatar>
        <ListItemText primary= {'Route name: ' + route_name[1]} />
      </ListItem>
      <Divider variant="inset" component="li" />
      <ListItem sx={{ paddingY: '3px' }}>
        <ListItemAvatar>
          <Avatar sx={{ width: '25px', height: '25px' }}>
          <MakeColor color= '#fc8403' />
          </Avatar>
        </ListItemAvatar>
        <ListItemText primary= {'Route name: ' + route_name[2]} />
      </ListItem>
      <Divider variant="inset" component="li" />
      <ListItem sx={{ paddingY: '3px' }}>
        <ListItemAvatar>
          <Avatar sx={{ width: '25px', height: '25px' }}>
          <MakeColor color= '#ffff66' />
          </Avatar>
        </ListItemAvatar>
        <ListItemText primary= {'Route name: ' + route_name[3]} />
      </ListItem>
      <Divider variant="inset" component="li" />
      <ListItem sx={{ paddingY: '3px' }}>
        <ListItemAvatar>
          <Avatar sx={{ width: '25px', height: '25px' }}>
          <MakeColor color= '#f803fc' />
          </Avatar>
        </ListItemAvatar>
        <ListItemText primary= {'Route name: ' + route_name[4]} />
      </ListItem>
    </List>
  );
}

export function BasicButtons() {
  const { loading, updateLoading } = React.useContext(dataContext);

  const handleClick = () => {
    updateLoading(!loading);
  };

  return (
    <div>
      <GlobalLoading />
      <Box sx={{ '& > button': { m: 1 } }}>
        <LoadingButton
            size="medium"
            onClick={handleClick}
            loading={false}
            loadingIndicator="Loading…"
            variant="outlined"
          >
            <span>Search</span>
          </LoadingButton>
      </Box>
    </div>

  );
}

export function AVGDelay() {
  const { rows } = React.useContext(dataContext);
  let avgDelay = 0;
  if (rows.length > 0) { rows.forEach((row) => { avgDelay += row[1] }); }
  return (
    <h3 style={{ width: "180px", textAlign: 'center', marginLeft: '60px'}}>Average delay time: { parseFloat(avgDelay / rows.length).toFixed(2) } min</h3>
  )
}

export function DialogSelect() {
  const [open, setOpen] = React.useState(false);
  const { selectedRoute, setSelectedRoute, array } = React.useContext(dataContext);

  const handleChange = (event) => {
    const route = event.target.name;
    let newSet = new Set([...selectedRoute]);
    if (selectedRoute.has(route)) newSet.delete(route);
    else newSet.add(route);
    setSelectedRoute(newSet);
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = (event, reason) => {
    if (reason !== 'backdropClick') {
      setOpen(false);
    }
  };

  const chunkArray = (arr, size) => {
    const chunkedArray = [];
    let index = 0;
    while (index < arr.length) {
      chunkedArray.push(arr.slice(index, index + size));
      index += size;
    }
    return chunkedArray;
  };
  const chunks = chunkArray(array, 6);

  const handleSelectAll = () => {
    setSelectedRoute(new Set([...array]));
  };

  const handleClearAll = () => {
    setSelectedRoute(new Set());
  };
  
  return (
    <div>
      <Button onClick={handleClickOpen}>Select Route</Button>
      <Dialog disableEscapeKeyDown open={open} onClose={handleClose}>
        <DialogTitle>Route Selection</DialogTitle>
        <DialogContent>
          
        <Stack spacing={2} direction="row">
          <Button variant="contained" size="small" onClick={handleSelectAll}>Select All</Button>
          <Button variant="contained" size="small" onClick={handleClearAll}>Clear All</Button>
        </Stack>        
        <Box sx={{ display: 'flex', marginTop: '-3%' }}>
          <FormControl sx={{ m: 3 }} component="fieldset" variant="standard">
          {/* <FormLabel component="legend">Assign responsibility</FormLabel> */}
          {chunks.map((chunk, chunkIndex) => (
          <div key={chunkIndex} style={{ display: 'flex', marginBottom: '10px' }}>
            {chunk.map((item, itemIndex) => (
              <FormGroup key={itemIndex} style={{ marginRight: '10px' }}>
                <FormControlLabel
                  control={<Checkbox checked={selectedRoute.has(item)} onChange={handleChange} name={item} />}
                  label={item}
                />
              </FormGroup>
            ))}
          </div>
          ))}
          {/* <FormHelperText>Be careful</FormHelperText> */}
          </FormControl>
        </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Ok</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export function MapPopUp(props) {
  const [open, setOpen] = React.useState(false);
  const [issues, setIssues] = React.useState(["Bus stop not clear/visible", "Inappropriate/offensive advertisements", "Insufficient seating/waiting areas", "Lack of proper lighting", "Unclean/poorly maintained facilities", "Lack of accessibility for people with disabilities", "Safety concerns", "Long waiting times", "Confusing signage/information", "Limited or unavailable amenities", "Security issues", "Poorly coordinated bus schedules", "Congestion or overcrowding", "Lack of information about route changes or disruptions", "Insufficient public transportation options", "Noise pollution", "Lack of enforcement of rules (e.g., queue-jumping, smoking)", "Limited or inconvenient parking facilities", "Other"]);
  const [checkedSentence, setCheckedSentence] = React.useState(new Set());
  const [otherText, setOtherText] = React.useState("");

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = (event, reason) => {
    if (reason !== 'backdropClick') {
      setOpen(false);
    }
  };

  const handleAddSentence = (index) => {
    setCheckedSentence(new Set([...checkedSentence, index]));
  };

  const handleTextChange = (event) => {
    setOtherText(event.target.value);
  };

  const handleSubmit = () => {
    let iss = [...checkedSentence].map(index => issues[index]).toString();
    let data = {
      route: props.route,
      name: props.stopName,
      issues: iss,
      other: otherText,
    }
    send_issue(data);
  };

  return (
    <div>
      <Button onClick={handleClickOpen}>Issue Report</Button>
      <Dialog disableEscapeKeyDown open={open} onClose={handleClose}>
        <DialogTitle>Report Bus Stop Issues: </DialogTitle>
        <DialogContent>
          <Box component="form" sx={{ display: 'flex', flexWrap: 'wrap' }}>
            <FormControl sx={{ m: 1, minWidth: 120 }}>
              {issues.map((issue, index) => {
                return (
                  <FormControlLabel key={index} control={<Checkbox checked={checkedSentence.has(index)} onClick={() => handleAddSentence(index)} />} label={issue} />
                )
              })}
            </FormControl>
          </Box>

          <Box
            sx={{
              width: 500,
              maxWidth: '100%',
            }}
          >
            <TextField fullWidth label="Other/Comment" id="fullWidth" value={otherText} onChange={handleTextChange} />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSubmit}>Submit</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export function Issue_button() {
  const [open, setOpen] = React.useState(false);
  const [issues, setIssues] = React.useState(["Delays", "Overcrowding", "Mechanical breakdowns", "Insufficient seating", "Unpredictable schedules", "Poor maintenance", "Other"]);
  const [checkedSentence, setCheckedSentence] = React.useState(new Set());
  const [otherText, setOtherText] = React.useState("");
  const [bus, setBus] = React.useState('');
  const [allBus, SetAllBus] = React.useState(["MMO", "MMI", "CGABLE", "1", "10", "101", "102", "104", "105", "107", "108", "11", "110", "112", "113", "115", "119", "12", "120", "132", "135", "136", "137", "150", "155", "16", "17", "183", "19", "2", "200", "202", "204", "207", "208", "21", "210", "211", "212", "217", "22", "238", "24", "241", "246", "248", "252", "254", "267", "27", "272", "277", "286", "287", "288", "29", "297", "3", "301", "302", "31", "32", "33", "338", "34", "344", "35", "36", "37", "38", "40", "42", "46", "500", "51", "52", "54", "56", "57", "62", "7", "71", "72", "73", "75", "77", "79", "8", "82", "836", "87", "88", "9", "93", "95", "99", "RAIL", "837", "2300"]);
  const [problems, setProblems] = React.useState([]);

  const handleChange = (event) => {
    setBus(event.target.value);
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = (event, reason) => {
    if (reason !== 'backdropClick') {
      setOpen(false);
    }
  };

  const handleSentenceChange = (index) => {
    if (checkedSentence.has(index)) {
      checkedSentence.delete(index);
      setCheckedSentence(new Set([...checkedSentence]));
    } else {
      setCheckedSentence(new Set([...checkedSentence, index]));
    }
  };

  const handleTextChange = (event) => {
    setOtherText(event.target.value);
  };

  const handleSubmit = () => {
    let iss = [...checkedSentence].map(index => issues[index]).toString();
    let data = {
      route: bus,
      name: 'null',
      issues: iss,
      other: otherText,
    }
    send_issue(data);
  };

  const columns = [
    { id: 'route', label: 'route', minWidth: 40 },
    {
      id: 'issues',
      label: 'issues',
      minWidth: 170,
      align: 'right',
      format: (value) => value.toLocaleString('en-US'),
    },
    {
      id: 'other',
      label: 'other',
      minWidth: 170,
      align: 'right',
      format: (value) => value.toLocaleString('en-US'),
    },
  ];

  function createData(route, issues, other) {
    return { route, issues, other};
  }

  React.useEffect(() => {
    async function getIssue() {
      let res = await get_issue();
      console.log(res);
      setProblems(res);
    }
    getIssue();
  }, []);

  return (
    <div>
      <Button variant="contained" style={{ width: "100%" }} onClick={handleClickOpen}>Issue Report Database</Button>
      <Dialog disableEscapeKeyDown open={open} onClose={handleClose}>
        <DialogTitle>Issues: </DialogTitle>
        <DialogContent>
          <h3>Report issue by route: </h3>

          <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
            <InputLabel id="demo-select-small-label">Route</InputLabel>
            <Select
              labelId="demo-select-small-label"
              id="demo-select-small"
              value={bus}
              label="Bus"
              onChange={handleChange}
            >
              {allBus.map( name => (<MenuItem value={name}>{name}</MenuItem>))}
            </Select>
          </FormControl>

          <Box component="form" sx={{ display: 'flex', flexWrap: 'wrap' }}>
            <FormControl sx={{ m: 1, minWidth: 120 }}>
              {issues.map((issue, index) => {
                return (
                  <FormControlLabel key={index} control={<Checkbox checked={checkedSentence.has(index)} onClick={() => handleSentenceChange(index)} />} label={issue} />
                )
              })}
            </FormControl>
          </Box>

          <Box
            sx={{
              width: 500,
              maxWidth: '100%',
            }}
          >
            <TextField fullWidth label="Other/Comment" id="fullWidth" value={otherText} onChange={handleTextChange} />
          </Box>

          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button onClick={handleSubmit}>Submit</Button>
          </DialogActions>

          <h3>Reported Issues: </h3>

          <TableContainer component={Paper}>
            <Table sx={{ maxWidth: 500 }} size={'small'} padding='normal' aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell align="left">RouteID</TableCell>
                  <TableCell align="right">Issues</TableCell>
                  <TableCell align="right">Other</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {problems.map((problem, index) => (
                  <TableRow
                    key={index}
                    sx={{ '&:last-child td, &:last-child th': { border: 0 }}}
                  >
                    <TableCell align="right">{problem[0]}</TableCell>
                    <TableCell align="right">{problem[1]}</TableCell>
                    <TableCell align="right">{problem[2]}</TableCell>

                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

        </DialogContent>
      </Dialog>
    </div>
  )
}
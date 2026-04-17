import Alert from '@mui/joy/Alert';


export default function GameAlert({roundMessage}) {
return (
     <Alert variant='outlined' 
          //need to actually assign different colors for alerts
          color={roundMessage.type === 'draw' ? 'warning' : 'success'}
          sx={{ mb: 2, backgroundColor: 'transparent', width: 'fit-content', margin: '0 auto', marginBottom: '15px !important'}}
        >
          {roundMessage.text}
      </Alert>
  );
}
	
import Button from '@mui/joy/Button'
import Card from '@mui/joy/Card'
import CardActions from '@mui/joy/CardActions'
import CardContent from '@mui/joy/CardContent'


const Cards = ({id,login, url,  correction_point, wallet, pool_month, pool_year, onPlayStat}) => {
 const handleClick = (statName) => {
    if (onPlayStat) {
      onPlayStat(statName);
    }
  };
  return (
    <Card size="sm" variant="outlined" sx={{ width: 200, bgcolor: 'transparent'}}>
      <CardContent orientation='horizontal' sx={{placeContent: "space-between"}} >
        <h3 style={{ margin: ' 0px'  }}>{login}</h3> 
        <h4 style={{ margin: ' 0px' }}> {id}</h4>
      </CardContent>
      <CardContent>
        <img src={url} alt={login} style={{ width: '100%', height: '175px', objectFit: 'cover', borderRadius: '4px' }} />
          <CardActions orientation='vertical' >
       
            <Button variant='outlined' size='sm' onClick={() => handleClick('wallet')}><strong>Wallet:</strong> {wallet}</Button>
            <Button variant='outlined' size='sm'onClick={() => handleClick('pool_year')} ><strong>Pool year: </strong> {pool_month} <span> {pool_year} </span></Button>
            <Button  variant='outlined' size='sm' onClick={() => handleClick('correction_point')}><strong>correction_point: </strong> {correction_point}</Button>
   
          </CardActions>
      </CardContent>
    </Card>
  );
  
};


export default Cards;
import Button from '@mui/joy/Button'
import Card from '@mui/joy/Card'
import CardActions from '@mui/joy/CardActions'
import CardContent from '@mui/joy/CardContent'
import defaultAvatar from '../../Image/loginSmall.png';


const UserCard = ({id,login, url, games_won}) => {
 /* const handleClick = (statName) => {
    if (onPlayStat) {
      onPlayStat(statName);
    }
  }; */
  return (
    <Card size="sm" variant="outlined" color='primary' sx={{ width: 200, bgcolor: 'transparent'}}>
     
      <CardContent orientation='horizontal' sx={{placeContent: "space-between"}} >
        <h3 style={{ margin: ' 0px'  }}>{login}</h3> 
        <h4 style={{ margin: ' 0px' }}> {id}</h4>
      </CardContent>
      <CardContent>
       <img 
        src={url || defaultAvatar}
        alt={login} 
        style={{ width: '100%', height: '175px', objectFit: 'cover', borderRadius: '4px' }}/>
          <CardActions orientation='vertical' >
       
            <Button variant='outlined' size='sm'sx={{placeContent: "space-between"}}  ><strong>games_won: </strong> {games_won}  </Button>
            <Button variant='outlined' size='sm' sx={{placeContent: "space-between"}}><strong>edit profile</strong></Button>
            <Button  variant='outlined' size='sm' sx={{placeContent: "space-between"}} ><strong>logout </strong> </Button>
   
           {/*  <Button variant='outlined' size='sm' sx={{placeContent: "space-between"}} onClick={() => handleClick('wallet')}><strong>Wallet:</strong> {wallet}</Button>
            <Button variant='outlined' size='sm'sx={{placeContent: "space-between"}} onClick={() => handleClick('startDate')} ><strong>Pool date: </strong> {pool_month}  {pool_year} </Button>
            <Button  variant='outlined' size='sm' sx={{placeContent: "space-between"}} onClick={() => handleClick('correction_point')}><strong>correction_point: </strong> {correction_point}</Button>
    */}
          </CardActions>
        </CardContent>
      
      </Card>
  );
  
};


export default UserCard;
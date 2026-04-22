import Card from '@mui/joy/Card';
import CardContent from '@mui/joy/CardContent';
import CardActions from '@mui/joy/CardActions';
import Button from '@mui/joy/Button';

// Hardcoded test user — replace with real auth later
const TEST_USER = {
  id: 1,
  login: 'jdoe',
  displayname: 'Jane Doe',
  image: {
    versions: {
      small: ''
    }
  },
  correction_point: 8,
  wallet: 420,
  pool_month: 'september',
  pool_year: '2021'
};

const ProfileCard = ({ onLogout }) => {
  const user = TEST_USER;

  return (
    <Card
      variant="outlined"
      color="primary"
      sx={{
        width: 220,
        bgcolor: 'transparent',
        transition: 'box-shadow 0.2s',
        '&:hover': { boxShadow: 'md' }
      }}
    >
      <CardContent orientation='horizontal' sx={{placeContent: "space-between"}} >
        <h3 style={{ margin: ' 0px'  }}>{user.login}</h3> 
        <h4 style={{ margin: ' 0px' }}> {user.id}</h4>
      </CardContent>
      <CardContent>
        <img src={user.image.versions.small} alt={user.login} style={{ width: '100%', height: '175px', objectFit: 'cover', border: '1px solid var(--joy-palette-primary-300)', borderRadius: '4px' }} />
          <CardActions orientation='vertical' >
       
            <Button variant='outlined' size='sm'sx={{placeContent: "space-between"}}  ><strong>games won: </strong>   </Button>
            <Button variant='outlined' size='sm' sx={{placeContent: "space-between"}} onClick={() => alert('editprofile — coming soon')}
        ><strong>edit profile</strong></Button>
            <Button  variant='outlined' color="danger" size='sm' sx={{placeContent: "space-between"}}  onClick={onLogout} ><strong> ↩ Logout</strong> </Button>
   
        
          </CardActions>
        </CardContent>
    </Card>
  );
};

export { TEST_USER };
export default ProfileCard;
import Card from '@mui/joy/Card';
import CardContent from '@mui/joy/CardContent';
import CardActions from '@mui/joy/CardActions';
import Button from '@mui/joy/Button';
import axios from 'axios';

const ProfileCard = ({ user, onLogout }) => {
  const handleLogout = async () => {
    try {
      await axios.post('/auth/logout', {}, { withCredentials: true });
    } catch (e) {}
    onLogout();
  };

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
      <CardContent orientation="horizontal" sx={{ placeContent: 'space-between' }}>
        <h3 style={{ margin: '0px' }}>{user.login}</h3>
        <h4 style={{ margin: '0px' }}>#{user.id}</h4>
      </CardContent>
      <CardContent>
        {user.avatar && (
          <img
            src={user.avatar}
            alt={user.login}
            style={{ width: '100%', height: '175px', objectFit: 'cover', border: '1px solid var(--joy-palette-primary-300)', borderRadius: '4px' }}
          />
        )}
        <CardActions orientation="vertical">
          <Button variant="outlined" size="sm" sx={{ placeContent: 'space-between' }}>
            <strong>games won: {user.wins ?? 0}</strong>
          </Button>
          <Button variant="outlined" size="sm" sx={{ placeContent: 'space-between' }} onClick={() => alert('edit profile — coming soon')}>
            <strong>edit profile</strong>
          </Button>
          <Button variant="outlined" color="danger" size="sm" sx={{ placeContent: 'space-between' }} onClick={handleLogout}>
            <strong>↩ Logout</strong>
          </Button>
        </CardActions>
      </CardContent>
    </Card>
  );
};

export default ProfileCard;
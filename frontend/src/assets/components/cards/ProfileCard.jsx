import { useState } from 'react';
import Card from '@mui/joy/Card';
import CardContent from '@mui/joy/CardContent';
import CardActions from '@mui/joy/CardActions';
import Button from '@mui/joy/Button';
import Input from '@mui/joy/Input';
import axios from 'axios';
import defaultAvatar from '../../Image/loginSmall.png';

const ProfileCard = ({ user, onLogout, onUpdate }) => {
  const [editing, setEditing] = useState(false);
  const [newLogin, setNewLogin] = useState(user.login);
  const [error, setError] = useState(null);
 

  const handleLogout = async () => {
    try {
      await axios.post('/auth/logout', {}, { withCredentials: true });
    } catch (e) {}
    onLogout();
  };

  const handleSave = async () => {
    setError(null);
    if (!newLogin || newLogin === user.login) {
      setEditing(false);
      return;
    }
    const regex = /^[a-zA-Z][a-zA-Z0-9]{0,8}$/;

    if (!regex.test(newLogin)) {
      alert("the login must start by a letter and be <= 9 chars");
      return;
    }
    try {
      const res = await axios.put('/api/users/login', {
        currentLogin: user.login,
        newLogin
      }, { withCredentials: true });

      if (res.data.success) {
        onUpdate({ ...user, login: newLogin });
        setEditing(false);
      }

    } catch (err) {
      setError('Login already taken');

    } 
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
        {editing ? (
          <Input
            size="sm"
            value={newLogin}
            onChange={e => setNewLogin(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter') handleSave(); if (e.key === 'Escape') setEditing(false); }}
            autoFocus
            sx={{ width: '100%' }}
          />
        ) : (
          <h3 style={{ margin: '0px' }}>{user.login}</h3>
        )}
        <h4 style={{ margin: '0px' }}>#{user.id}</h4>
      </CardContent>
      <CardContent>
      <img
        src={user.avatar || defaultAvatar}
        alt={user.login}
        style={{ width: '100%', height: '175px', objectFit: 'cover', border: '1px solid var(--joy-palette-primary-300)', borderRadius: '4px' }}
      />
        {error && <p style={{ color: 'red', fontSize: '0.8rem', margin: '4px 0' }}>{error}</p>}
        <CardActions orientation="vertical">
          <Button variant="outlined" size="sm" sx={{ placeContent: 'space-between' }}>
            <strong>games won: {user.wins ?? 0}</strong>
          </Button>
          {editing ? (
            <Button variant="solid" color="primary" size="sm" onClick={handleSave}>
              <strong>save</strong>
            </Button>
          ) : (
            <Button variant="outlined" size="sm" sx={{ placeContent: 'space-between' }} onClick={() => { setNewLogin(user.login); setEditing(true); }}>
              <strong>edit profile</strong>
            </Button>
          )}
          <Button variant="outlined" color="danger" size="sm" sx={{ placeContent: 'space-between' }} onClick={handleLogout}>
            <strong>↩ Logout</strong>
          </Button>
        </CardActions>
      </CardContent>
    </Card>
  );
};

export default ProfileCard;
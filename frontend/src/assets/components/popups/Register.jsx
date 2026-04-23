import { useState } from 'react';
import axios from 'axios';
import Input from '@mui/joy/Input';
import FormControl from '@mui/joy/FormControl';
import FormHelperText from '@mui/joy/FormHelperText';
import FormLabel from '@mui/joy/FormLabel';
import Typography from '@mui/joy/Typography';
import Button from '@mui/joy/Button';
import Stack from '@mui/joy/Stack';
import Modal from '@mui/joy/Modal';
import ModalDialog from '@mui/joy/ModalDialog';
import ModalClose from '@mui/joy/ModalClose';
import Tabs from '@mui/joy/Tabs';
import TabList from '@mui/joy/TabList';
import Tab from '@mui/joy/Tab';
import TabPanel from '@mui/joy/TabPanel';

export default function Register({ showPopUp, closePopUp, title, onLoginSuccess }) {
  const [tab, setTab] = useState(0);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  // Register form state
  const [regLogin, setRegLogin] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regRepeat, setRegRepeat] = useState('');

  // Login form state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  const handleRegister = async (e) => {
    e.preventDefault();
    setError(null);

    if (regPassword.length < 8)
      return setError('Password must be at least 8 characters');
    if (!/\d/.test(regPassword))
      return setError('Password must contain at least one number');
    if (!/[^a-zA-Z0-9]/.test(regPassword))
      return setError('Password must contain at least one symbol');
    if (regPassword !== regRepeat)
      return setError('Passwords do not match');

    setLoading(true);
    try {
      await axios.post('/auth/register', {
        login: regLogin,
        email: regEmail,
        password: regPassword
      });
      // Auto login after register
      const res = await axios.post('/auth/login', {
        email: regEmail,
        password: regPassword
      }, { withCredentials: true });
      onLoginSuccess(res.data.user);
      closePopUp();
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await axios.post('/auth/login', {
        email: loginEmail,
        password: loginPassword
      }, { withCredentials: true });
      onLoginSuccess(res.data.user);
      closePopUp();
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  if (!showPopUp) return null;

  return (
    <Modal
      open={showPopUp}
      onClose={closePopUp}
      sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
    >
      <ModalDialog variant="soft" sx={{ minWidth: 340 }}>
        <ModalClose />
        <Typography color="primary" level="h3">{title}</Typography>

        <Tabs value={tab} onChange={(_, v) => { setTab(v); setError(null); }}>
          <TabList>
            <Tab>Login</Tab>
            <Tab>Register</Tab>
          </TabList>

          {/* LOGIN */}
          <TabPanel value={0}>
            <form onSubmit={handleLogin}>
              <Stack direction="column" spacing={1.5}>
                <FormControl>
                  <FormLabel>Email</FormLabel>
                  <Input type="email" required value={loginEmail} onChange={e => setLoginEmail(e.target.value)} />
                </FormControl>
                <FormControl>
                  <FormLabel>Password</FormLabel>
                  <Input type="password" required value={loginPassword} onChange={e => setLoginPassword(e.target.value)} />
                </FormControl>
                {error && <Typography color="danger" level="body-sm">{error}</Typography>}
                <Button type="submit" variant="solid" loading={loading}>Login</Button>
                <Button
                  variant="outlined"
                  color="neutral"
                  onClick={() => window.location.href = '/auth/login'}
                >
                  Login with 42
                </Button>
              </Stack>
            </form>
          </TabPanel>

          {/* REGISTER */}
          <TabPanel value={1}>
            <form onSubmit={handleRegister}>
              <Stack direction="column" spacing={1.5}>
                <FormControl>
                  <FormLabel>Username</FormLabel>
                  <Input type="text" required value={regLogin} onChange={e => setRegLogin(e.target.value)} />
                </FormControl>
                <FormControl>
                  <FormLabel>Email</FormLabel>
                  <Input type="email" placeholder="example@42.fr" required value={regEmail} onChange={e => setRegEmail(e.target.value)} />
                </FormControl>
                <FormControl>
                  <FormLabel>Password</FormLabel>
                  <Input type="password" required value={regPassword} onChange={e => setRegPassword(e.target.value)} />
                  <FormHelperText>Min 8 characters, one number, one symbol</FormHelperText>
                </FormControl>
                <FormControl>
                  <FormLabel>Repeat password</FormLabel>
                  <Input type="password" required value={regRepeat} onChange={e => setRegRepeat(e.target.value)} />
                </FormControl>
                {error && <Typography color="danger" level="body-sm">{error}</Typography>}
                <Button type="submit" variant="solid" loading={loading}>Sign up</Button>
              </Stack>
            </form>
          </TabPanel>
        </Tabs>
      </ModalDialog>
    </Modal>
  );
}
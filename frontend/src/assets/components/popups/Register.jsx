import Input from '@mui/joy/Input';
import FormControl from '@mui/joy/FormControl';
import FormHelperText from '@mui/joy/FormHelperText';
import FormLabel from '@mui/joy/FormLabel';
import Typography from '@mui/joy/Typography';
import Button from '@mui/joy/Button';
import Stack from '@mui/joy/Stack';

import Modal from '@mui/joy/Modal';
import ModalDialog from '@mui/joy/ModalDialog';
import ModalClose from '@mui/joy/ModalClose'

//functions needed
	// -> check if username is already in use
	// -> check if email is valid / or already in use
	// -> check if new password fullfills the criteria
	// -> check if the repeat password is identical to new password
	// -> create new user with the given inputs and open 2.0 Auth verification.
function handleSubmit(e) {
    e.preventDefault();
    alert();
  }
export default function Register({showPopUp, closePopUp, title}){
	if (!showPopUp) {return null}
	return (
		<Modal
		variant="outlined"
		aria-labelledby="Game setup"
        aria-describedby="A form to configure a game"
        open={showPopUp}
        onClose={closePopUp}
        sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}	
      	>	 
		<ModalDialog variant='soft'>
			<ModalClose />
				<form  onSubmit={handleSubmit} >
					<Typography color='primary' level='h3'> {title}</Typography>
					<Stack direction="column" spacing={1.5}>
						<FormControl>
							<FormLabel>username</FormLabel>
							<Input size="md"   type="text" required/>
						</FormControl>
						<FormControl>
							<FormLabel>email</FormLabel>
							<Input size="sm"  type="email" placeholder="example@42.fr" required/>	
						</FormControl>
						<FormControl>
							<FormLabel>password</FormLabel>
							<Input name="password" type="password" placeholder="new password"/>
							<FormHelperText>password must contain 8 character, one number and a symbol</FormHelperText>
						</FormControl>
						<FormControl>
							<FormLabel>repeat password</FormLabel>
							<Input id="password-repeat" type="password" placeholder="repeat password"/>
						</FormControl>
						<Button sx={{marginTop: '15px'}} type="submit" variant="solid" > Sign up</Button>
					</Stack>
				</form>
			</ModalDialog>
		</Modal>
		)
}

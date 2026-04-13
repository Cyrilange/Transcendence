import Button from '@mui/joy/Button'
import Stack from '@mui/joy/Stack'


const Card = ({login, url,  correction_point, wallet, pool_month, pool_year}) => {
 return (
    <div  style={{ border: '1px solid #ccc', borderRadius: '8px', padding: '16px', width: '200px' }}>
      <h3 style={{ margin: '10px 0' }}>{login}</h3>
      <img src={url} alt={login} style={{ width: '100%', height: '175px', objectFit: 'cover', borderRadius: '4px' }} />
      <Stack direction='column' gap={1}>
     
        <Button variant='outlined' size='sm' value={wallet}><strong>Wallet:</strong> {wallet}</Button>
        <Button variant='outlined' size='sm'><strong>Pool year: </strong> {pool_month} <span> {pool_year} </span></Button>
        <Button  variant='outlined' size='sm' value={correction_point}><strong>correction_point: </strong> {correction_point}</Button>
    
      </Stack>
    </div>
  );
  
};


export default Card;
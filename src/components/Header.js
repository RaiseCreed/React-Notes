import {AppBar, Toolbar, Typography, IconButton} from '@mui/material'
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
export default function Header({children,onClick}){
    return (
        <AppBar position='static' sx={{
            backgroundColor:'#7A3536',
            width:'1251px',
            height:'107px',
            justifyContent:'center',
            alignItems:'center',
            borderTopLeftRadius: 25,
            borderTopRightRadius: 25
        }}>
            <Toolbar>
                <Typography sx={{
                    fontSize:'48px',
                    fontFamily:'RocknRoll One'
                }}>
                    {children}
                </Typography>
                <IconButton size="medium" sx={{marginLeft:'15px'}} onClick={onClick}>
                    <AddCircleOutlineIcon sx={{fontSize:'40px', color:'white'}}/>
                </IconButton>
            </Toolbar>
        </AppBar>
    )
}
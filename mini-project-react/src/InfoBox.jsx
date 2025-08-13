import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import "./InfoBox.css"
import SunnyIcon from '@mui/icons-material/Sunny';
import AcUnitIcon from '@mui/icons-material/AcUnit';
import ThunderstormIcon from '@mui/icons-material/Thunderstorm'; 

export default function InfoBox({info}) {
    let init_img = "https://plus.unsplash.com/premium_photo-1675824629278-e072280ea44f?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTN8fGhhemUlMjB3ZWF0aGVyfGVufDB8fDB8fHww"
    let HOT_URL="https://images.unsplash.com/photo-1504370805625-d32c54b16100?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8aG90JTIwd2VhdGhlcnxlbnwwfHwwfHx8MA%3D%3D"
    let COLD_URL="https://images.unsplash.com/photo-1631315124498-41ebb8b10ede?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjN8fENPTEQlMjB3ZWF0aGVyfGVufDB8fDB8fHww"
    let RAIN_URL="https://images.unsplash.com/photo-1688488615397-726ae4a5c755?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NDR8fFJBSU4lMjBXRUFUSEVSfGVufDB8fDB8fHww"
    return (
        <div className="InfoBox">
        <div className="card-contaner">
            <Card sx={{ maxWidth: 345 }}>
                <CardMedia
                    sx={{ height: 140 }}
                    image={info.humidity>80 ? RAIN_URL: info.temp>15? HOT_URL:COLD_URL}
                    title="green iguana"
                />
                <CardContent>
                    <Typography gutterBottom variant="h5" component="div">
                        {info.city}
                        {info.humidity>80 ? <ThunderstormIcon/>: info.temp>15? <SunnyIcon/> : <AcUnitIcon/>}
                    </Typography>
                    <Typography variant="body2" component={"span"} sx={{ color: 'text.secondary' }}>
                       <div>Temperature={info.temp}&deg;C</div>
                       <div>Humidity={info.humidity}</div>
                       <p>Min Temp={info.tempMin}</p>
                       <p>MAx Temp={info.tempMax}</p>
                       <p>The weather can be described as <i>{info.weather}</i> and feels like {info.feelsike}&deg;C</p>
                    </Typography>
                </CardContent>
                
            </Card>
        </div>
            
        </div>
    )
}
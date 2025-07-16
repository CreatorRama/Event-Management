import  express from 'express'
import  cors from 'cors'
import  helmet from 'helmet'
import  rateLimit from 'express-rate-limit'
import userRoutes from './routes/users.js'
import eventRoutes from './routes/Events.js'
import errorHandler from './middleware/errorHandler.js'
import dotenv from 'dotenv'

dotenv.config();

const  app = express();
const   PORT = process.env.PORT || 5000;


app.use(helmet());
app.use(cors());


const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 100 
});
app.use(limiter);


app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));


app.use('/api/events', eventRoutes);
app.use('/api/users', userRoutes);

app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});


app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Not Found',
    message: 'The requested resource was not found'
  });
});


app.use(errorHandler);


app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});


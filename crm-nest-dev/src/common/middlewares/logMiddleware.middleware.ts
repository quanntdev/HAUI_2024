import { JwtService } from "@nestjs/jwt";
import * as moment from 'moment';
import { LOGS_FOLDER } from "src/constants";
const fs = require('fs');
import * as path from 'path';

export const LogMiddleware = () => (req, res, next) => {
  const service = new JwtService();
  const token  = req?.headers?.authorization?.replace('Bearer ', '') || req.query.token
  const user = service.decode(token)
  const userId = user?.['sub']|| null
  const time = moment().format('HH:mm:ss')

  const clientIP = req.headers['x-forwarded-for'] ||
  req.connection.remoteAddress ||
  req.socket.remoteAddress ||
  req.connection.socket.remoteAddress;

  const router = req.baseUrl;
  const method = req.method;
  const diskStorage = `./${LOGS_FOLDER}`;
  if (!fs.existsSync(diskStorage)) {
    fs.mkdirSync(diskStorage, { recursive: true });
  }

  const today = moment().format('YYYY-MM-DD')

  const logFileName = `access-${today}.log`;


  const logFilePath = path.join(diskStorage, logFileName);
  if (!fs.existsSync(logFilePath)) {
    fs.writeFileSync(logFilePath, '');
  }

  const logContent = `${time},${clientIP},${method},${router},${userId}\n`;
  fs.appendFileSync(logFilePath, logContent);
  next();
};

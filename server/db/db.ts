import mysql from "mysql2/promise";

type ConnectionOptions = mysql.ConnectionOptions;

const access: ConnectionOptions = {
  host: "localhost",
  user: "root",
  password: "",
  database: "attendance_tracking_system",
};

const connection = await mysql.createConnection(access);

export default connection;

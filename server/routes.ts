import express from "express";
import connection from "./db.ts";

const router = express.Router();

router.get("/", (req, res) => {
  res.json("Hello!");
});

router.post("/attendance-records", async (req, res) => {
  const { username }: { username: string } = req.body;

  try {
    const today = new Date();

    const sql = `INSERT INTO attendance_records(username, date, time_in) VALUES (?, ?, ?)`;
    const values = [username, today, today];

    const [result] = await connection.execute(sql, values);

    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Database error" });
  }
});

router.patch("/attendance-records", async (req, res) => {
  const { username }: { username: string } = req.body;

  try {
    const today = new Date();

    const sql = `
    UPDATE attendance_records
    SET time_out = ?
    WHERE LOWER(username) = ?`;
    const values = [today, username];

    const [result] = await connection.execute(sql, values);

    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Database error" });
  }
});

export default router;

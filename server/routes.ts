import express from "express";
import connection from "./db.ts";

const router = express.Router();

router.get("/", (req, res) => {
  res.json("Hello!");
});

router.get("/attendance-records", async (req, res) => {
  const {
    name = "",
    date = "",
    page = "1",
    limit = "5",
  } = req.query as {
    name?: string;
    date?: string;
    page?: string;
    limit?: string;
  };

  const pageNum = Number(page);
  const limitNum = Number(limit);
  const offset = pageNum - 1 > 0 ? Math.ceil((pageNum - 1) * limitNum) : 0;

  try {
    let sql = `SELECT * FROM attendance_records WHERE LOWER(username) LIKE LOWER(?)`;

    const values: (string | number)[] = [`%${name}%`];

    if (date) {
      sql += ` AND date = ?`;
      values.push(date);
    }

    sql += ` LIMIT ${limitNum} OFFSET ${offset}`;

    const [rows] = await connection.execute(sql, values);

    const [countRow] = await connection.query(
      "SELECT COUNT(id) as totalRows FROM attendance_records"
    );

    const totalRows =
      Array.isArray(countRow) && countRow.length > 0
        ? (countRow[0] as { totalRows: number }).totalRows
        : 0;

    const totalPage = Math.ceil(totalRows / limitNum);

    const data = {
      rows,
      totalPage,
    };

    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Database error" });
  }
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

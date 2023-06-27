import {readFile} from "fs/promises";
import {Pool} from "pg";
import * as XLSX from "xlsx";
import path from "path";
import {UserType} from "./constants/enum";
// console.log("Hello form the top of the world!");
const filePath = path.join(__dirname, "../data2", "Platinum and directors(updated).xlsx");

export async function importUserData(filePath: string): Promise<void> {
  try {
    const fileData = await readFile(filePath);
    const workbook = XLSX.read(fileData, {type: "buffer"});
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];
    const jsonData = parseWorksheet(worksheet);

    const pool = new Pool({
      user: "postgres",
      password: "postgres",
      host: "minineotest.nupipay.com",

      database: "auth_boilerplate",
      port: 5432,
    });

    const client = await pool.connect();

    try {
      await client.query("BEGIN");

      for (const row of jsonData) {
        // console.log(row["Email. ID"]);
        const phone = row["Phone No"]?.toString().trim();
        const club = row["Club"].trim();
        const userType = club == "PLATINUM CLUB" ? UserType.PLATINIUM : UserType.DIRECTOR;

        await client.query(
          "INSERT INTO user2 (party, phone, email, points, pay_off, user_type) VALUES ($1, $2, $3, $4, $5, $6)",
          [
            row.Party,
            row["Phone No"]?.toString().trim() || row["Phone No"],
            row["Email. ID"],
            row.Points,
            row.Payoff,
            userType,
          ]
        );
      }

      await client.query("COMMIT");

      console.log("Data imported successfully!");
    } catch (error) {
      await client.query("ROLLBACK");
      console.error("Error importing data:", error);
    } finally {
      client.release();
      pool.end();
    }
  } catch (error: any) {
    if (error.code == 23505) console.log("Data already exists!, Skipping db import...");
    console.error("Error reading file:", error);
  }
}

function parseWorksheet(worksheet: XLSX.WorkSheet): any[] {
  const jsonData = XLSX.utils.sheet_to_json(worksheet, {header: 1});

  const headerRow = jsonData[0] as any;
  const dataRows = jsonData.slice(1) as any[];

  return dataRows.map((row: any) => {
    const rowData: any = {};

    for (let i = 0; i < headerRow.length; i++) {
      const header = headerRow[i];
      const value = row[i];

      rowData[header] = value;
    }

    return rowData;
  });
}

// importUserData("data/Platinum and directors.xlsx");

importUserData(filePath);

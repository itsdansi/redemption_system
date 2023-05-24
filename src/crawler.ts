// import {readFile} from "fs/promises";
// import {Pool} from "pg";
// // import {read} from "xlsx";

// import * as XLSX from "xlsx";
// import path from "path";
// import {User2} from "./entity/user2.entity";
// import {getRepository} from "typeorm";
// // const filePath = path.join(__dirname, "data", "Platinum and directors.xlsx");
// const filePath = path.join(__dirname, "../data2", "Platinum and directors.xlsx");

// export async function importUserData(filePath: string): Promise<void> {
//   try {
//     const fileData = await readFile(filePath);
//     const workbook = XLSX.read(fileData, {type: "buffer"});
//     const worksheet = workbook.Sheets[workbook.SheetNames[0]];
//     const jsonData = parseWorksheet(worksheet);

//     // console.log(jsonData);

//     const pool = new Pool({
//       user: "postgres",
//       password: "holaespanol",
//       host: "localhost",
//       database: "auth_boilerplate",
//       port: 5432,
//     });

//     const client = await pool.connect();

//     try {
//       // const user = await getRepository(User2).count();

//       // if (user !== 0) {
//       //   console.log("Data already exists. Skipping import.");
//       //   throw new Error("Data already exists. Skipping import...");
//       // }

//       await client.query("BEGIN");

//       for (const row of jsonData) {
//         // Transform the row data if needed

//         // Insert the transformed data into the 'users' table
//         await client.query(
//           "INSERT INTO user2 (id, party, phone, email, points, pay_off, created_at) VALUES ($1, $2, $3, $4, $5, $6, $7)",
//           [
//             row.ID,
//             row.Party,
//             row["Phone No"]?.toString().trim() || row["Phone No"],
//             row["Email. ID"],
//             row.Points,
//             row.Payoff,
//             // Date.now(),
//           ]
//         );
//       }

//       await client.query("COMMIT");
//       console.log("Data imported successfully!");
//     } catch (error) {
//       await client.query("ROLLBACK");
//       // console.error("Error importing data:", error);
//     } finally {
//       client.release();
//       pool.end();
//     }
//   } catch (error) {
//     console.error("Error reading file:", error);
//   }
// }

// function parseWorksheet(worksheet: XLSX.WorkSheet): any[] {
//   const jsonData = XLSX.utils.sheet_to_json(worksheet, {header: 1});

//   const headerRow = jsonData[0] as any;
//   const dataRows = jsonData.slice(1) as any[];

//   return dataRows.map((row: any) => {
//     const rowData: any = {};

//     for (let i = 0; i < headerRow.length; i++) {
//       const header = headerRow[i];
//       const value = row[i];

//       rowData[header] = value;
//     }

//     return rowData;
//   });
// }

// // importUserData("data/Platinum and directors.xlsx");

// importUserData(filePath);

import {readFile} from "fs/promises";
import {Pool} from "pg";
import * as XLSX from "xlsx";
import path from "path";
const filePath = path.join(__dirname, "../data2", "Platinum and directors.xlsx");

export async function importUserData(filePath: string): Promise<void> {
  try {
    console.log("You're into the logo");
    const fileData = await readFile(filePath);
    const workbook = XLSX.read(fileData, {type: "buffer"});
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];
    const jsonData = parseWorksheet(worksheet);

    const pool = new Pool({
      user: "postgres",
      password: "holaespanol",
      host: "localhost",
      database: "auth_boilerplate",
      port: 5432,
    });

    const client = await pool.connect();

    try {
      await client.query("BEGIN");

      for (const row of jsonData) {
        // Transform the phone number
        const phone = row["Phone No"]?.toString().trim();

        // Insert the transformed data into the 'users' table
        console.log(row["Email. ID"]);
        await client.query(
          "INSERT INTO user2 (id, party, phone, email, points, pay_off) VALUES ($1, $2, $3, $4, $5, $6)",
          [
            row.ID,
            row.Party,
            row["Phone No"]?.toString().trim() || row["Phone No"],
            row["Email. ID"],
            row.Points,
            row.Payoff,
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
  } catch (error) {
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

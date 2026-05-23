const http = require("http")
const fs = require("fs")
const path = require("path")
const url = require("url")
const sqlite3 = require("sqlite3").verbose()

// Initialize SQLite Database
const db = new sqlite3.Database("./users.db", (err) => {
  if (err) console.error("Database error:", err)
  else console.log("Connected to SQLite database")
})

// Create tables on startup
db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      blood_group TEXT,
      medical_condition TEXT,
      contact_number TEXT,
      doctor_name TEXT,
      allergies TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `)
})

// Create HTTP server
const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url, true)
  const pathname = parsedUrl.pathname

  // CORS headers
  res.setHeader("Access-Control-Allow-Origin", "*")
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
  res.setHeader("Access-Control-Allow-Headers", "Content-Type")

  if (req.method === "OPTIONS") {
    res.writeHead(200)
    res.end()
    return
  }

  // Serve HTML files
  if (pathname === "/" || pathname === "/login.html") {
    serveFile(res, "./eye/login.html", "text/html")
  } else if (pathname === "/emergency.html") {
    serveFile(res, "./eye/emergency.html", "text/html")
  } else if (pathname === "/database.html") {
    serveFile(res, "./eye/database.html", "text/html")
  } else if (pathname === "/index.html") {
    serveFile(res, "./eye/index.html", "text/html")
  } else if (pathname === "/game.html") {
    serveFile(res, "./eye/game.html", "text/html")
  } else if (pathname === "/phrases.html") {
    serveFile(res, "./eye/phrases.html", "text/html")
  }
  // API Routes
  else if (pathname === "/api/register" && req.method === "POST") {
    let body = ""
    req.on("data", (chunk) => (body += chunk))
    req.on("end", () => {
      const data = JSON.parse(body)
      const { username, password, blood_group, medical_condition, contact_number, doctor_name, allergies } = data

      db.run(
        `INSERT INTO users (username, password, blood_group, medical_condition, contact_number, doctor_name, allergies) 
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [username, password, blood_group, medical_condition, contact_number, doctor_name, allergies],
        function (err) {
          if (err) {
            res.writeHead(400, { "Content-Type": "application/json" })
            res.end(JSON.stringify({ success: false, message: "User already exists" }))
          } else {
            res.writeHead(200, { "Content-Type": "application/json" })
            res.end(JSON.stringify({ success: true, message: "User registered", userId: this.lastID }))
          }
        },
      )
    })
  } else if (pathname === "/api/login" && req.method === "POST") {
    let body = ""
    req.on("data", (chunk) => (body += chunk))
    req.on("end", () => {
      const { username, password } = JSON.parse(body)

      db.get(`SELECT * FROM users WHERE username = ? AND password = ?`, [username, password], (err, row) => {
        if (err || !row) {
          res.writeHead(401, { "Content-Type": "application/json" })
          res.end(JSON.stringify({ success: false, message: "Invalid credentials" }))
        } else {
          res.writeHead(200, { "Content-Type": "application/json" })
          res.end(
            JSON.stringify({
              success: true,
              user: {
                id: row.id,
                username: row.username,
                blood_group: row.blood_group,
                medical_condition: row.medical_condition,
                contact_number: row.contact_number,
                doctor_name: row.doctor_name,
                allergies: row.allergies,
              },
            }),
          )
        }
      })
    })
  } else if (pathname === "/api/user" && req.method === "GET") {
    const username = parsedUrl.query.username
    db.get(`SELECT * FROM users WHERE username = ?`, [username], (err, row) => {
      if (err || !row) {
        res.writeHead(404, { "Content-Type": "application/json" })
        res.end(JSON.stringify({ success: false }))
      } else {
        res.writeHead(200, { "Content-Type": "application/json" })
        res.end(JSON.stringify({ success: true, user: row }))
      }
    })
  } else if (pathname === "/api/users" && req.method === "GET") {
    db.all(
      `SELECT id, username, blood_group, medical_condition, contact_number, doctor_name, allergies, created_at FROM users`,
      (err, rows) => {
        if (err) {
          res.writeHead(500, { "Content-Type": "application/json" })
          res.end(JSON.stringify({ success: false }))
        } else {
          res.writeHead(200, { "Content-Type": "application/json" })
          res.end(JSON.stringify({ success: true, users: rows }))
        }
      },
    )
  } else if (pathname === "/api/delete-user" && req.method === "POST") {
    let body = ""
    req.on("data", (chunk) => (body += chunk))
    req.on("end", () => {
      const { id } = JSON.parse(body)
      db.run(`DELETE FROM users WHERE id = ?`, [id], (err) => {
        if (err) {
          res.writeHead(500, { "Content-Type": "application/json" })
          res.end(JSON.stringify({ success: false }))
        } else {
          res.writeHead(200, { "Content-Type": "application/json" })
          res.end(JSON.stringify({ success: true }))
        }
      })
    })
  } else {
    res.writeHead(404)
    res.end("Not Found")
  }
})

function serveFile(res, filePath, contentType) {
  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404)
      res.end("File not found")
    } else {
      res.writeHead(200, { "Content-Type": contentType })
      res.end(data)
    }
  })
}

server.listen(3000, () => {
  console.log("Server running at http://localhost:3000")
  console.log("Login: http://localhost:3000/login.html")
  console.log("Database: http://localhost:3000/database.html")
})

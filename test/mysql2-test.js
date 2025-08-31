import express from "express";
import mysql from "mysql2/promise";
import asyncHandler from "express-async-handler";

const app = express();
const port = 3006;

app.use(express.json());

// MySQL 연결 설정
const dbConfig = {
  host: 'localhost',
  user: 'root',
  password: '1234',
  database: 'test_db'
};

// 연결 풀 생성 (권장 방식)
const pool = mysql.createPool({
  ...dbConfig,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// 테이블 초기화
const initDatabase = async () => {
  try {
    const connection = await pool.getConnection();
    
    // 테이블 생성
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        age INT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    
    // 샘플 데이터 삽입 (중복 방지)
    await connection.execute(`
      INSERT IGNORE INTO users (name, email, age) VALUES
      ('김철수', 'kim@test.com', 25),
      ('박영희', 'park@test.com', 30),
      ('이민수', 'lee@test.com', 28)
    `);
    
    connection.release();
    console.log('데이터베이스 초기화 완료');
  } catch (error) {
    console.error('데이터베이스 초기화 오류:', error.message);
  }
};

// 서버 시작 시 DB 초기화
initDatabase();

// 모든 사용자 조회
app.get('/users', asyncHandler(async (req, res) => {
  const [rows] = await pool.execute('SELECT * FROM users ORDER BY created_at DESC');
  res.json({
    count: rows.length,
    users: rows
  });
}));

// 특정 사용자 조회
app.get('/user/:id', asyncHandler(async (req, res) => {
  const [rows] = await pool.execute('SELECT * FROM users WHERE id = ?', [req.params.id]);
  
  if (rows.length === 0) {
    return res.status(404).json({ error: '사용자를 찾을 수 없습니다' });
  }
  
  res.json(rows[0]);
}));

// 사용자 생성
app.post('/user', asyncHandler(async (req, res) => {
  const { name, email, age } = req.body;
  
  if (!name || !email) {
    return res.status(400).json({ error: '이름과 이메일은 필수입니다' });
  }
  
  const [result] = await pool.execute(
    'INSERT INTO users (name, email, age) VALUES (?, ?, ?)',
    [name, email, age]
  ).catch(error => {
    if (error.code === 'ER_DUP_ENTRY') {
      const dupError = new Error('이미 존재하는 이메일입니다');
      dupError.statusCode = 409;
      throw dupError;
    }
    throw error;
  });
  
  // 생성된 사용자 조회
  const [rows] = await pool.execute('SELECT * FROM users WHERE id = ?', [result.insertId]);
  
  res.status(201).json({
    message: '사용자 생성 성공',
    user: rows[0]
  });
}));

// 사용자 수정
app.put('/user/:id', asyncHandler(async (req, res) => {
  const { name, email, age } = req.body;
  const userId = req.params.id;
  
  // 사용자 존재 확인
  const [existingUser] = await pool.execute('SELECT id FROM users WHERE id = ?', [userId]);
  if (existingUser.length === 0) {
    const notFoundError = new Error('사용자를 찾을 수 없습니다');
    notFoundError.statusCode = 404;
    throw notFoundError;
  }
  
  await pool.execute(
    'UPDATE users SET name = ?, email = ?, age = ? WHERE id = ?',
    [name, email, age, userId]
  ).catch(error => {
    if (error.code === 'ER_DUP_ENTRY') {
      const dupError = new Error('이미 존재하는 이메일입니다');
      dupError.statusCode = 409;
      throw dupError;
    }
    throw error;
  });
  
  // 수정된 사용자 조회
  const [rows] = await pool.execute('SELECT * FROM users WHERE id = ?', [userId]);
  
  res.json({
    message: '사용자 수정 성공',
    user: rows[0]
  });
}));

// 사용자 삭제
app.delete('/user/:id', asyncHandler(async (req, res) => {
  const userId = req.params.id;
  
  const [result] = await pool.execute('DELETE FROM users WHERE id = ?', [userId]);
  
  if (result.affectedRows === 0) {
    return res.status(404).json({ error: '사용자를 찾을 수 없습니다' });
  }
  
  res.json({
    message: '사용자 삭제 성공',
    deletedId: parseInt(userId)
  });
}));

// 검색 기능
app.get('/search', asyncHandler(async (req, res) => {
  const { name, email, minAge, maxAge } = req.query;
  
  let query = 'SELECT * FROM users WHERE 1=1';
  const params = [];
  
  if (name) {
    query += ' AND name LIKE ?';
    params.push(`%${name}%`);
  }
  
  if (email) {
    query += ' AND email LIKE ?';
    params.push(`%${email}%`);
  }
  
  if (minAge) {
    query += ' AND age >= ?';
    params.push(parseInt(minAge));
  }
  
  if (maxAge) {
    query += ' AND age <= ?';
    params.push(parseInt(maxAge));
  }
  
  query += ' ORDER BY created_at DESC';
  
  const [rows] = await pool.execute(query, params);
  
  res.json({
    searchParams: req.query,
    count: rows.length,
    users: rows
  });
}));

// 통계 정보
app.get('/stats', asyncHandler(async (req, res) => {
  const [countResult] = await pool.execute('SELECT COUNT(*) as total FROM users');
  const [avgAgeResult] = await pool.execute('SELECT AVG(age) as avgAge FROM users WHERE age IS NOT NULL');
  const [minAgeResult] = await pool.execute('SELECT MIN(age) as minAge FROM users WHERE age IS NOT NULL');
  const [maxAgeResult] = await pool.execute('SELECT MAX(age) as maxAge FROM users WHERE age IS NOT NULL');
  
  res.json({
    totalUsers: countResult[0].total,
    averageAge: Math.round(avgAgeResult[0].avgAge * 100) / 100,
    minAge: minAgeResult[0].minAge,
    maxAge: maxAgeResult[0].maxAge
  });
}));

// 트랜잭션 예제
app.post('/bulk-insert', asyncHandler(async (req, res) => {
  const { users } = req.body;
  
  if (!users || !Array.isArray(users)) {
    return res.status(400).json({ error: 'users 배열이 필요합니다' });
  }
  
  const connection = await pool.getConnection();
  
  try {
    await connection.beginTransaction();
    
    const insertedUsers = [];
    for (const user of users) {
      const { name, email, age } = user;
      const [result] = await connection.execute(
        'INSERT INTO users (name, email, age) VALUES (?, ?, ?)',
        [name, email, age]
      );
      
      const [newUser] = await connection.execute('SELECT * FROM users WHERE id = ?', [result.insertId]);
      insertedUsers.push(newUser[0]);
    }
    
    await connection.commit();
    
    res.status(201).json({
      message: `${users.length}명의 사용자가 생성되었습니다`,
      users: insertedUsers
    });
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}));

// 연결 테스트
app.get('/connection-test', asyncHandler(async (req, res) => {
  const [rows] = await pool.execute('SELECT 1 + 1 AS result, NOW() AS currentTime');
  res.json({
    message: 'MySQL 연결 성공',
    testResult: rows[0]
  });
}));

// 에러 핸들러
app.use((error, req, res, next) => {
  console.error('에러 발생:', error);
  
  const statusCode = error.statusCode || error.status || 500;
  
  res.status(statusCode).json({
    error: error.message,
    code: error.code || 'UNKNOWN_ERROR',
    status: statusCode
  });
});

// 404 핸들러
app.use(asyncHandler(async (req, res) => {
  res.status(404).json({ error: '요청한 경로를 찾을 수 없습니다' });
}));

app.listen(port, () => {
  console.log(`MySQL2 테스트 서버가 http://localhost:${port} 에서 실행 중입니다.`);
  console.log("테스트 방법:");
  console.log("1. GET /connection-test - 연결 테스트");
  console.log("2. GET /users - 모든 사용자");
  console.log("3. GET /user/:id - 사용자 조회");
  console.log("4. POST /user - 사용자 생성");
  console.log("5. PUT /user/:id - 사용자 수정");
  console.log("6. DELETE /user/:id - 사용자 삭제");
  console.log("7. GET /search?name=김&minAge=20 - 검색");
  console.log("8. GET /stats - 통계");
  console.log("9. POST /bulk-insert - 대량 삽입");
});
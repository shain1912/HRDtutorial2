아래의 DB Connection 정보로 DB 연결하고 users 테이블을 조회하고 조회 결과를 출력하는 코드에 빈칸을 채우세요
const mysql = require('mysql2');  //mysql 연결 모듈을 로드합니다

// MySQL 연결 설정
const connection = mysql.createConnection({
  host: 'localhost',   // MySQL 서버 주소
  user: 'root',        // MySQL 사용자
  password: 'your_password', // MySQL 비밀번호
  database: 'testdb'   // 사용할 데이터베이스
});

// 데이터베이스 연결
connection.connect((err) => {
  if (err) {
    console.error('MySQL 연결 실패:', err);
    return;
  }
  console.log('MySQL 연결 성공!');
});

const selectQuery = 'SELECT * FROM users';
connection.query(selectQuery, (err, results) => {
  if (err) throw err;
  console.log('조회된 데이터:', results);
});

import express from 'express';

const router = express.Router();

// 연락처 데이터 구조 변경: userId, email 필드 추가
let contacts = [
  { id: 1, userId: 'gildong', email: 'hong@example.com', phone: '010-1111-1111' },
  { id: 2, userId: 'cheolsu', email: 'kim@example.com', phone: '010-2222-2222' }
];
let nextId = 3;

// GET /contacts: 모든 연락처 조회
router.get('/contacts', (req, res) => {
  res.json(contacts);
});

// GET /contacts/:id: 특정 연락처 조회
router.get('/contacts/:id', (req, res) => {
    const id = parseInt(req.params.id, 10);
    const contact = contacts.find(c => c.id === id);
    if (contact) {
        res.json(contact);
    } else {
        res.status(404).json({ message: 'Contact not found' });
    }
});

// POST /contacts: 새 연락처 추가 (필수값 검증 추가)
router.post('/contacts', (req, res) => {
  const { userId, email, phone } = req.body;

  // userId, email, phone 값이 모두 있는지 확인
  if (!userId || !email || !phone) {
    return res.status(400).json({ message: '필수값이 없습니다.' });
  }

  const newContact = {
    id: nextId++,
    userId,
    email,
    phone
  };
  contacts.push(newContact);
  console.log('새 연락처 추가:', newContact);
  res.status(201).json(newContact);
});

// PUT /contacts/:id: 연락처 업데이트
router.put('/contacts/:id', (req, res) => {
    const id = parseInt(req.params.id, 10);
    const contactIndex = contacts.findIndex(c => c.id === id);

    if (contactIndex === -1) {
        return res.status(404).json({ message: 'Contact not found' });
    }

    const originalContact = contacts[contactIndex];
    const updatedContact = {
        ...originalContact,
        ...req.body
    };
    contacts[contactIndex] = updatedContact;

    console.log('연락처 업데이트:', updatedContact);
    res.json(updatedContact);
});


// DELETE /contacts/:id: 연락처 삭제
router.delete('/contacts/:id', (req, res) => {
  const id = parseInt(req.params.id, 10);
  const initialLength = contacts.length;
  contacts = contacts.filter(c => c.id !== id);

  if (contacts.length === initialLength) {
    return res.status(404).json({ message: 'Contact not found' });
  }

  console.log('연락처 삭제:', id);
  res.status(200).json({ success: true, message: '연락처가 삭제되었습니다.' });
});

export default router;

// 404 에러 핸들러
export const notFound = (req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  error.status = 404;
  next(error);
};

// 전역 에러 핸들러
export const globalErrorHandler = (err, req, res, next) => {
  console.error('Error:', err.message);
  console.error('Stack:', err.stack);
  
  const status = err.status || 500;
  const message = err.message || 'Internal Server Error';
  
  // 웹 페이지 응답
  res.status(status).render('error', {
    title: 'Error',
    status,
    message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
};
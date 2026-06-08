function check(req, res) {
  res.status(200).json({
    success: true,
    message: '',
  });
}

export { check };

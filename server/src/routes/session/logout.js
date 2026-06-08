async function logout(req, res) {
  res.clearCookie('sessionKey');
  res.status(200).json({
    success: true,
    message: '',
  });
}

export { logout };

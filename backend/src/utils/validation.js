const validatePhoneNumber = (phoneNumber) => {
  const cleanedNumber = phoneNumber.trim();

  if (!cleanedNumber) {
    return false;
  }

  const phoneRegex = /^[\+]?[(]?[0-9]{1,4}[)]?[-\s\.]?[(]?[0-9]{1,4}[)]?[-\s\.]?[0-9]{1,5}[-\s\.]?[0-9]{1,5}$/;

  return phoneRegex.test(cleanedNumber);
};

const normalizePhoneNumber = (phoneNumber) => {
  return phoneNumber.trim().replace(/\s+/g, '');
};

module.exports = {
  validatePhoneNumber,
  normalizePhoneNumber,
};

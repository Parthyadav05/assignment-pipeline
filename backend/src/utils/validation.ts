export const validatePhoneNumber = (phoneNumber: string): boolean => {
  const cleanedNumber = phoneNumber.trim();

  if (!cleanedNumber) {
    return false;
  }

  const phoneRegex = /^[\+]?[(]?[0-9]{1,4}[)]?[-\s\.]?[(]?[0-9]{1,4}[)]?[-\s\.]?[0-9]{1,5}[-\s\.]?[0-9]{1,5}$/;

  return phoneRegex.test(cleanedNumber);
};

export const normalizePhoneNumber = (phoneNumber: string): string => {
  return phoneNumber.trim().replace(/\s+/g, '');
};

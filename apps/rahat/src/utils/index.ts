export const createExtrasAndPIIData = (beneficiary: any) => {
  if (beneficiary.coordinates) delete beneficiary.coordinates;
  const {
    name,
    phone,
    email,
    age,
    gender,
    province,
    district,
    wardNo,
    meta,
    type,
    ...rest
  } = beneficiary;
  const extras = { ...rest, province, district, wardNo, meta };
  const piiData = { name, phone, email };
  const payload = { type, age, gender, piiData, extras };
  return payload;
};

export function removeSpaces(phoneNumber: string): string {
  return phoneNumber.replace(/\s+/g, '');
}

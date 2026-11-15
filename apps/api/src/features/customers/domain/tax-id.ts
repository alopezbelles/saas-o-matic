// Rules and primary sources: specs/003-customers-api/clarifications.md (D03).
const letters = 'TRWAGMYFPDXBNJZSQVHLCKE';
export function validSpanishTaxId(input: string): boolean {
  // Reject non-ASCII before uppercase: no Unicode look-alikes folded into identifiers.
  if (!/^[A-Za-z0-9]+$/.test(input)) return false;
  const value = input.toUpperCase();
  if (/^[0-9]{8}[A-Z]$/.test(value))
    return letters[Number(value.slice(0, 8)) % 23] === value[8];
  if (/^[XYZ][0-9]{7}[A-Z]$/.test(value)) {
    return (
      letters[
        Number(String('XYZ'.indexOf(value[0]!)) + value.slice(1, 8)) % 23
      ] === value[8]
    );
  }
  // AEAT DIT pp.9-10: K/L/M have their own family; check over seven digits.
  if (/^[KLM][0-9]{7}[A-Z]$/.test(value))
    return letters[Number(value.slice(1, 8)) % 23] === value[8];
  if (!/^[ABCDEFGHJNPQRSUVW][0-9]{7}[0-9A-J]$/.test(value)) return false;
  const digits = [...value.slice(1, 8)].map(Number);
  const sum = digits.reduce((total, digit, index) => {
    const product = index % 2 === 0 ? digit * 2 : digit;
    return total + Math.floor(product / 10) + (product % 10);
  }, 0);
  const control = (10 - (sum % 10)) % 10;
  const expected = 'NPQRSW'.includes(value[0]!)
    ? 'JABCDEFGHI'[control]
    : String(control);
  return value[8] === expected;
}

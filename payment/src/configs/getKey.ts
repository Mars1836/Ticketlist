const prefix = "payment_intent_id:";
export function getKeyPayment(intentId: string): string {
  return prefix + intentId;
}
export function getIdPaymentFromKey(key: string): string {
  const str = key.replace(prefix, "");
  return str;
}

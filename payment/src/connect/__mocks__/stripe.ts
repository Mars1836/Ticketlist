export const stripe = {
  paymentIntents: {
    create: jest.fn().mockResolvedValue({}),
  },
};
// await stripe.charges.create({
//     currency: "usd",
//     amount: 50,
//     source: token,

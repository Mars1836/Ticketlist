import { ticketModel } from "../ticket.model";

it("test optimistic concurrency controll ticket update", async () => {
  const ticket = await ticketModel.create({
    price: 12,
    title: "title1",
    userId: "asd",
  });

  const ticket1 = await ticketModel.findById(ticket.id);
  const ticket2 = await ticketModel.findById(ticket.id);
  ticket1?.set({
    price: 15,
  });
  ticket2?.set({
    price: 20,
  });

  await ticket1?.save();
  const ticket3 = await ticketModel.findById(ticket.id);
  expect(ticket).toBeDefined();
  try {
    await ticket2?.save();
    throw new Error("Errror");
  } catch (error) {}
});
it("increments the version number on multiple saves", async () => {
  let ticket = await ticketModel.create({
    price: 12,
    title: "title1",
    userId: "asd",
  });
  expect(ticket).toBeDefined();
  expect(ticket!.version).toEqual(0);
  const ticket0 = await ticketModel.findById(ticket.id);
  ticket0?.set({
    price: 15,
  });
  expect(ticket0!.version).toEqual(0);
  const ticket1 = await ticket0?.save();
  expect(ticket1!.version).toEqual(1);
  ticket1?.set({
    price: 20,
  });
  const ticket2 = await ticket1?.save();
  expect(ticket2!.version).toEqual(2);
});

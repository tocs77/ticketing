import { Ticket } from '../ticket';

describe('ticket model tests', () => {
  it('implement optimictic concurrency control', async () => {
    const ticket = await Ticket.create({ title: 'concert', price: 100, userId: '123' });
    const firstInstance = await Ticket.findById(ticket.id);
    const secondInstance = await Ticket.findById(ticket.id);

    firstInstance!.price = 200;
    await firstInstance!.save();

    secondInstance!.price = 250;
    try {
      await secondInstance!.save();
    } catch (error) {
      return;
    }
    throw new Error('no optimistic control');
  });

  it('increment version number on save', async () => {
    const ticket = await Ticket.create({ title: 'concert', price: 100, userId: '123' });
    expect(ticket.version).toEqual(0);
    await ticket.save();
    expect(ticket.version).toEqual(1);
    await ticket.save();
    expect(ticket.version).toEqual(2);
  });
});

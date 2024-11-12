import { prisma } from '@/db';

const workshopLocations = [
  { name: 'Dubai' },
  { name: 'Singapore' },
  { name: 'Convention Organizer' },
];

const users = [
  {
    is_convention_organizer: true,
    is_delegate: false,
    is_alternate: false,
    workshop_id: BigInt(3),
    name: 'Billy Bob',
    email: 'billybob@email.com',
    wallet_address:
      'stake_test3hjbd6o28bup465uqw3ziahm7satj4507tyterkkw91bz7hdwjfro',
  },
  {
    is_convention_organizer: false,
    is_delegate: true,
    is_alternate: false,
    workshop_id: BigInt(1),
    name: 'James Jones',
    email: 'jamesjones@email.com',
    wallet_address:
      'stake_test4ilce7p39cvq576vrx4ajbin8ubuk5618uzvftllx02ca8iexksg',
  },
  {
    is_convention_organizer: false,
    is_delegate: false,
    is_alternate: true,
    workshop_id: BigInt(2),
    name: 'Sally Sue',
    email: 'sallysue@email.com',
    wallet_address:
      'stake_test5jkdf8p40dxr687wsx5bkcoj9vcvl6729vawguomm13db9jfylhtp',
  },
  {
    is_convention_organizer: false,
    is_delegate: true,
    is_alternate: false,
    workshop_id: BigInt(2),
    name: 'John Doe',
    email: 'johndoe@email.com',
    wallet_address:
      'stake_test5jkdf8p40dxr687wsx5bkcoj9vcvl6729vawguomm13db9jfueijd',
  },
];

const workshopInfo = [
  {
    name: 'Dubai',
    delegate_id: BigInt(1),
    alternate_id: BigInt(2),
    active_vote_id: BigInt(1),
  },
  {
    name: 'Singapore',
    delegate_id: BigInt(3),
    alternate_id: BigInt(4),
    active_vote_id: BigInt(4),
  },
  { name: 'Convention Organizer' },
];

const seedDB = async (): Promise<void> => {
  await prisma.workshop.createMany({ data: workshopLocations });
  await prisma.user.createMany({ data: users });
  for (const workshop of workshopInfo) {
    await prisma.workshop.update({
      where: { name: workshop.name },
      data: {
        delegate_id: workshop.delegate_id,
        alternate_id: workshop.alternate_id,
        active_voter_id: workshop.active_vote_id,
      },
    });
  }
};

seedDB()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

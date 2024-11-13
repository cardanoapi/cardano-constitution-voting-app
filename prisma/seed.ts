import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const workshopLocations = [
  { name: 'Dubai' },
  { name: 'Singapore' },
  { name: 'Convention Organizer' },
  { name: 'Buenos Aires' },
];

const users = [
  {
    is_convention_organizer: true,
    is_delegate: false,
    is_alternate: false,
    workshop_id: BigInt(3),
    name: 'Billy Bob Organizer',
    email: 'billybob@email.com',
    wallet_address:
      'stake_test1uzmx7hxevy7r63an2v968x4kw5cxdkjw0zwgxe0ph74ad3s7zmcxx',
  },
  {
    is_convention_organizer: false,
    is_delegate: true,
    is_alternate: false,
    workshop_id: BigInt(1),
    name: 'James Jones delegate',
    email: 'jamesjones@email.com',
    wallet_address:
      'stake_test1ur582xvym2mv8qj7xfny5vsm5gn8yxam7er43xu779vh0cq4tpyxh',
  },
  {
    is_convention_organizer: false,
    is_delegate: false,
    is_alternate: true,
    workshop_id: BigInt(2),
    name: 'Sally Sue alternate',
    email: 'sallysue@email.com',
    wallet_address:
      'stake_test1uqgf7pecctde8ygq25w48k8qrzzr6ap9d5nfwp8436a9g8sdmnp2k',
  },
  {
    is_convention_organizer: false,
    is_delegate: true,
    is_alternate: false,
    workshop_id: BigInt(2),
    name: 'John Doe',
    email: 'johndoe@email.com',
    wallet_address:
      'stake_test1uzryp0nzykrdmnxuu8nsu9q2vz2a22l9upq4ckn4p5uqhjgvkdd6g',
  },
  {
    is_convention_organizer: false,
    is_delegate: false,
    is_alternate: true,
    workshop_id: BigInt(1),
    name: 'Roy James',
    email: 'Royjames@email.com',
    wallet_address:
      'stake_test1uq2c7pdk3nr0mtsl9z47redcc38pvchz5czryeh643ecvpgu5v0gr',
  },
  {
    is_convention_organizer: true,
    is_delegate: false,
    is_alternate: false,
    workshop_id: BigInt(3),
    name: 'Test organizer',
    email: 'testOrganizer@email.com',
    wallet_address:
      'stake_test1urrfysygca8m9x0qypxrutl5j2n9c252mev4qmwdtzwqr6g6dj7kn',
  },
  {
    is_convention_organizer: false,
    is_delegate: false,
    is_alternate: true,
    workshop_id: BigInt(4),
    name: 'Test alternate',
    email: 'testalternate@email.com',
    wallet_address:
      'stake_test1up646zdqul0wud00ss0vszpf9g22uqc0r4k4tv7gtv8edqs5nrfs7',
  },
  {
    is_convention_organizer: false,
    is_delegate: true,
    is_alternate: false,
    workshop_id: BigInt(4),
    name: 'Test delegate',
    email: 'testdelegate@email.com',
    wallet_address:
      'stake_test1upzv3vmy37a0zk743vjfaexrxvnnv7fyhrdg5ncla6dknksjfxrpy',
  },
];

const workshopInfo = [
  {
    name: 'Dubai',
    delegate_id: BigInt(2),
    alternate_id: BigInt(5),
    active_vote_id: BigInt(2),
  },
  {
    name: 'Singapore',
    delegate_id: BigInt(4),
    alternate_id: BigInt(3),
    active_vote_id: BigInt(3),
  },
  { name: 'Convention Organizer' },
  {
    name: 'Buenos Aires',
    delegate_id: BigInt(8),
    alternate_id: BigInt(7),
    active_vote_id: BigInt(8),
  },
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

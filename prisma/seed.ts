import { prisma } from '../src/db';
import {HdKey,HdWallet} from "libcardano";



function createRange(start: number, end: number) {
  return Array.from({ length: end - start }, (_, i) => start + i);
}

function showIndex(index: number){
  return (index+1).toString().padStart(2,'0');
}

const seedDB = async (): Promise<void> => {

  // create workshops first
  const rawWorkshops = createRange(0,64).map((index)=>{return { name: 'Workshop '+showIndex(index) }})
  
  await prisma.workshop.createMany({ data: rawWorkshops });
  let workshops = (await prisma.workshop.findMany())

  const  wallet= await HdWallet.fromMnemonicString('abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon art')
  const getAccount = async (index:number)=>{
    const nthWallet=await wallet.getAccount(index)
    const singleAddrWallet = await nthWallet.singleAddressWallet()
    return singleAddrWallet.rewardAddressBech32(0)!
  }
  

 
  // make first 3 wallets for manual testing
  const organizerWallet='stake_test1urrfysygca8m9x0qypxrutl5j2n9c252mev4qmwdtzwqr6g6dj7kn'
  const delegateWAllet='stake_test1upzv3vmy37a0zk743vjfaexrxvnnv7fyhrdg5ncla6dknksjfxrpy'
  const alternateWallet='stake_test1up646zdqul0wud00ss0vszpf9g22uqc0r4k4tv7gtv8edqs5nrfs7'

  // other walelts for automated testing
  // 10 organizers
  const automatedOrganizers=await Promise.all(createRange(3,13).map(getAccount))
  // 63 delegates
  const automatedDelegates=await Promise.all(createRange(13,13+63).map(getAccount))
  // 63 alternates
  const automatedAlternates=await Promise.all(createRange(13+63,13+63+63).map(getAccount))
  

  const organizers=[organizerWallet,...automatedOrganizers].map((wallet,index)=>{
    return {
      is_convention_organizer: true,
      is_delegate: false,
      is_alternate: false,
      workshop_id: workshops[63].id, // all organizers are in the last workshop
      name: 'Test organizer '+showIndex(index),
      email: `testOrganizer${showIndex(index)}@email.com`,
      wallet_address:wallet,
    }
  });
  const delegates=[delegateWAllet,...automatedDelegates].map( (wallet,index)=>{
    return {
      is_convention_organizer: false,
      is_delegate: true,
      is_alternate: false,
      workshop_id: workshops[index].id,
      name: 'Test Delegate '+(showIndex(index)),
      email: `delegate${showIndex(index)}@email.com`,
      wallet_address:wallet,
    }
  })
  const alternates=[alternateWallet,...automatedAlternates].map( (wallet,index)=>{
    return {
      is_convention_organizer: false,
      is_delegate: false,
      is_alternate: true,
      workshop_id: workshops[index].id,
      name: 'Test Alternate '+showIndex(index),
      email: `alternate${showIndex(index)}@email.com`,
      wallet_address:wallet,
    }
  })

  await prisma.user.createMany({ data: [...organizers,...delegates,...alternates] });

  const createdDelegates=await prisma.user.findMany({where: {
    is_delegate:true
  }})
  const createdAlternates=await prisma.user.findMany({where: {
    is_alternate:true
  }})

  workshops.pop() // remove the workshop used for organizers.

  await Promise.all(
    workshops.map(async (workshop,index)=>{
      await prisma.workshop.update({
        where: { id: workshop.id },
        data: {
          delegate_id: createdDelegates[index].id,
          alternate_id: createdAlternates[index].id,
          active_voter_id:createdDelegates[index].id,
        },
    });
  }))
};

seedDB()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

import {
  Credential,
  PublicKey,
  RewardAddress,
} from '@emurgo/cardano-serialization-lib-nodejs';

/**
 * Derives the wallet's stake address from the public key
 * @param publicKey - The public key to derive the stake address from
 * @returns Wallet's stake address in bech32 format
 */
export function deriveStakeAddressFromPublicKey(publicKey: PublicKey): string {
  // Get the stake key hash from the public key
  const stakeKeyHash = publicKey.hash();

  // Create a StakeCredential using the stake key hash
  const stakeCredential = Credential.from_keyhash(stakeKeyHash);

  // Generate the stake address (e.g., for mainnet)
  const networkId = process.env.NEXT_PUBLIC_NETWORK?.toLowerCase() =='testnet'? 0 : 1; // 1 for mainnet, 0 for testnet
  const stakeAddress = RewardAddress.new(
    networkId,
    stakeCredential,
  ).to_address();

  // Convert the stake address to a bech32 string
  const stakeAddressBech32 = stakeAddress.to_bech32();

  return stakeAddressBech32;
}

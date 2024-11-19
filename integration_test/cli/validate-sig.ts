import { ed25519,loadCrypto, cborBackend,blake } from "libcardano";
import * as fs from 'fs';
import { parse } from 'csv-parse';

function veryifySg(
  stakeKeyHash: string,
  walletSignature: string,
  coseKey: string,
  signedData: string
) {
  try {
    const decodedSignature = cborBackend.decode(
      Buffer.from(walletSignature, "hex")
    );
    const externalAad: Buffer = Buffer.alloc(0);
    const protectedSerialized: Buffer = decodedSignature[0];
    const payload: Buffer = decodedSignature[2];
    const structure = ["Signature1", protectedSerialized, externalAad, payload];
    const createSigStructure = cborBackend.encode(structure);
    const signature = decodedSignature[3];

    const publicKeyBuffer = cborBackend
      .decode(Buffer.from(coseKey, "hex"))
      .get(-2);

    const keyHash = Buffer.from(
      blake.hash28(publicKeyBuffer)
    );

    const payloadUTF8 = payload.toString("utf-8");

    const isSignatureValid = ed25519.verify(publicKeyBuffer,createSigStructure,signature)


    const isMessageValid = payloadUTF8 == signedData;
    const isKeyHashValid = keyHash.toString("hex") === stakeKeyHash;

    return isSignatureValid && isMessageValid && isKeyHashValid;
  } catch (error: any) {
    throw new Error(`Message authentication failed: ${error.message}`);
  }
}

const voteData = {
  stakeKeyHash: "0b8208f033873700d57a614fff0649f2e929987dc315f1c5bce9643b",
  coseKey:
    "a4010103272006215820f9007dd8ec5843e24c69f4fa69b4b7f94af6e7ee6667a4dbfcfdffb361526956",
  signature:
    "844da20127676164647265737341ada166686173686564f458937b22766f74655f6964223a2233613265383433622d613562312d343462652d616333332d353162623738653866383339222c22616374696f6e223a22766f74655f6d756c7469706c65222c226f7074696f6e223a224b72697374696a616e204b6f77616c736b797c7c4a6f73652056656c617a7175657a222c2274696d657374616d70223a313732393431383133353436387d58402080a661dabe5fdbb606995ae78a1798898d214dadc6a3d95425684d62991e52655b93f825ab947ce45ecf4534b2588f34f6ec02f21e188a249926c0fcc2a10e",
  signedData: JSON.stringify({
    vote_id: "3a2e843b-a5b1-44be-ac33-51bb78e8f839",
    action: "vote_multiple",
    option: "Kristijan Kowalsky||Jose Velazquez",
    timestamp: 1729418135468,
  }),
};

const file = process.argv[process.argv.length-1]

loadCrypto().then(()=>{
  console.log("IsValid",
    veryifySg(
      voteData.stakeKeyHash,
      voteData.signature,
      voteData.coseKey,
      voteData.signedData
    )
  );
})




type RowData = { [key: string]: string }; // Define the structure of your row data

// Function to process each row
const processRow = (row: RowData) => {
  const signature=row.signature
  const stakeAddress=row.walletAddress
  const vote=row.vote
  const message=row.message
  console.log("row",row)
  ed25519.verify(undefined,Buffer.from(message,'hex'),Buffer.from(signature,'hex'))
  // veryifySg(
  //   bech32.decode(stakeAddress).data.toString('hex'),
  //   signature,
  //   coseKey,
  //   message
  // ) 
  
  // veryifySg()
};

const readAndProcessCSV = async (filePath: string) => {
  return new Promise<void>((resolve, reject) => {
    const parser = fs
      .createReadStream(filePath)
      .pipe(
        parse({
          columns: true, // Convert rows into objects using the first row as header
          skip_empty_lines: true,
        })
      );

    parser.on('data', (row: RowData) => {
      processRow(row);
    });

    parser.on('end', () => {
      console.log("Finished processing CSV file.");
      resolve();
    });

    parser.on('error', (err) => {
      console.error("Error reading CSV file:", err);
      reject(err);
    });

  });
};

// Usage
const filePath = './export.csv'; // Replace with your CSV file path
readAndProcessCSV(filePath).catch((err) => {
  console.error("Error:", err);
});

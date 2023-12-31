const functions = require("firebase-functions");
const { ethers } = require("ethers");
const cors = require("cors")({ origin: true });

const GamePrizeABI = require("./abi/GamePrizeABI.json");

// go to https://infura.io/ and https://alchemy.com/ to register an API key
// need to set new env variables with `firebase functions:config:set key1=val1
const INFURA_APIKEY = functions.config().infura.api_key;
const ALCHEMY_APIKEY = functions.config().alchemy.api_key;

// resolve ENS to address
exports.checkaddress = functions.https.onRequest((req, res) => {
  cors(req, res, async () => {
    const ethAddress = req.query.ethAddress;
    if (ethers.utils.isAddress(ethAddress)) {
      return res
        .status(200)
        .send({ success: true, ethAddress });
    } else {
      return res
        .status(200)
        .send({ success: false, msg: "invalid ethAddress" });
    }
  })
})

// resolve ENS to address
exports.resolveens = functions.https.onRequest((req, res) => {
  cors(req, res, async () => {
    const ens = req.query.ens;
    switch (req.method) {
      case "GET": // handle GET request
        try {
          let ethAddress = null;
          if (
            ens.includes(".base")){
              const providerBaseMainnet = new ethers.providers.JsonRpcProvider(
                {
                  url: `https://base-mainnet.g.alchemy.com/v2/${ALCHEMY_APIKEY}`,
                },
                {
                  name: `Base Mainnet`,
                  chainId: 8453,
                  ensAddress: "0xeCBaE6E54bAA669005b93342E5650d5886D54fc7"
                }
              );
              ethAddress = await providerBaseMainnet.resolveName(ens);
              network = 'base';
              if (ethAddress) {
                return res.status(200).send({
                  ens: ens.toLowerCase(),
                  success: true,
                  ethAddress: ethAddress,
                  network: 'base',
                });
              }
            }
          if (ens.includes(".eth")) {
            const providerETHMainnet = new ethers.providers.JsonRpcProvider(
              `https://mainnet.infura.io/v3/${INFURA_APIKEY}`,
            );
            ethAddress = await providerETHMainnet.resolveName(ens);
            if (ethAddress) {
              return res.status(200).send({
                ens: ens.toLowerCase(),
                success: true,
                ethAddress: ethAddress,
                network: 'eth',
              });
            } else {
              return res.status(200).send({ success: false, msg: "cannot resolve ENS" });
            }
          } else {
            return res.status(200).send({ success: false, msg: "invalid ENS" });
          }
        } catch (error) {
          res.status(200).send({ success: false, msg: "oops" });
        }
        break;
      default:
        return res.status(405).json({
          success: false,
          msg: "Unsupported request method",
        });
    }
  });
});

// drip erc20 to a player's wallet
exports.driperc20 = functions.https.onRequest((req, res) => {
  cors(req, res, async () => {
    switch (req.method) {
      case "POST": // handle POST request
        const data = req.body;
        try {
          let PrizeType = data.PrizeType;
          if (!PrizeType) {
            PrizeType = "MAPE";
          }

          // server can update the passcode
          const passcode = data.passcode;
          if (!passcode || passcode !== "113fjdakij38KAh3g") {
            return res
              .status(200)
              .send({ success: false, msg: "invalid passcode" });
          }

          const ethAddress = data.ethAddress;
          if (!ethers.utils.isAddress(ethAddress)) {
            return res
              .status(200)
              .send({ success: false, msg: "invalid address" });
          }

          if (ethAddress) {
            const providerChain = {
              goerli: new ethers.providers.JsonRpcProvider(
                `https://goerli.infura.io/v3/${INFURA_APIKEY}`,
              ),
              goerliop: new ethers.providers.JsonRpcProvider(
                `https://optimism-goerli.infura.io/v3/${INFURA_APIKEY}`,
              ),
            };

            const GamePrizeContract = {
              MAPE: {
                // update the two contract addresses if you deployed your own
                PrizeContract: "0x30a43A490C1f9bFa04BB69f8Cb5A0989d742b405",
                erc20Contract: "0x74BbDac19b8bE45B36560EA53A72C6cD0540cb17", //Mock erc20
                network: "goerli",
              },
              opMAPE: {
                // update the two contract addresses if you deployed your own
                PrizeContract: "0xc442372661EeE647D01b0EF6CbC43768aAf141e6",
                erc20Contract: "0x30a43A490C1f9bFa04BB69f8Cb5A0989d742b405", //Mock erc20
                network: "goerliop",
              },
            };

            if (!GamePrizeContract[PrizeType]) {
              return res
                .status(200)
                .send({ success: false, msg: "invalid PrizeType" });
            }

            let network = data.network;
            if (
              !network ||
              network.toLowerCase() != GamePrizeContract[PrizeType]["network"]
            ) {
              return res
                .status(200)
                .send({ success: false, msg: "invalid network" });
            }

            network = network.toLowerCase();

            const signer = new ethers.Wallet(
              functions.config().operator.pkey, // this is a hot wallet in firebase
              providerChain[network],
            );

            const nouce = await signer.getTransactionCount();
            console.log("nouce", nouce);
            const DripContract = new ethers.Contract(
              GamePrizeContract[PrizeType]["PrizeContract"],
              GamePrizeABI,
              signer,
            );

            const dripAmountBN = await DripContract.amount(
              GamePrizeContract[PrizeType]["erc20Contract"],
            );

            const dripAmount = Number(ethers.utils.formatEther(dripAmountBN));

            let tx;

            try {
              tx = await DripContract.drip(
                GamePrizeContract[PrizeType]["erc20Contract"],
                ethAddress,
              );
              await tx.wait();
            } catch (error) {
              return res.status(200).send({
                success: false,
                msg: `unable to drip ${PrizeType}. try later`,
              });
            }

            const erc20BalanceOfABI = [
              {
                inputs: [
                  {
                    internalType: "address",
                    name: "account",
                    type: "address",
                  },
                ],
                name: "balanceOf",
                outputs: [
                  { internalType: "uint256", name: "", type: "uint256" },
                ],
                stateMutability: "view",
                type: "function",
              },
            ];

            const Erc20Contract = new ethers.Contract(
              GamePrizeContract[PrizeType]["erc20Contract"],
              erc20BalanceOfABI,
              providerChain[network],
            );
            const balanceBN = await Erc20Contract.balanceOf(ethAddress);

            let playerName = ethAddress.substring(0, 8);

            if (tx) {
              return res.status(200).send({
                amount: dripAmount,
                success: true,
                prizeType: PrizeType,
                erc20: GamePrizeContract[PrizeType]["erc20Contract"],
                balance: Number(ethers.utils.formatEther(balanceBN)),
                ethAddress: ethAddress,
                msg: `Congrats!!!! ${playerName} received ${dripAmount} $${PrizeType}!!`,
              });
            } else {
              return res
                .status(200)
                .send({ success: false, msg: "invalid tx" });
            }
          } else {
            return res
              .status(200)
              .send({ success: false, msg: "invalid params" });
          }
        } catch (error) {
         return res.status(200).send({ success: false, msg: "oops" });
        }
        break;
      default:
        return res.status(405).json({
          success: false,
          msg: "Unsupported request method",
        });
    }
  });
});

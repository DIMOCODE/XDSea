import Web3 from "web3";
import Web3Utils from "web3-utils";

import { useInstance } from "./useContractInstance.js";
import config from '../lib/config'

export const Mint = async (type,Sel,from, provider, ...data) => {
  var web3 = new Web3(data.provider);
  var Contract = await useInstance(provider);

  try {
    var resp = await Contract.methods
      .minting(...data)
      .send({ from: from })
      .on("transactionHash", (transactionHash) => {
        return transactionHash;
      });

    if (resp) {
      const receipt = await UseReceipt(
        { provider },
        resp.transactionHash ? resp.transactionHash : resp
      );

      if (receipt) {
        var tokenIDReceipt = {
          status: receipt.status,
          HashValue: receipt.transactionHash,
          tokenId: Web3Utils.hexToNumber(
            type == 721 ? receipt.logs[2].topics[3]: (Sel ? receipt.logs[3].topics[3] : receipt.logs[3].topics[2] )
          ),
        };
        return tokenIDReceipt;
      }
    }
  } catch (err) {
  }
};

export const Transfer = async (from, provider, ...data) => {
  var web3 = new Web3(data.provider);
  var Contract = await useInstance(provider);

  try {
    var resp = await Contract.methods
      ._transferNFT(...data)
      .send({ from: from })
      .on("transactionHash", (transactionHash) => {
        return transactionHash;
      });

    if (resp) {
      const receipt = await UseReceipt(
        { provider },
        resp.transactionHash ? resp.transactionHash : resp
      );

      if (receipt) {
        var tokenIDReceipt = {
          status: receipt.status,
          HashValue: receipt.transactionHash,
          tokenId: data[1],
        };
        return tokenIDReceipt;
      }
    }
  } catch (err) {
  }
};

export const UseReceipt = async (data, HashValue) => {
  var web3 = new Web3(data.provider);
  var receipt = await web3.eth.getTransactionReceipt(HashValue);
  if (receipt) {
    return receipt;
  } else {
    UseReceipt(HashValue);
  }
};

export const useServiceFee = async (data) => {

  try {
    var Contract = await useInstance(data);

    var resp = await Contract.methods.getServiceFee().call();
    if (resp) {
      var web3 = new Web3(data);

      var feeDetails = {
        buyerFee: web3.utils.fromWei(String(Number(resp[0]))),
        sellerFee: web3.utils.fromWei(String(Number(resp[1]))),
        // royaltyFee: web3.utils.fromWei(String(Number(resp[2]))),
      };

      return feeDetails;
    }
  } catch (err) {
  }
};

export const SRoyalUserPercentage = async (data,id) => {

  try {
    var Contract = await useInstance(config.BNBProvider);
    var resp = await Contract.methods.getSplitRoyalty(id).call();
      return resp;
    }
   catch (err) {
  }
};


export const useSetServiceFee = async (data, provider, address) => {

  var payload = null;

  if (data) {
    var web3 = new Web3(provider);
    payload = {
      buyerFee: web3.utils.toWei(String(Number(data.buyerFee))),
      sellerFee: web3.utils.toWei(String(Number(data.sellerFee))),
    };
  }

  try {
    var Contract = await useInstance(provider);

    var resp = await Contract.methods
      .setServiceValue(payload.buyerFee, payload.sellerFee)
      .send({ from: address });
    if (resp) return true;
  } catch (err) {
  }
};

export const useSetRoyaltyFee = async (data, provider, address) => {

  var payload = null;

  if (data) {
    var web3 = new Web3(provider);
    payload = {
      royaltyFee: web3.utils.toWei(String(Number(data))),
    };
  }

  try {
    var Contract = await useInstance(provider);

    var resp = await Contract.methods
      .setRoyalty(payload.royaltyFee)
      .send({ from: address });
    if (resp) return true;
  } catch (err) {
  }
};

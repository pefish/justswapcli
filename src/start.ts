import '@pefish/js-node-assist'
import Starter from '@pefish/js-util-starter'
import { TrxWallet } from "@pefish/js-coin-trx"

declare global {
  namespace NodeJS {
    interface Global {
      logger: any,
      config: {[x: string]: any};
      debug: boolean;
    }
  }
}

global.logger = console

Starter.startAsync(async () => {
  const wallet = new TrxWallet()
  const command = process.argv[2]
  if (command === "removeLiquidity") {
    const pkey = process.argv[3]
    if (!pkey) {
      global.logger.error("必须指定私钥")
      return
    }
    let a
    try {
      a = wallet.getAllFromPkey(pkey)
    } catch (err) {
      global.logger.error("私钥不对")
      return
    }
    // 先获取流动性余额
    const liquidityBalance = await wallet.getTokenBalance(a.address, "TQn9Y2khEsLJW1ChVWFMSMeRDow5KcbLSE")
    if (liquidityBalance.lt_(0)) {
      global.logger.error("此账号没有流动性")
      return
    }
    // 发送接触流动性交易
    const tx = await wallet.buildContractCallTx(pkey, "TQn9Y2khEsLJW1ChVWFMSMeRDow5KcbLSE", "removeLiquidity(uint256,uint256,uint256,uint256)", [
      {
        type: "uint256",
        value: liquidityBalance
      },
      {
        type: "uint256",
        value: "1"
      },
      {
        type: "uint256",
        value: "1"
      },
      {
        type: "uint256",
        value: (Date.now() / 1000).toInt_() + 2 * 3600,
      }
    ])
    // logger.info(util.inspect(tx.txData, false, 10))
    await wallet.sendRawTx(tx.txData)
    global.logger.info(`发送成功 txid: ${tx.txId}`)
  } else {
    global.logger.error("命令不对")
  }
}, null, true)



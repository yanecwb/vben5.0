import { sm2 } from 'sm-crypto'

// 公钥
const publicKey = '02f0913ea4d453fcac97d1ae2b9abcb83b395ec6ac0ab4a556dd95128aa35a8b15'

export function smCrypto(data: any) {
  // 1 - C1C3C2，0 - C1C2C3，默认为1
  const cipherMode = 1
  // 加密结果
  return '04' + sm2.doEncrypt(data, publicKey, cipherMode)
}

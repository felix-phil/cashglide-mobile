import * as Crypto from "expo-crypto";

export class Hashing {
  static async toHash(str: string) {
    const hashedString = await Crypto.digestStringAsync(
      Crypto.CryptoDigestAlgorithm.SHA256,
      str
    );
    return hashedString;
  }

  static async compare(
    storedHashedStr: string,
    suppliedStr: string
  ): Promise<boolean> {
    const hashedSupplied = await this.toHash(suppliedStr);

    return storedHashedStr === hashedSupplied;
  }
}

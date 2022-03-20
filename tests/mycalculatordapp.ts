import * as anchor from "@project-serum/anchor";
import { Program } from "@project-serum/anchor";
import { assert } from "chai";
import { Mycalculatordapp } from "../target/types/mycalculatordapp";

describe("mycalculatordapp", () => {
  // Configure the client to use the local cluster.
  const provider = anchor.Provider.env();
  anchor.setProvider(provider);

  const calculator = anchor.web3.Keypair.generate();
  const program = anchor.workspace.Mycalculatordapp as Program<Mycalculatordapp>;
  const INIT_MESSAGE = "Welcome to Calculator";

  it("Creates a calculator", async () => {
    await program.rpc.create(INIT_MESSAGE, {
      accounts: {
        calculator: calculator.publicKey,
        user: provider.wallet.publicKey,
        systemProgram: anchor.web3.SystemProgram.programId,
      },
      signers: [calculator]
    });

    const account = await program.account.calculator.fetch(calculator.publicKey);
    assert.ok(account.greeting === INIT_MESSAGE);

  });

  it("Adds two numbers", async () => {
    await program.rpc.add(new anchor.BN(33), new anchor.BN(36), {
      accounts: {
        calculator: calculator.publicKey
      }
    });

    const account = await program.account.calculator.fetch(calculator.publicKey);
    assert.ok(account.result.eq(new anchor.BN(69)));
    assert.ok(account.greeting === INIT_MESSAGE);
  });

  it("Subtracts two numbers", async () => {
    await program.rpc.subtract(new anchor.BN(135), new anchor.BN(66), {
      accounts: {
        calculator: calculator.publicKey
      }
    });

    const account = await program.account.calculator.fetch(calculator.publicKey);
    assert.ok(account.result.eq(new anchor.BN(69)));
    assert.ok(account.greeting === INIT_MESSAGE);
  });

  it("Multiplies two numbers", async () => {
    await program.rpc.multiply(new anchor.BN(9), new anchor.BN(5), {
      accounts: {
        calculator: calculator.publicKey
      }
    });

    const account = await program.account.calculator.fetch(calculator.publicKey);
    assert.ok(account.result.eq(new anchor.BN(45)));
    assert.ok(account.greeting === INIT_MESSAGE);
  });

  it("Divides two numbers", async () => {
    await program.rpc.divide(new anchor.BN(139), new anchor.BN(2), {
      accounts: {
        calculator: calculator.publicKey
      }
    });

    const account = await program.account.calculator.fetch(calculator.publicKey);
    assert.ok(account.result.eq(new anchor.BN(69.5)));
    assert.ok(account.remainder.eq(new anchor.BN(1)));
    assert.ok(account.greeting === INIT_MESSAGE);
  });
});

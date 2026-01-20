import { describe, it, expect } from 'vitest';
import { Cl } from '@stacks/transactions';

const accounts = simnet.getAccounts();
const wallet1 = accounts.get('wallet_1')!;
const wallet2 = accounts.get('wallet_2')!;

describe('SatoshiFarm', () => {
  it('allows listing a new item', () => {
    const name = 'Organic Tomatoes';
    const description = 'Fresh organic tomatoes from the farm';
    const imageUrl = 'https://example.com/tomatoes.jpg';
    const price = 1000; // in microSTX or USDCx units
    const quantity = 10;

    const listResult = simnet.callPublicFn('toshi-farm', 'list-item', [
      Cl.stringAscii(name),
      Cl.stringAscii(description),
      Cl.stringAscii(imageUrl),
      Cl.uint(price),
      Cl.uint(quantity)
    ], wallet1);

    expect(listResult.result).toBeOk(Cl.uint(1)); // First item ID

    const item = simnet.callReadOnlyFn('toshi-farm', 'get-item', [Cl.uint(1)], wallet1);
    expect(item.result).toBeSome(
      Cl.tuple({
        name: Cl.stringAscii(name),
        description: Cl.stringAscii(description),
        'image-url': Cl.stringAscii(imageUrl),
        price: Cl.uint(price),
        quantity: Cl.uint(quantity),
        seller: Cl.principal(wallet1),
        active: Cl.bool(true)
      })
    );
  });

  it('allows buying with STX', () => {
    // First list an item
    simnet.callPublicFn('toshi-farm', 'list-item', [
      Cl.stringAscii('Apples'),
      Cl.stringAscii('Red apples'),
      Cl.stringAscii('https://example.com/apples.jpg'),
      Cl.uint(500),
      Cl.uint(5)
    ], wallet1);

    // Buy 2 units with STX
    const buyResult = simnet.callPublicFn('toshi-farm', 'buy-item', [
      Cl.uint(1),
      Cl.uint(2),
      Cl.bool(true) // use STX
    ], wallet2);

    expect(buyResult.result).toBeOk(Cl.bool(true));

    // Check item quantity updated
    const item = simnet.callReadOnlyFn('toshi-farm', 'get-item', [Cl.uint(1)], wallet1);
    expect(item.result).toBeSome(
      Cl.tuple({
        name: Cl.stringAscii('Apples'),
        description: Cl.stringAscii('Red apples'),
        'image-url': Cl.stringAscii('https://example.com/apples.jpg'),
        price: Cl.uint(500),
        quantity: Cl.uint(3), // 5 - 2
        seller: Cl.principal(wallet1),
        active: Cl.bool(true)
      })
    );

    // Check seller STX earnings
    const earnings = simnet.callReadOnlyFn('toshi-farm', 'get-seller-stx-earnings', [Cl.principal(wallet1)], wallet1);
    expect(earnings.result).toBeUint(1000); // 500 * 2
  });

  it('allows buying with USDCx', () => {
    // List an item
    simnet.callPublicFn('toshi-farm', 'list-item', [
      Cl.stringAscii('Bananas'),
      Cl.stringAscii('Yellow bananas'),
      Cl.stringAscii('https://example.com/bananas.jpg'),
      Cl.uint(300),
      Cl.uint(10)
    ], wallet1);

    // Buy 3 units with USDCx
    const buyResult = simnet.callPublicFn('toshi-farm', 'buy-item', [
      Cl.uint(1),
      Cl.uint(3),
      Cl.bool(false) // use USDCx
    ], wallet2);

    expect(buyResult.result).toBeOk(Cl.bool(true));

    // Check seller USDCx earnings
    const earnings = simnet.callReadOnlyFn('toshi-farm', 'get-seller-usdcx-earnings', [Cl.principal(wallet1)], wallet1);
    expect(earnings.result).toBeUint(900); // 300 * 3
  });

  it('allows withdrawing STX earnings', () => {
    // List an item and buy with STX
    simnet.callPublicFn('toshi-farm', 'list-item', [
      Cl.stringAscii('Oranges'),
      Cl.stringAscii('Juicy oranges'),
      Cl.stringAscii('https://example.com/oranges.jpg'),
      Cl.uint(200),
      Cl.uint(5)
    ], wallet1);

    simnet.callPublicFn('toshi-farm', 'buy-item', [
      Cl.uint(1),
      Cl.uint(5),
      Cl.bool(true) // use STX
    ], wallet2);

const withdrawResult = simnet.callPublicFn('toshi-farm', 'withdraw-stx', [], wallet1);
    expect(withdrawResult.result).toBeOk(Cl.uint(1000)); // 200 * 5

    // Check earnings reset
    const earnings = simnet.callReadOnlyFn('toshi-farm', 'get-seller-stx-earnings', [Cl.principal(wallet1)], wallet1);
    expect(earnings.result).toBeUint(0);
  });

  it('allows withdrawing USDCx earnings', () => {
    // List an item and buy with USDCx
    simnet.callPublicFn('toshi-farm', 'list-item', [
      Cl.stringAscii('Grapes'),
      Cl.stringAscii('Sweet grapes'),
      Cl.stringAscii('https://example.com/grapes.jpg'),
      Cl.uint(100),
      Cl.uint(9)
    ], wallet1);

    simnet.callPublicFn('toshi-farm', 'buy-item', [
      Cl.uint(1),
      Cl.uint(9),
      Cl.bool(false) // use USDCx
    ], wallet2);

    const withdrawResult = simnet.callPublicFn('toshi-farm', 'withdraw-usdcx', [], wallet1);
    expect(withdrawResult.result).toBeOk(Cl.uint(900)); // 100 * 9

    // Check earnings reset
    const earnings = simnet.callReadOnlyFn('toshi-farm', 'get-seller-usdcx-earnings', [Cl.principal(wallet1)], wallet1);
    expect(earnings.result).toBeUint(0);
  });

  it('fails to buy inactive item', () => {
    // List item with quantity 1
    simnet.callPublicFn('toshi-farm', 'list-item', [
      Cl.stringAscii('Single Apple'),
      Cl.stringAscii('One apple'),
      Cl.stringAscii('https://example.com/apple.jpg'),
      Cl.uint(100),
      Cl.uint(1)
    ], wallet1);

    // Buy the only unit
    simnet.callPublicFn('toshi-farm', 'buy-item', [
      Cl.uint(3),
      Cl.uint(1),
      Cl.bool(true)
    ], wallet2);

    // Try to buy again
    const buyAgain = simnet.callPublicFn('toshi-farm', 'buy-item', [
      Cl.uint(3),
      Cl.uint(1),
      Cl.bool(true)
    ], wallet2);

    expect(buyAgain.result).toBeErr(Cl.uint(102)); // ERR_ITEM_INACTIVE
  });

  it('fails to withdraw zero earnings', () => {
    const withdrawResult = simnet.callPublicFn('toshi-farm', 'withdraw-stx', [], wallet2);
    expect(withdrawResult.result).toBeErr(Cl.uint(104)); // ERR_NO_EARNINGS
  });
});
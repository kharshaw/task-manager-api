function addNUmbers(numberOne: number, numberTwo: number): number {
  return numberOne + numberTwo;
}

describe('Example Test', () => {
  it('equals true', () => {
    expect(true).toEqual(true);
  });
  it('equals 4', () => {
    expect(addNUmbers(3, 1)).toEqual(4);
  });
});

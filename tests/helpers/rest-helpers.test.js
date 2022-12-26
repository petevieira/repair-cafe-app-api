
const {
  objectHasRequiredProperties,
  validateRequest } = require('../../src/helpers/rest-helpers'); // validator

describe('objectHasRequiredProperties', () => {
  test('should succeed if all fields are present', async () => {
    // arrange
    const expectedUser = {
      first: 'first',
      last: 'last',
      email: 'email',
      roles: ['user']
    };

    // act
    const result = validateRequest(
      expectedUser, ['first', 'last', 'email', 'roles'], 'myObject');

    // assert
    expect(result).toStrictEqual(true);
  });

  test('should fail if any fields are absent', async () => {
    // arrange
    const expectedUser = {
      last: 'last',
      roles: ['user']
    };

    // act
    const result = validateRequest(
      expectedUser, ['first', 'last', 'email', 'roles'], 'myObject');

    // assert
    expect(result).toMatch('required but missing');
  });
});

describe('validateRequest', () => {
  test('should succeed if all fields are present', async () => {
    // arrange
    const expectedUser = {
      first: 'first',
      last: 'last',
      email: 'email',
      roles: ['user']
    };

    // act
    const result = validateRequest(
      expectedUser, ['first', 'last', 'email', 'roles']);

    // assert
    expect(result).toStrictEqual(true);
  });

  test('should fail if any fields are absent', async () => {
    // arrange
    const expectedUser = {
      first: 'first',
      email: 'email',
      roles: ['user']
    };

    // act
    const result = validateRequest(
      expectedUser, ['first', 'last', 'email', 'roles']);

    // assert
    expect(result).toMatch('required but missing');
    expect(result !== true).toEqual(true);
  });
});

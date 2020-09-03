const { query } = require("../db_config");
const { createStringifyObj } = require("./helpers");

const login = async params => {
  const { email, password } = createStringifyObj(params);
  try {
    return await query(
      `SELECT * FROM customers_address WHERE email=${email} AND password=${password} AND status='active'`
    );
  } catch (e) {
    return e;
  }
};

const register = async params => {
  const { email, password } = createStringifyObj(params);

  try {
    return await query(
      `INSERT INTO customers_address (email, password) VALUES (${email}, ${password})`
    );
  } catch (e) {
    return e;
  }
};

const emailExists = async params => {
  const { email } = createStringifyObj(params);
  try {
    return await query(`
      SELECT * FROM customers_address WHERE email=${email} AND status='active'
    `);
  } catch (e) {
    return e;
  }
};

const socialIdExists = async params => {
  const { id } = createStringifyObj(params);
  try {
    return await query(`
      SELECT * FROM customers_address WHERE social_login_id=${id} AND status='active'
    `);
  } catch (e) {
    return e;
  }
};

const socialRegister = async params => {
  const { name, email, id } = createStringifyObj(params);

  try {
    return await query(
      `INSERT INTO customers_address (name, email, social_login_id) VALUES (${name}, ${email}, ${id})`
    );
  } catch (e) {
    return e;
  }
};

module.exports = {
  login,
  register,
  emailExists,
  socialRegister,
  socialIdExists
};

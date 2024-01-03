//Tư duy model
/*
Mỗi model tương ứng 1 table
Trong 1 controller có thể có nhiều model
*/
const sql = require("../utils/db");
module.exports = {
  all: (status, keyword) => {
    let filter = sql`WHERE name IS NOT NULL`;

    if (status !== undefined) {
      filter = sql`${filter} AND status = ${status}`;
    }
    if (keyword?.length) {
      filter = sql`${filter} AND (LOWER(name) LIKE ${
        "%" + keyword + "%"
      } OR LOWER(email) LIKE LOWER(${"%" + keyword + "%"}))`;
    }

    return sql`SELECT * FROM users ${filter} ORDER BY created_at DESC`;
  },

  emailUnique: async (email) => {
    const result = await sql`SELECT id FROM users WHERE email=${email}`;
    return result.length ? false : true;
  },

  checkEmail: async (email, userId = null) => {
    let query = sql`SELECT COUNT(*) AS count FROM users WHERE LOWER(email) = LOWER(${email})`;

    if (userId) {
      query = sql`${query} AND id <> ${userId}`;
    }

    const [{ count }] = await query;
    return +count === 0;
  },

  create: async (data) => {
    const { name, email, status } = data;
    const result = await sql`
      INSERT INTO users (name, email, status)
      VALUES (${name}, ${email}, ${status})
    `;

    return result;
  },

  findById: async (id) => {
    const [user] = await sql`SELECT * FROM users WHERE id = ${id}`;
    return user;
  },

  update: async (id, updatedUserData) => {
    const { name, email, status } = updatedUserData;

    const result = await sql`
      UPDATE users
      SET name = ${name}, email = ${email}, status = ${
      +status === 1 ? true : false
    }
      WHERE id = ${id}
    RETURNING *;`;
    return result[0];
  },

  delete: async (id) => {
    const result = await sql`DELETE FROM users WHERE id = ${id}`;
    return result;
  },
};

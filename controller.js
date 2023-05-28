const pool = require("./database");
const formatDate = require("./middleware");
//champs a = airport
//field b = from : DATE
//field c = to  : DATE
//field q = fir
//get all notams
const getAllNotams = async (req, res) => {
  try {
    const notams = await pool.query("SELECT * FROM notams");
    res.json(notams.rows).status(200);
  } catch (err) {
    res.json(err.message).status(400);
  }
};

//get all notams that started after a given date
const getNotamsByStartDate = async (req, res) => {
  try {
    const startDate = formatDate(req.params.startDate);
    console.log(startDate);
    const response = await pool.query(
      `select * from notams where field_b > $1`,
      [startDate]
    );
    res.json(response.rows).status(200);
  } catch (err) {
    res.json(err.message).status(400);
  }
};

//get all notams that end before a given date
const getNotamsByEndDate = async (req, res) => {
  try {
    const endDate = formatDate(req.params.endDate);
    console.log(endDate);
    const response = await pool.query(
      `select * from notams where field_c < $1`,
      [endDate]
    );
    res.json(response.rows).status(200);
  } catch (err) {
    res.json(err.message).status(400);
  }
};

//get all active notams (their end date is not reached yet)
const getActiveNotams = async (req, res) => {
  try {
    const currentDate = formatDate(Date.now());
    const response = await pool.query(
      "select * from notams where field_c > $1",
      [currentDate]
    );
    res.json(response.rows).status(200)``;
  } catch (err) {
    res.json(err.message).status(400);
  }
};

//add a new notam
const addNotam = async (req, res) => {
  try {
    const newNotam = req.body;
    console.log(newNotam);
    const response = await pool.query(
      "INSERT INTO notams (num_ntm, field_q, field_a, field_b, field_c, field_d, field_e, field_f, field_g) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)",
      [
        newNotam.num_notam,
        newNotam.champs_q,
        newNotam.champs_a,
        newNotam.champs_b,
        newNotam.champs_c,
        newNotam.champs_d,
        newNotam.champs_e,
        newNotam.champs_f,
        newNotam.champs_g,
      ]
    );
    res.json(response.rows).status(200);
  } catch (err) {
    res.json(err.message).status(400);
  }
};

//update an existing notam
const updateNotam = async (req, res) => {
  try {
    const notam = req.body;
    const keys = Object.keys(notam);
    const values = Object.values(notam);

    // dynamically build the SET clause of the SQL query using the keys and values of the updated object
    const setClause = keys
      .map((key, index) => `${key} = $${index + 1}`)
      .join(", ");

    const query = {
      text: `UPDATE notams SET ${setClause} WHERE num_ntm = $${
        keys.length + 1
      }`,
      values: [...values, notam.num_ntm],
    };

    const response = await pool.query(query);
    res.json(response.rows).status(200);
  } catch (err) {
    res.json(err.message).status(400);
  }
};

//delete notam

const deleteNotam = async (req, res) => {
  try {
    const notam = req.params.num_ntm;
    const response = await pool.query("DELETE FROM notams WHERE num_ntm = $1", [
      notam,
    ]);
    res.json(response.rows).status(200);
  } catch (err) {
    res.json(err.message).status(400);
  }
};

const addCircle = async (req, res) => {
  try {
    const center = req.body.center;
    const radius = req.body.radius;
    const response = await pool.query(
      "INSERT INTO circles (center, radius) VALUES ('($1)', $2);",
      [center, radius]
    );
    res.json(response.rows).status(200);
  } catch (err) {
    res.json(err.message).status(400);
  }
};
const addPolygon = async (req, res) => {
  try {
    const points = req.body.points;
    const response = await pool.query(
      "INSERT INTO polygons (vertices) VALUES ($1);",
      [points]
    );
    res.json(response.rows).status(200);
  } catch (err) {
    res.json(err.message).status(400);
  }
};

module.exports = {
  getAllNotams,
  getNotamsByStartDate,
  getNotamsByEndDate,
  deleteNotam,
  getActiveNotams,
  addNotam,
  updateNotam,
  addCircle,
  addPolygon,
};

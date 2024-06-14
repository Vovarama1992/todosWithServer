CREATE TABLE todos (
  id SERIAL PRIMARY KEY,
  text TEXT,
  completed BOOLEAN DEFAULT FALSE,
  year INT,
  month INT,
  day INT,
  week_of_month INT
);
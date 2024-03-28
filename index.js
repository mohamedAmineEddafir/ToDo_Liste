import express from "express";
import bodyParser from "body-parser";
import pg from "pg";

const app = express();
const port = 3000;

const db = new pg.Client({
  user: "postgres",
  host: "localhost",
  password: "Med123@",
  port: 5432,
  database: "listitems",
});

db.connect();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

let items = [
  { id: 1, title: "Buy milk" },
  { id: 2, title: "Finish homework" },
];

//My title will automatically generate a daily schedule.
const weekday = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];
const d = new Date();
let day = weekday[d.getDay()];

app.get("/", async (req, res) => {
  try{
    const result = await db.query("SELECT * FROM items ORDER BY id ASC");
    items = result.rows;
  
    //console.log(items);
    res.render("index.ejs", { listTitle: day, listItems: items });
  } catch (err) {
    console.log(err);
  }
});

app.post("/add", async (req, res) => {
  const item = req.body.newItem;
  try {
    await db.query("INSERT INTO items (titels) VALUES ($1)",[item]);
    // items.push({ title: items });
    res.redirect("/");
  } catch (err) {
    console.log(err);
  }
});

app.post("/edit", async (req, res) => {
  const updatedTitle = req.body.updatedItemTitle;
  const updatedId = req.body.updatedItemId;

  try{
    await db.query("UPDATE items SET titels = ($1) WHERE id = $2",[updatedTitle, updatedId]);
    res.redirect('/');
  }catch(err){
    console.log(err);
  }
});

app.post("/delete", async (req, res) => {
  const deleteIdItem = req.body.deleteItemId;

  try{
    await db.query("DELETE FROM items WHERE id = $1",[deleteIdItem]);
    res.redirect('/');
  } catch (err) {
    console.log(err);
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

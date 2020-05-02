// Importing required libraries
//const express = require("express");
import express from "express";
//const fetch = require("node-fetch");
import fetch from "node-fetch";

// Importing SQLite
import sqlite3 from "sqlite3";

const dbSettings = {
	filename: './tmp/litterdata.db',
	driver: sqlite3.Database
};



const app = express();

// Port selection
const port = process.env.PORT || 3000;

// Wiring up server to use Public folder
app.use(express.static("public"));

app.listen(port, () =>
  console.log(`LitterLogger server listening on port ${port}!`)
);

// JSON data Features
app.get("/api", (req, res) => {
  processDataForFrontEnd(req, res);
});

function processDataForFrontEnd(req, res) {
  const baseURL =
    "https://data.princegeorgescountymd.gov/resource/9tsa-iner.json";

  //Fetch API Call
  fetch(baseURL)
    .then((response) => response.json())
    .then((data) => {
      //console.log("LitterTrak data", data);
      const dataPoints = [];

      data.forEach((r) => {
        dataPoints.push({
          lat: r.geocoded_column.longitude,
          lng: r.geocoded_column.latitude,
          total_bags: r.total_bags_litter,
        })
      });
      //console.log("Filter to lat, long, and total bags", dataPoints);
      res.send({ dataPoints }); // Return data to front end
    })
    .catch((err) => {
      console.log(err);
      res.redirect("/error");
    });
}

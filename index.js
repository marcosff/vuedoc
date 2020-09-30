"use strict"

const fs = require('fs');
const readline = require('readline');
const ReadFile = require('./src/readfiles.js')

new ReadFile(process.argv[2]).init(fs, readline)

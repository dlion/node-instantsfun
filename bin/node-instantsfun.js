#!/usr/bin/env node
var instantsfun = require('../lib/instantsfun.js'),
    blessed     = require('blessed'),
    exec        = require('child_process').exec;

//Create a screen object
var screen = blessed.screen();

/**
 * Ncurses
 */
var table = blessed.box({
  left: 0,
  top: 0,
  width: screen.width,
  height: screen.height
});

var title   = blessed.box({
  top: '1%',
  height: '4%',
  width: screen.width,
  align: 'center',
  content: '{red-fg}Node{/red-fg}-InstantsFun!',
  tags: true,
  style: {
    fg: 'white',
    bg: 'blue'
  }
});

var list = blessed.list({
  selectedFg: 'gray',
  selectedBg: 'white',
  parent: table,
  top: '4%',
  left: 0
});

var message = blessed.box({
  width: '50%',
  height: 3,
  border: {
    type: 'line'
  },
  tags: true,
  top: 'center',
  left: 'center',
  content: "{center}Fetching data from the web...{/center}"
});


/**
 * Append object into screen and table
 */
screen.append(table);
table.append(title);
table.append(message);
screen.render();

// My index List
var arrayIndex = 0;
//Session
var mplayer;


/**
 * Exit
 */
screen.key(['escape', 'q', 'C-c'], function() {
  return process.exit(0);
});

/**
 * Retrieve all sounds
 */
instantsfun.getAllList(function(obj) {
  var index;
  //Add all title into list
  for(index in obj) {
    list.add(obj[index].title);
  }
  //Add to table box
  table.append(list);

  /**
   * When Press a key into list
   */
  list.on('keypress', function(ch, key) {
    if(key.name === "down") {
      list.down(1);
      //Put down and decrease the index
      if(arrayIndex < obj.length-1) {
        arrayIndex += 1;
      }
    } else if(key.name === "up") {
      list.up(1);
      //Put up and increase the index
      if(arrayIndex > 0) {
        arrayIndex -= 1;
      }
    } else if(key.name === "enter") {
      //Execute music
      mplayer = exec("mplayer "+obj[arrayIndex].song);
    } else if(key.name === "x") {
      //Kill the music
      mplayer.kill();
    }

    screen.render();
  });
  list.focus();
  screen.render();
});

